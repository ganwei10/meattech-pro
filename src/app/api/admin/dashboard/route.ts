import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // 检查管理员权限
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [postCount, productCount, lineCount, bookingCount, pendingBookings, recentPosts] = await Promise.all([
      prisma.post.count(),
      prisma.product.count(),
      prisma.pilotLine.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.post.findMany({ 
        take: 5, 
        orderBy: { createdAt: 'desc' }, 
        include: { category: true },
        where: { status: 'PUBLISHED' }
      }),
    ]);

    return NextResponse.json({
      stats: {
        postCount,
        productCount,
        lineCount,
        bookingCount,
        pendingBookings,
      },
      recentPosts,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data', detail: String(error) },
      { status: 500 }
    );
  }
}
