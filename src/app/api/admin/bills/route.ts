import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { safeFindPilotLine } from '@/lib/safeQuery';

export const dynamic = 'force-dynamic';

// 获取所有账单（管理员）
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const keyword = searchParams.get('keyword');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {};
    if (status) where.status = status;
    if (keyword) {
      where.OR = [
        { customerName: { contains: keyword } },
        { company: { contains: keyword } },
        { id: isNaN(parseInt(keyword)) ? undefined : parseInt(keyword) },
      ].filter(Boolean);
    }
    if (startDate) {
      where.createdAt = { gte: new Date(startDate) };
    }
    if (endDate) {
      where.createdAt = { ...where.createdAt, lte: new Date(endDate + 'T23:59:59') };
    }

    let bills: any[];
    try {
      bills = await prisma.bill.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { line: true, booking: true },
      });
    } catch {
      // Fallback: query without include, fetch lines separately
      bills = await prisma.bill.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
      for (const b of bills) {
        b.line = await safeFindPilotLine(b.lineId);
      }
    }

    return NextResponse.json({ success: true, bills });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bills', detail: String(error) },
      { status: 500 }
    );
  }
}

// 创建账单（管理员，或预约确认时自动创建）
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      bookingId,
      lineId,
      customerName,
      customerPhone,
      customerEmail,
      company,
      amount,
      serviceFeePercent,
    } = body;

    if (!bookingId || !lineId) {
      return NextResponse.json({ error: 'bookingId and lineId are required' }, { status: 400 });
    }

    // 检查是否已有账单
    const existing = await prisma.bill.findUnique({ where: { bookingId } });
    if (existing) {
      return NextResponse.json({ error: 'Bill already exists for this booking' }, { status: 400 });
    }

    // 获取产线信息（用于计算服务费）- safe query
    const line = await safeFindPilotLine(lineId);
    if (!line) {
      return NextResponse.json({ error: 'Pilot line not found' }, { status: 404 });
    }

    const finalAmount = amount ? parseFloat(amount) : (line.pricePerDay || 0);
    const finalServiceFeePercent = serviceFeePercent ? parseFloat(serviceFeePercent) : (line.serviceFeePercent || 5);
    const serviceFee = finalAmount * (finalServiceFeePercent / 100);
    const totalAmount = finalAmount + serviceFee;

    const bill = await prisma.bill.create({
      data: {
        bookingId,
        lineId,
        customerName: customerName || '',
        customerPhone: customerPhone || '',
        customerEmail: customerEmail || '',
        company: company || '',
        amount: finalAmount,
        serviceFee,
        totalAmount,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, bill });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create bill', detail: String(error) },
      { status: 500 }
    );
  }
}
