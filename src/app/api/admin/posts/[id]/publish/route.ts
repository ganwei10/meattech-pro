import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/admin/posts/[id]/publish - 发布草稿文章
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const post = await prisma.post.update({
      where: { id: parseInt(params.id) },
      data: { status: 'PUBLISHED' },
    });
    return NextResponse.json({ success: true, post });
  } catch (error) {
    return NextResponse.json({ error: '发布失败' }, { status: 500 });
  }
}
