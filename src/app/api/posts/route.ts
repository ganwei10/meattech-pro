import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const where: any = { status: 'PUBLISHED' };
    if (category) where.category = { slug: category };
    if (featured === 'true') where.featured = true;

    const posts = await prisma.post.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: '获取文章列表失败', detail: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const post = await prisma.post.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
        excerpt: body.excerpt || '',
        content: body.content || '',
        cover: body.cover || null,
        author: body.author || 'MeatTech Pro',
        tags: body.tags || '',
        status: body.status || 'DRAFT',
        categoryId: parseInt(body.categoryId, 10) || 1,
        featured: body.featured || false,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '发布文章失败', detail: String(error) }, { status: 500 });
  }
}
