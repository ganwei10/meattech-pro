import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmailNotification, sendSMSNotification } from '@/lib/notify';

export const dynamic = 'force-dynamic';

// 更新预约状态
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 检查管理员权限
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { status, adminNote } = body;
    const bookingId = parseInt(params.id);

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // 获取预约详情（用于发送通知）
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { line: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // 更新预约
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        adminNote: adminNote || undefined,
      },
      include: { line: true },
    });

    // 发送通知给预约人
    const statusMessages: Record<string, string> = {
      CONFIRMED: '已确认',
      CANCELLED: '已拒绝',
      IN_PROGRESS: '执行中',
      COMPLETED: '已完成',
    };

    if (statusMessages[status]) {
      // 发送邮件通知
      const subject = `【MeatTech Pro】预约 #${bookingId} ${statusMessages[status]}`;
      const html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="color:${status === 'CONFIRMED' ? '#059669' : status === 'CANCELLED' ? '#DC2626' : '#1E3A8A'};margin:0 0 16px;">
            📅 预约状态更新
          </h2>
          <p style="font-size:1.1rem;margin-bottom:16px;">尊敬的 ${booking.contactName}，您的预约已<strong>${statusMessages[status]}</strong></p>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#6B7280;width:100px;">预约编号</td><td style="padding:8px 0;font-weight:600;">#${bookingId}</td></tr>
            <tr><td style="padding:8px 0;color:#6B7280;">预约产线</td><td style="padding:8px 0;">${booking.line.name}</td></tr>
            <tr><td style="padding:8px 0;color:#6B7280;">实验需求</td><td style="padding:8px 0;">${booking.requirement}</td></tr>
            ${adminNote ? `<tr><td style="padding:8px 0;color:#6B7280;">管理员备注</td><td style="padding:8px 0;">${adminNote}</td></tr>` : ''}
          </table>
          <div style="margin-top:20px;padding:16px;background:#F9FAFB;border-radius:8px;">
            <div style="font-size:.85rem;color:#6B7280;margin-bottom:8px;">如有疑问，请联系：</div>
            <div style="font-size:.9rem;">📞 电话：400-xxx-xxxx</div>
            <div style="font-size:.9rem;">📧 邮箱：admin@meattech.pro</div>
          </div>
        </div>
      `;

      // 发送给预约人（如果有邮箱）
      if (booking.contactEmail) {
        await sendEmailNotification(subject, html);
      }

      // 发送给通知邮箱（管理员）
      await sendEmailNotification(subject, html);

      // 发送短信通知
      const smsMessage = `【MeatTech Pro】您的预约 #${bookingId} 已${statusMessages[status]}。${adminNote ? `备注：${adminNote}` : ''}如有疑问请联系 400-xxx-xxxx`;
      await sendSMSNotification(smsMessage);
    }

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update booking', detail: String(error) },
      { status: 500 }
    );
  }
}
