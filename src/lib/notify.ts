import nodemailer from 'nodemailer';
import { prisma } from './prisma';

// 渲染通知模板（替换占位符）
function renderTemplate(template: string, data: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
  }
  return result;
}

// 发送预约状态变更通知（使用模板）
export async function sendBookingStatusNotification(
  booking: {
    id: number;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    line: { name: string };
    requirement: string;
  },
  status: string,
  adminNote?: string
): Promise<void> {
  const statusMessages: Record<string, string> = {
    CONFIRMED: '已确认',
    CANCELLED: '已拒绝',
    IN_PROGRESS: '执行中',
    COMPLETED: '已完成',
  };

  if (!statusMessages[status]) return;

  // 获取通知模板
  const templates = await prisma.setting.findMany({
    where: { key: { in: [`email_template_${status.toLowerCase()}`, `sms_template_${status.toLowerCase()}`] } },
  });
  
  const emailTemplate = templates.find(t => t.key === `email_template_${status.toLowerCase()}`)?.value || '';
  const smsTemplate = templates.find(t => t.key === `sms_template_${status.toLowerCase()}`)?.value || '';

  // 准备模板数据
  const templateData: Record<string, string> = {
    contactName: booking.contactName,
    bookingId: String(booking.id),
    lineName: booking.line.name,
    requirement: booking.requirement,
    adminNote: adminNote ? `<tr><td style="padding:8px 0;color:#6B7280;">管理员备注</td><td style="padding:8px 0;">${adminNote}</td></tr>` : '',
    adminNoteText: adminNote || '',
  };

  // 渲染邮件模板并发送
  const subject = `【MeatTech Pro】预约 #${booking.id} ${statusMessages[status]}`;
  const emailContent = emailTemplate ? renderTemplate(emailTemplate, templateData) : '';

  if (emailContent) {
    // 发送给预约人（如果有邮箱）
    if (booking.contactEmail) {
      await sendEmailNotification(subject, emailContent, booking.contactEmail);
    }
    // 同时发送给管理员通知邮箱
    await sendEmailNotification(subject, emailContent);
  }

  // 渲染并发送短信通知
  const smsContent = smsTemplate ? renderTemplate(smsTemplate, templateData) : `【MeatTech Pro】您的预约 #${booking.id} 已${statusMessages[status]}。${adminNote ? `备注：${adminNote}` : ''}如有疑问请联系 400-xxx-xxxx`;
  
  if (booking.contactPhone) {
    await sendSMSNotification(smsContent, booking.contactPhone);
  }
  
  // 同时发送给管理员通知手机
  await sendSMSNotification(smsContent);
}

// 发送邮件通知（支持指定收件人）
export async function sendEmailNotification(subject: string, html: string, to?: string): Promise<boolean> {
  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: ['notify_email', 'smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from'] } },
    });
    const config: Record<string, string> = {};
    settings.forEach(s => { config[s.key] = s.value; });

    const toEmail = to || config['notify_email'];
    if (!toEmail) return false;

    // 如果配置了 SMTP，使用配置的 SMTP；否则使用控制台输出（开发模式）
    if (config['smtp_host'] && config['smtp_user']) {
      const transporter = nodemailer.createTransport({
        host: config['smtp_host'],
        port: parseInt(config['smtp_port'] || '587'),
        secure: false,
        auth: {
          user: config['smtp_user'],
          pass: config['smtp_pass'],
        },
      });
      await transporter.sendMail({
        from: config['smtp_from'] || config['smtp_user'],
        to: toEmail,
        subject,
        html,
      });
    } else {
      // 开发模式：输出到控制台，实际部署时需配置 SMTP
      console.log('=== EMAIL NOTIFICATION (DEV MODE) ===');
      console.log('To:', toEmail);
      console.log('Subject:', subject);
      console.log('Body:', html);
      console.log('=======================================');
      // 尝试使用免费的 Resend API（如果配置了 API key）
      if (process.env.RESEND_API_KEY) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'MeatTech Pro <noreply@meattech.pro>',
            to: [toEmail],
            subject,
            html,
          }),
        });
      }
    }
    return true;
  } catch (error) {
    console.error('Email notification failed:', error);
    return false;
  }
}

// 发送短信通知（支持指定收件人）
export async function sendSMSNotification(message: string, to?: string): Promise<boolean> {
  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: ['notify_phone', 'sms_webhook'] } },
    });
    const config: Record<string, string> = {};
    settings.forEach(s => { config[s.key] = s.value; });

    const phone = to || config['notify_phone'];
    const webhook = config['sms_webhook'];
    if (!phone) return false;

    if (webhook) {
      // 通过 Webhook 发送到用户配置的短信服务
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message, source: 'MeatTech Pro' }),
      });
    } else {
      // 开发模式：输出到控制台
      console.log('=== SMS NOTIFICATION (DEV MODE) ===');
      console.log('To:', phone);
      console.log('Message:', message);
      console.log('====================================');
      // 如果配置了腾讯云 SMS
      if (process.env.TENCENT_SMS_SECRET_ID && process.env.TENCENT_SMS_SECRET_KEY) {
        console.log('[SMS] Tencent Cloud SMS configured but not implemented yet');
      }
    }
    return true;
  } catch (error) {
    console.error('SMS notification failed:', error);
    return false;
  }
}

// 新预约通知
export async function notifyNewBooking(booking: {
  id: number;
  contactName: string;
  company: string;
  line: { name: string };
  requirement: string;
}) {
  const subject = `【MeatTech Pro】新预约通知 #${booking.id}`;
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
      <h2 style="color:#1E3A8A;margin:0 0 16px;">📅 新的中试预约</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#6B7280;width:100px;">预约编号</td><td style="padding:8px 0;font-weight:600;">#${booking.id}</td></tr>
        <tr><td style="padding:8px 0;color:#6B7280;">联系人</td><td style="padding:8px 0;">${booking.contactName}</td></tr>
        <tr><td style="padding:8px 0;color:#6B7280;">单位</td><td style="padding:8px 0;">${booking.company}</td></tr>
        <tr><td style="padding:8px 0;color:#6B7280;">预约产线</td><td style="padding:8px 0;">${booking.line.name}</td></tr>
        <tr><td style="padding:8px 0;color:#6B7280;">实验需求</td><td style="padding:8px 0;">${booking.requirement}</td></tr>
      </table>
      <div style="margin-top:20px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://meattech-pro.vercel.app'}/admin/bookings" style="display:inline-block;background:#1E3A8A;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:.9rem;">前往后台处理 →</a>
      </div>
    </div>
  `;
  await sendEmailNotification(subject, html);
  await sendSMSNotification(`【MeatTech Pro】新预约 #${booking.id}：${booking.contactName}(${booking.company}) 预约了 ${booking.line.name}，请登录后台处理。`);
}
