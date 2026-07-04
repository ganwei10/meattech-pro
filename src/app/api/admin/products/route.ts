import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// 获取产品列表
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    const where: any = {};
    if (keyword) {
      where.OR = [
        { title: { contains: keyword } },
        { description: { contains: keyword } },
        { tags: { contains: keyword } },
      ];
    }
    if (category) where.category = category;
    if (status) where.status = status;

    const products = await prisma.product.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products', detail: String(error) }, { status: 500 });
  }
}

// 创建产品
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, category, difficulty, reportUrl, cover, status, description, content, tags, featured, sortOrder } = body;

    if (!title || !category) {
      return NextResponse.json({ error: '标题和分类不能为空' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        title,
        category,
        difficulty: difficulty || '',
        reportUrl: reportUrl || null,
        cover: cover || null,
        status: status || 'PUBLISHED',
        description: description || '',
        content: content || '',
        tags: tags || '',
        featured: featured || false,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product', detail: String(error) }, { status: 500 });
  }
}
