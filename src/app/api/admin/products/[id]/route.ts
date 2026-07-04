import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// 获取单个产品
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const product = await prisma.product.findUnique({ where: { id: parseInt(params.id) } });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product', detail: String(error) }, { status: 500 });
  }
}

// 更新产品
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, category, difficulty, reportUrl, cover, status, description, content, tags, featured, sortOrder } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (reportUrl !== undefined) updateData.reportUrl = reportUrl || null;
    if (cover !== undefined) updateData.cover = cover || null;
    if (status !== undefined) updateData.status = status;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (tags !== undefined) updateData.tags = tags;
    if (featured !== undefined) updateData.featured = featured;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    const product = await prisma.product.update({
      where: { id: parseInt(params.id) },
      data: updateData,
    });

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product', detail: String(error) }, { status: 500 });
  }
}

// 删除产品
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.product.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product', detail: String(error) }, { status: 500 });
  }
}
