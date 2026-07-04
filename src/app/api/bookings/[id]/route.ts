import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { safeFindBookingWithLine, safeFindPilotLine } from '@/lib/safeQuery';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, adminNote } = body;
    const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: '无效状态' }, { status: 400 });
    }
    const booking = await prisma.booking.update({
      where: { id: parseInt(params.id) },
      data: {
        status,
        ...(adminNote !== undefined ? { adminNote } : {}),
      },
    });
    booking.line = await safeFindPilotLine(booking.lineId);
    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: '更新预约状态失败', detail: String(error) }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await safeFindBookingWithLine(parseInt(params.id));
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: '获取预约失败', detail: String(error) }, { status: 500 });
  }
}
