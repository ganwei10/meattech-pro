'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoryManager({ categories }: { categories: { id: number; name: string; slug: string; order: number; _count: { posts: number } }[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', slug: '', order: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', order: 0 });

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', slug: '', order: 0 });
    router.refresh();
  };

  const inputStyle = { padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.88rem', outline: 'none' };

  return (
    <div>
      <form onSubmit={createCategory} style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 600, marginBottom: 4, color: '#6B7280' }}>分类名称</label>
          <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ ...inputStyle, width: 200 }} placeholder="如：中式酱卤" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 600, marginBottom: 4, color: '#6B7280' }}>URL别名（选填）</label>
          <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} style={{ ...inputStyle, width: 160 }} placeholder="自动生成" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 600, marginBottom: 4, color: '#6B7280' }}>排序</label>
          <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} style={{ ...inputStyle, width: 80 }} />
        </div>
        <button type="submit" style={{ background: '#1E3A8A', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 6, fontSize: '.88rem', fontWeight: 600, cursor: 'pointer', height: 36 }}>添加分类</button>
      </form>

      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '.82rem', fontWeight: 600, color: '#6B7280' }}>名称</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '.82rem', fontWeight: 600, color: '#6B7280' }}>别名</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '.82rem', fontWeight: 600, color: '#6B7280' }}>排序</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '.82rem', fontWeight: 600, color: '#6B7280' }}>文章数</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '10px 16px', fontSize: '.88rem', fontWeight: 500 }}>{cat.name}</td>
                <td style={{ padding: '10px 16px', fontSize: '.82rem', color: '#6B7280' }}>{cat.slug}</td>
                <td style={{ padding: '10px 16px', fontSize: '.82rem' }}>{cat.order}</td>
                <td style={{ padding: '10px 16px', fontSize: '.82rem' }}>{cat._count.posts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
