import { prisma } from '@/lib/prisma';
import CategoryManager from '@/components/CategoryManager';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>分类管理</h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
