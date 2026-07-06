import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { safeFindBookingsWithLine, safeFindPilotLine } from '@/lib/safeQuery';
import { notifyNewBooking } from '@/lib/notify';
import { rateLimit } from '@/lib/rateLimit';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const bookings = await safeFindBookingsWithLine();
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: '获取预约列表失败', detail: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { success, remaining } = rateLimit(`bookings:${ip}`, 5, 60 * 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: '操作过于频繁，请稍后再试' }, { status: 429 });
    }

    const body = await request.json();
    const lineId = parseInt(body.lineId, 10);
    if (!lineId) {
      return NextResponse.json({ error: '请选择中试产线' }, { status: 400 });
    }
    const booking = await prisma.booking.create({
      data: {
        lineId,
        contactName: body.contactName || '',
        contactPhone: body.contactPhone || '',
        contactEmail: body.contactEmail || '',
        company: body.company || '',
        experimentType: body.experimentType || '',
        requirement: body.requirement || '',
        preferredDate: body.preferredDate || '',
      },
    });
    // Safely fetch the line for notification
    const line = await safeFindPilotLine(lineId);
    // 异步发送通知（不阻塞预约创建响应）
    notifyNewBooking({
      id: booking.id,
      contactName: booking.contactName,
      company: booking.company,
      line: line,
      requirement: booking.requirement,
    }).catch(err => console.error('通知发送失败:', err));

    // 创建站内通知
    const pilotLineName = line?.name || '中试产线';
    const currentUser = await getCurrentUser();
    const userName = currentUser?.name || booking.contactName || '匿名用户';
    try {
      // 给用户创建通知（如果已登录）
      if (currentUser) {
        await prisma.notification.create({
          data: {
            userId: currentUser.userId,
            type: 'BOOKING_CONFIRMED',
            title: '预约已提交',
            content: `您预约的${pilotLineName}已提交，等待确认`,
          },
        });
      }
      // 给管理员(userId=1)创建通知
      await prisma.notification.create({
        data: {
          userId: 1,
          type: 'BOOKING_CONFIRMED',
          title: '新预约',
          content: `用户${userName}预约了${pilotLineName}`,
        },
      });
    } catch {
      // Fallback: raw SQL
      try {
        if (currentUser) {
          await prisma.$executeRawUnsafe(
            `INSERT INTO "Notification" ("userId", type, title, content) VALUES ($1, $2, $3, $4)`,
            currentUser.userId, 'BOOKING_CONFIRMED', '预约已提交', `您预约的${pilotLineName}已提交，等待确认`
          );
        }
        await prisma.$executeRawUnsafe(
          `INSERT INTO "Notification" ("userId", type, title, content) VALUES ($1, $2, $3, $4)`,
          1, 'BOOKING_CONFIRMED', '新预约', `用户${userName}预约了${pilotLineName}`
        );
      } catch (e) {
        console.error('站内通知创建失败:', e);
      }
    }

    return NextResponse.json({ ...booking, line }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '预约提交失败', detail: String(error) }, { status: 500 });
  }
}
