import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PostEditor from '@/components/PostEditor';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const [post, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id: parseInt(params.id) } }),
    prisma.category.findMany({ orderBy: { order: 'asc' } }),
  ]);

  if (!post) notFound();

  return <PostEditor categories={categories} post={post} />;
}
