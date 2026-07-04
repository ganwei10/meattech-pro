import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendBookingStatusNotification } from '@/lib/notify';

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

    // 发送通知（使用模板）
    await sendBookingStatusNotification(booking, status, adminNote);

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update booking', detail: String(error) },
      { status: 500 }
    );
  }
}
