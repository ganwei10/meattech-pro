import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST: Create a community Q&A post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, tags, author, contactPhone, contactEmail } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: '请输入问题标题' }, { status: 400 });
    }
    if (!content || !content.trim()) {
      return NextResponse.json({ error: '请输入问题描述' }, { status: 400 });
    }

    // Get the community-qa category
    let category = await prisma.category.findUnique({ where: { slug: 'community-qa' } });
    if (!category) {
      // Auto-create if missing
      category = await prisma.category.create({
        data: { name: '工艺问答', slug: 'community-qa', icon: '💬', order: 7 },
      });
    }

    // Try to get current user (optional — guests can also ask)
    const user = await getCurrentUser();
    const authorName = author?.trim() || user?.name || '匿名工程师';
    const slug = `qa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const excerpt = content.slice(0, 200);

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        slug,
        content: content.trim(),
        excerpt,
        tags: tags || '',
        author: authorName,
        status: 'PUBLISHED',
        categoryId: category.id,
        featured: false,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error('Community ask error:', error);
    return NextResponse.json({ error: '发布失败', detail: String(error) }, { status: 500 });
  }
}

// GET: List community Q&A posts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const tag = searchParams.get('tag') || '';

    const category = await prisma.category.findUnique({ where: { slug: 'community-qa' } });
    if (!category) {
      return NextResponse.json({ posts: [] });
    }

    const where: any = { status: 'PUBLISHED', categoryId: category.id };
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { content: { contains: q } },
      ];
    }
    if (tag) {
      where.tags = { contains: tag };
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: '获取列表失败', detail: String(error) }, { status: 500 });
  }
}
