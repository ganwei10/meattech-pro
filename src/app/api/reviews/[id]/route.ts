import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const reviewId = parseInt(params.id, 10);
    const existing = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!existing) {
      return NextResponse.json({ error: '评价不存在' }, { status: 404 });
    }

    const body = await request.json();

    // Admin can reply to any review
    if (user.role === 'ADMIN') {
      if (body.reply !== undefined) {
        const updated = await prisma.review.update({
          where: { id: reviewId },
          data: {
            reply: body.reply || null,
            replyAt: body.reply ? new Date() : null,
          },
          include: {
            user: { select: { id: true, name: true, email: true } },
            booking: { select: { id: true, lineId: true, company: true, contactName: true } },
          },
        });
        return NextResponse.json(updated);
      }
      return NextResponse.json({ error: '管理员操作缺少 reply 字段' }, { status: 400 });
    }

    // Regular user can only modify their own review
    if (existing.userId !== user.userId) {
      return NextResponse.json({ error: '无权修改他人评价' }, { status: 403 });
    }

    const rating = body.rating ? parseInt(body.rating, 10) : undefined;
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: '评分需在1-5之间' }, { status: 400 });
    }

    const data: any = {};
    if (rating) data.rating = rating;
    if (body.content?.trim()) data.content = body.content.trim();

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: '没有需要更新的内容' }, { status: 400 });
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data,
      include: {
        user: { select: { id: true, name: true, email: true } },
        booking: { select: { id: true, lineId: true, company: true, contactName: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: '更新评价失败', detail: String(error) }, { status: 500 });
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

    const reviewId = parseInt(params.id, 10);
    const existing = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!existing) {
      return NextResponse.json({ error: '评价不存在' }, { status: 404 });
    }

    // Only admin or the review owner can delete
    if (user.role !== 'ADMIN' && existing.userId !== user.userId) {
      return NextResponse.json({ error: '无权删除此评价' }, { status: 403 });
    }

    await prisma.review.delete({ where: { id: reviewId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: '删除评价失败', detail: String(error) }, { status: 500 });
  }
}
