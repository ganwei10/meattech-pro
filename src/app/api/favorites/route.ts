import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { safeFindFavorites } from '@/lib/safeQuery';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const favorites = await safeFindFavorites(user.userId);
    return NextResponse.json(favorites);
  } catch (error) {
    return NextResponse.json({ error: '获取收藏列表失败', detail: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const body = await request.json();
    const targetType = body.targetType;
    const targetId = parseInt(body.targetId, 10);

    if (!targetType || !['ARTICLE', 'PILOT_LINE'].includes(targetType)) {
      return NextResponse.json({ error: '无效的 targetType，需为 ARTICLE 或 PILOT_LINE' }, { status: 400 });
    }
    if (!targetId) {
      return NextResponse.json({ error: '请指定 targetId' }, { status: 400 });
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_targetType_targetId: {
          userId: user.userId,
          targetType,
          targetId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: user.userId,
        targetType,
        targetId,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '收藏失败', detail: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const body = await request.json();
    const targetType = body.targetType;
    const targetId = parseInt(body.targetId, 10);

    if (!targetType || !['ARTICLE', 'PILOT_LINE'].includes(targetType)) {
      return NextResponse.json({ error: '无效的 targetType，需为 ARTICLE 或 PILOT_LINE' }, { status: 400 });
    }
    if (!targetId) {
      return NextResponse.json({ error: '请指定 targetId' }, { status: 400 });
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_targetType_targetId: {
          userId: user.userId,
          targetType,
          targetId,
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: '未找到该收藏' }, { status: 404 });
    }

    await prisma.favorite.delete({
      where: {
        userId_targetType_targetId: {
          userId: user.userId,
          targetType,
          targetId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: '取消收藏失败', detail: String(error) }, { status: 500 });
  }
}
