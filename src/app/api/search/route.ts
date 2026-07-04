import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    if (!q || q.trim().length < 1) {
      return NextResponse.json({ posts: [], products: [], total: 0 });
    }
    const keyword = q.trim();
    const [posts, products] = await Promise.all([
      prisma.post.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: keyword } },
            { excerpt: { contains: keyword } },
            { tags: { contains: keyword } },
            { content: { contains: keyword } },
          ],
        },
        include: { category: true },
        take: 10,
        orderBy: { views: 'desc' },
      }),
      prisma.product.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: keyword } },
            { category: { contains: keyword } },
            { difficulty: { contains: keyword } },
          ],
        },
        take: 5,
      }),
    ]);
    return NextResponse.json({ posts, products, total: posts.length + products.length });
  } catch (error) {
    return NextResponse.json({ error: '搜索失败', detail: String(error) }, { status: 500 });
  }
}
