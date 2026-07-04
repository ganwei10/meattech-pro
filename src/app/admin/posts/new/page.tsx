import { prisma } from '@/lib/prisma';
import PostEditor from '@/components/PostEditor';

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } });
  return <PostEditor categories={categories.map(c => ({ id: c.id, name: c.name }))} />;
}
