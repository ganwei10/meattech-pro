import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// 获取客户列表（从预约中派生）
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = 20;

    // 从预约中聚合客户
    const customersRaw = await prisma.$queryRaw<
      {
        contactPhone: string;
        contactName: string;
        contactEmail: string;
        company: string;
        firstBooking: Date;
        lastBooking: Date;
        totalBookings: bigint;
        confirmedBookings: bigint;
      }[]
    >`
      SELECT 
        "contactPhone",
        MAX("contactName") as "contactName",
        MAX("contactEmail") as "contactEmail",
        MAX(company) as company,
        MIN("createdAt") as "firstBooking",
        MAX("createdAt") as "lastBooking",
        COUNT(*) as "totalBookings",
        COUNT(CASE WHEN status IN ('CONFIRMED', 'IN_PROGRESS', 'COMPLETED') THEN 1 END) as "confirmedBookings"
      FROM "Booking"
      GROUP BY "contactPhone"
      ORDER BY "lastBooking" DESC
    `;

    let customers = customersRaw.map((c: any) => ({
      phone: c.contactPhone,
      name: c.contactName,
      email: c.contactEmail,
      company: c.company,
      firstBooking: c.firstBooking,
      lastBooking: c.lastBooking,
      totalBookings: Number(c.totalBookings),
      confirmedBookings: Number(c.confirmedBookings || 0),
    }));

    // 筛选
    if (keyword) {
      const k = keyword.toLowerCase();
      customers = customers.filter(c =>
        c.name?.toLowerCase().includes(k) ||
        c.phone?.includes(k) ||
        c.company?.toLowerCase().includes(k)
      );
    }

    const total = customers.length;
    const paged = customers.slice((page - 1) * pageSize, page * pageSize);

    return NextResponse.json({ customers: paged, total, page, pageSize });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch customers', detail: String(error) },
      { status: 500 }
    );
  }
}
