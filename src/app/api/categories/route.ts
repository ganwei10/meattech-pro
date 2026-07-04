import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: '获取分类失败', detail: String(error) }, { status: 500 });
  }
}
