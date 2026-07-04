import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { order: 'asc' }, include: { _count: { select: { posts: true } } } });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: '获取分类失败', detail: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = body.slug || body.name.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '');
    const category = await prisma.category.create({
      data: { name: body.name, slug, icon: body.icon || 'folder', order: body.order || 0 },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '创建分类失败', detail: String(error) }, { status: 500 });
  }
}
