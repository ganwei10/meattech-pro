import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const notificationId = parseInt(params.id, 10);
    if (!notificationId) {
      return NextResponse.json({ error: '无效的通知ID' }, { status: 400 });
    }

    // 只能操作自己的通知
    try {
      const updated = await prisma.notification.update({
        where: { id: notificationId, userId: user.userId },
        data: { isRead: true },
      });
      return NextResponse.json(updated);
    } catch {
      // Fallback: raw SQL
      const result = await prisma.$executeRawUnsafe(
        `UPDATE "Notification" SET "isRead" = true WHERE id = $1 AND "userId" = $2`,
        notificationId, user.userId
      );
      if (result === 0) {
        return NextResponse.json({ error: '通知不存在或无权操作' }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    return NextResponse.json({ error: '操作失败', detail: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const notificationId = parseInt(params.id, 10);
    if (!notificationId) {
      return NextResponse.json({ error: '无效的通知ID' }, { status: 400 });
    }

    // 只能删除自己的通知
    try {
      await prisma.notification.delete({
        where: { id: notificationId, userId: user.userId },
      });
    } catch {
      const result = await prisma.$executeRawUnsafe(
        `DELETE FROM "Notification" WHERE id = $1 AND "userId" = $2`,
        notificationId, user.userId
      );
      if (result === 0) {
        return NextResponse.json({ error: '通知不存在或无权操作' }, { status: 404 });
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: '删除失败', detail: String(error) }, { status: 500 });
  }
}
