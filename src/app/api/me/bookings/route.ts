import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { safeFindPilotLine } from '@/lib/safeQuery';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// 获取当前用户的预约列表
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  try {
    let bookings: any[];
    try {
      bookings = await prisma.booking.findMany({
        where: {
          OR: [
            { contactEmail: user.email },
            ...(user.phone ? [{ contactPhone: user.phone }] : []),
          ],
        },
        include: { line: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      // Fallback: query without include, fetch lines separately
      bookings = await prisma.booking.findMany({
        where: {
          OR: [
            { contactEmail: user.email },
            ...(user.phone ? [{ contactPhone: user.phone }] : []),
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
      for (const b of bookings) {
        b.line = await safeFindPilotLine(b.lineId);
      }
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('获取我的预约失败:', error);
    return NextResponse.json({ error: '获取预约失败', detail: String(error) }, { status: 500 });
  }
}
