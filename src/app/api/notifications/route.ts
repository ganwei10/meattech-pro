import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { safeFindNotifications } from '@/lib/safeQuery';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unread = searchParams.get('unread') === 'true';

    const notifications = await safeFindNotifications(user.userId, unread);
    return NextResponse.json({
      notifications: notifications.map((n: any) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        content: n.content,
        isRead: n.isRead,
        link: n.link,
        createdAt: n.createdAt,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: '获取通知列表失败', detail: String(error) }, { status: 500 });
  }
}
