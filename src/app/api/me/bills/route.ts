import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { safeFindPilotLine } from '@/lib/safeQuery';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// 获取当前用户的账单列表
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  try {
    let bills: any[];
    try {
      bills = await prisma.bill.findMany({
        where: {
          OR: [
            { customerEmail: user.email },
            ...(user.phone ? [{ customerPhone: user.phone }] : []),
          ],
        },
        include: {
          line: true,
          booking: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      // Fallback: query without include, fetch lines separately
      bills = await prisma.bill.findMany({
        where: {
          OR: [
            { customerEmail: user.email },
            ...(user.phone ? [{ customerPhone: user.phone }] : []),
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
      for (const b of bills) {
        b.line = await safeFindPilotLine(b.lineId);
      }
    }

    return NextResponse.json({ bills });
  } catch (error) {
    console.error('获取我的账单失败:', error);
    return NextResponse.json({ error: '获取账单失败', detail: String(error) }, { status: 500 });
  }
}
