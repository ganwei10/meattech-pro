import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    if (!q || q.trim().length < 1) {
      return NextResponse.json({ posts: [], products: [], total: 0, totalPages: 0 });
    }
    const keyword = q.trim();
    const skip = (page - 1) * limit;

    const [posts, products, postsCount, productsCount] = await Promise.all([
      prisma.post.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { excerpt: { contains: keyword, mode: 'insensitive' } },
            { tags: { contains: keyword, mode: 'insensitive' } },
            { content: { contains: keyword, mode: 'insensitive' } },
          ],
        },
        include: { category: true },
        skip,
        take: limit,
        orderBy: { views: 'desc' },
      }),
      prisma.product.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { category: { contains: keyword, mode: 'insensitive' } },
            { difficulty: { contains: keyword, mode: 'insensitive' } },
          ],
        },
        skip,
        take: limit,
      }),
      prisma.post.count({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { excerpt: { contains: keyword, mode: 'insensitive' } },
            { tags: { contains: keyword, mode: 'insensitive' } },
            { content: { contains: keyword, mode: 'insensitive' } },
          ],
        },
      }),
      prisma.product.count({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { category: { contains: keyword, mode: 'insensitive' } },
            { difficulty: { contains: keyword, mode: 'insensitive' } },
          ],
        },
      }),
    ]);
    const total = postsCount + productsCount;
    const totalPages = Math.ceil(total / limit);
    return NextResponse.json({ posts, products, total, totalPages });
  } catch (error) {
    return NextResponse.json({ error: '搜索失败', detail: String(error) }, { status: 500 });
  }
}
