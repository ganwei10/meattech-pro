import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '预约提交失败', detail: String(error) }, { status: 500 });
  }
}
