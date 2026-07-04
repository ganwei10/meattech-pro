import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(params.id) },
      include: { category: true },
    });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: '获取文章失败', detail: String(error) }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const post = await prisma.post.update({
      where: { id: parseInt(params.id) },
      data: {
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        cover: body.cover,
        tags: body.tags,
        status: body.status,
        categoryId: parseInt(body.categoryId, 10) || 1,
        featured: body.featured,
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: '更新文章失败', detail: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.post.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: '删除文章失败', detail: String(error) }, { status: 500 });
  }
}
