import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { phone: string } }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const phone = decodeURIComponent(params.phone);

    // 获取该客户的预约
    const bookings = await prisma.booking.findMany({
      where: { contactPhone: phone },
      include: { line: true },
      orderBy: { createdAt: 'desc' },
    });

    // 获取该客户的账单
    const bills = await prisma.bill.findMany({
      where: { customerPhone: phone },
      include: { line: true, booking: true },
      orderBy: { createdAt: 'desc' },
    });

    // 计算统计
    const totalSpent = bills
      .filter(b => b.status === 'PAID')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    return NextResponse.json({
      phone,
      bookings,
      bills,
      stats: {
        totalBookings: bookings.length,
        confirmedBookings: bookings.filter(b => ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].includes(b.status)).length,
        totalBills: bills.length,
        totalSpent,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch customer detail', detail: String(error) },
      { status: 500 }
    );
  }
}
