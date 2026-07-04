import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// 获取所有设置
export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const settings = await prisma.setting.findMany();
    const result: Record<string, string> = {};
    settings.forEach(s => { result[s.key] = s.value; });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: '获取设置失败' }, { status: 500 });
  }
}

// 保存设置
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    for (const [key, value] of Object.entries(body)) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }
    return NextResponse.json({ success: true, message: '设置已保存' });
  } catch (error) {
    return NextResponse.json({ error: '保存失败', detail: String(error) }, { status: 500 });
  }
}

// 初始化默认通知模板（如果不存在）
export async function PUT() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const defaultTemplates = [
      { key: 'email_template_confirmed', value: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
  <h2 style="color:#059669;margin:0 0 16px;">✅ 预约已确认</h2>
  <p style="font-size:1.1rem;margin-bottom:16px;">尊敬的 {{contactName}}，您的预约已<strong>确认</strong></p>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:8px 0;color:#6B7280;width:100px;">预约编号</td><td style="padding:8px 0;font-weight:600;">#{{bookingId}}</td></tr>
    <tr><td style="padding:8px 0;color:#6B7280;">预约产线</td><td style="padding:8px 0;">{{lineName}}</td></tr>
    <tr><td style="padding:8px 0;color:#6B7280;">实验需求</td><td style="padding:8px 0;">{{requirement}}</td></tr>
    {{adminNote}}
  </table>
</div>` },
      { key: 'email_template_cancelled', value: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
  <h2 style="color:#DC2626;margin:0 0 16px;">❌ 预约已取消</h2>
  <p style="font-size:1.1rem;margin-bottom:16px;">尊敬的 {{contactName}}，抱歉您的预约已<strong>取消</strong></p>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:8px 0;color:#6B7280;width:100px;">预约编号</td><td style="padding:8px 0;font-weight:600;">#{{bookingId}}</td></tr>
    <tr><td style="padding:8px 0;color:#6B7280;">预约产线</td><td style="padding:8px 0;">{{lineName}}</td></tr>
    {{adminNote}}
  </table>
</div>` },
      { key: 'email_template_in_progress', value: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
  <h2 style="color:#1E3A8A;margin:0 0 16px;">▶️ 实验执行中</h2>
  <p style="font-size:1.1rem;margin-bottom:16px;">尊敬的 {{contactName}}，您的预约实验已<strong>开始执行</strong></p>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:8px 0;color:#6B7280;width:100px;">预约编号</td><td style="padding:8px 0;font-weight:600;">#{{bookingId}}</td></tr>
    <tr><td style="padding:8px 0;color:#6B7280;">预约产线</td><td style="padding:8px 0;">{{lineName}}</td></tr>
  </table>
</div>` },
      { key: 'email_template_completed', value: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
  <h2 style="color:#059669;margin:0 0 16px;">✅ 实验已完成</h2>
  <p style="font-size:1.1rem;margin-bottom:16px;">尊敬的 {{contactName}}，您的预约实验已<strong>完成</strong></p>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:8px 0;color:#6B7280;width:100px;">预约编号</td><td style="padding:8px 0;font-weight:600;">#{{bookingId}}</td></tr>
    <tr><td style="padding:8px 0;color:#6B7280;">预约产线</td><td style="padding:8px 0;">{{lineName}}</td></tr>
    {{adminNote}}
  </table>
</div>` },
      { key: 'sms_template_confirmed', value: '【MeatTech Pro】尊敬的{{contactName}}，您的预约 #{{bookingId}} 已确认。预约产线：{{lineName}}。如有疑问请联系 400-xxx-xxxx' },
      { key: 'sms_template_cancelled', value: '【MeatTech Pro】尊敬的{{contactName}}，抱歉您的预约 #{{bookingId}} 已取消。{{adminNoteText}}如有疑问请联系 400-xxx-xxxx' },
      { key: 'sms_template_in_progress', value: '【MeatTech Pro】尊敬的{{contactName}}，您的预约 #{{bookingId}} 实验已开始执行，我们会及时通知您进度。' },
      { key: 'sms_template_completed', value: '【MeatTech Pro】尊敬的{{contactName}}，您的预约 #{{bookingId}} 实验已完成。{{adminNoteText}}感谢使用！' },
    ];

    for (const template of defaultTemplates) {
      await prisma.setting.upsert({
        where: { key: template.key },
        update: {}, // 如果已存在，不更新（保留用户自定义）
        create: { key: template.key, value: template.value },
      });
    }

    return NextResponse.json({ success: true, message: '通知模板已初始化' });
  } catch (error) {
    return NextResponse.json({ error: '初始化失败', detail: String(error) }, { status: 500 });
  }
}
