import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { safeFindPilotLine } from '@/lib/safeQuery';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // 检查管理员权限
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = 20;

    // 构建筛选条件
    const where: any = {};
    if (status) where.status = status;
    if (startDate || endDate) {
      where.OR = [
        { preferredDate: { gte: startDate || undefined, lte: endDate || undefined } },
        {
          createdAt: {
            gte: startDate ? new Date(startDate) : undefined,
            lte: endDate ? new Date(endDate + 'T23:59:59') : undefined,
          },
        },
      ];
    }

    const total = await prisma.booking.count({ where });
    let bookings: any[];
    try {
      bookings = await prisma.booking.findMany({
        where,
        include: { line: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
    } catch {
      // Fallback: query without include, fetch lines separately
      bookings = await prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      for (const b of bookings) {
        b.line = await safeFindPilotLine(b.lineId);
      }
    }

    return NextResponse.json({ bookings, total, page, pageSize });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bookings', detail: String(error) },
      { status: 500 }
    );
  }
}
