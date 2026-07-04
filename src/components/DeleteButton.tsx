'use client';

import { useRouter } from 'next/navigation';

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const handleDelete = async () => {
    if (!confirm('确定删除这篇文章吗？')) return;
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    router.refresh();
  };
  return (
    <button onClick={handleDelete} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '.85rem' }}>删除</button>
  );
}
