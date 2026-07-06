import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { safeFindReviews } from '@/lib/safeQuery';
import { getCurrentUser } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId') ? parseInt(searchParams.get('bookingId')!, 10) : undefined;

    const reviews = await safeFindReviews(bookingId);
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: '获取评价列表失败', detail: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { success, remaining } = rateLimit(`reviews:${ip}`, 10, 60 * 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: '操作过于频繁，请稍后再试' }, { status: 429 });
    }

    const body = await request.json();
    const bookingId = parseInt(body.bookingId, 10);
    const rating = parseInt(body.rating, 10);

    if (!bookingId) {
      return NextResponse.json({ error: '请指定预约ID' }, { status: 400 });
    }
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: '评分需在1-5之间' }, { status: 400 });
    }
    if (!body.content || !body.content.trim()) {
      return NextResponse.json({ error: '请输入评价内容' }, { status: 400 });
    }

    // Check if booking exists
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      return NextResponse.json({ error: '预约不存在' }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: {
        bookingId,
        userId: user.userId,
        rating,
        content: body.content.trim(),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        booking: { select: { id: true, lineId: true, company: true, contactName: true } },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '提交评价失败', detail: String(error) }, { status: 500 });
  }
}
