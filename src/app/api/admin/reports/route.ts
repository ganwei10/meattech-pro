import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    // 1. 预约统计
    const totalBookings = await prisma.booking.count();
    const bookingsByStatus = await prisma.$queryRaw<
      { status: string; count: bigint }[]
    >`
      SELECT status, COUNT(*) as count
      FROM "Booking"
      GROUP BY status
    `;

    // 2. 月度预约统计
    const bookingsByMonth = await prisma.$queryRaw<
      { month: number; count: bigint; confirmed: bigint }[]
    >`
      SELECT 
        EXTRACT(MONTH FROM "createdAt") as month,
        COUNT(*) as count,
        COUNT(CASE WHEN status = 'CONFIRMED' OR status = 'IN_PROGRESS' OR status = 'COMPLETED' THEN 1 END) as confirmed
      FROM "Booking"
      WHERE EXTRACT(YEAR FROM "createdAt") = ${year}
      GROUP BY EXTRACT(MONTH FROM "createdAt")
      ORDER BY month
    `;

    // 3. 营收统计
    const totalRevenue = await prisma.bill.aggregate({
      where: { status: 'PAID' },
      _sum: { totalAmount: true },
    });
    const totalPending = await prisma.bill.aggregate({
      where: { status: 'PENDING' },
      _sum: { totalAmount: true },
    });

    // 4. 月度营收
    const revenueByMonth = await prisma.$queryRaw<
      { month: number; revenue: number; count: bigint }[]
    >`
      SELECT 
        EXTRACT(MONTH FROM "createdAt") as month,
        SUM("totalAmount") as revenue,
        COUNT(*) as count
      FROM "Bill"
      WHERE status = 'PAID' AND EXTRACT(YEAR FROM "createdAt") = ${year}
      GROUP BY EXTRACT(MONTH FROM "createdAt")
      ORDER BY month
    `;

    // 5. 产线利用率（预约次数）
    const lineUsage = await prisma.$queryRaw<
      { lineId: number; lineName: string; bookingCount: bigint; revenue: number }[]
    >`
      SELECT 
        bl.id as "lineId",
        bl.name as "lineName",
        COUNT(b.id) as "bookingCount",
        COALESCE(SUM(bi."totalAmount"), 0) as revenue
      FROM "PilotLine" bl
      LEFT JOIN "Booking" b ON b."lineId" = bl.id
      LEFT JOIN "Bill" bi ON bi."bookingId" = b.id AND bi.status = 'PAID'
      GROUP BY bl.id, bl.name
      ORDER BY "bookingCount" DESC
    `;

    // 6. 客户统计
    const totalCustomers = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(DISTINCT "contactPhone") as count
      FROM "Booking"
    `;

    return NextResponse.json({
      year,
      bookings: {
        total: totalBookings,
        byStatus: bookingsByStatus.map((s: any) => ({
          status: s.status,
          count: Number(s.count),
        })),
        byMonth: bookingsByMonth.map((m: any) => ({
          month: Number(m.month),
          count: Number(m.count),
          confirmed: Number(m.confirmed || 0),
        })),
      },
      revenue: {
        total: totalRevenue._sum.totalAmount || 0,
        pending: totalPending._sum.totalAmount || 0,
        byMonth: revenueByMonth.map((m: any) => ({
          month: Number(m.month),
          revenue: Number(m.revenue || 0),
          count: Number(m.count),
        })),
      },
      lines: lineUsage.map((l: any) => ({
        id: l.lineId,
        name: l.lineName,
        bookings: Number(l.bookingCount),
        revenue: Number(l.revenue || 0),
      })),
      customers: {
        total: Number(totalCustomers[0]?.count || 0),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reports', detail: String(error) },
      { status: 500 }
    );
  }
}
