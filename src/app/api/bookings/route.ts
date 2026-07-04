import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { notifyNewBooking } from '@/lib/notify';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: { line: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: '获取预约列表失败', detail: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lineId = parseInt(body.lineId, 10);
    if (!lineId) {
      return NextResponse.json({ error: '请选择中试产线' }, { status: 400 });
    }
    const booking = await prisma.booking.create({
      data: {
        lineId,
        contactName: body.contactName || '',
        contactPhone: body.contactPhone || '',
        contactEmail: body.contactEmail || '',
        company: body.company || '',
        experimentType: body.experimentType || '',
        requirement: body.requirement || '',
        preferredDate: body.preferredDate || '',
      },
      include: { line: true },
    });
    // 异步发送通知（不阻塞预约创建响应）
    notifyNewBooking({
      id: booking.id,
      contactName: booking.contactName,
      company: booking.company,
      line: booking.line,
      requirement: booking.requirement,
    }).catch(err => console.error('通知发送失败:', err));

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '预约提交失败', detail: String(error) }, { status: 500 });
  }
}
