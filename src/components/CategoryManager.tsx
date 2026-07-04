'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  order: number;
  _count: { posts: number };
}

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', slug: '', icon: '📂', order: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', slug: '', icon: '📂', order: 0 });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteInfo, setDeleteInfo] = useState<{ name: string; posts: number } | null>(null);

  const iconOptions = ['📂', '🍖', '🥓', '🥟', '🧀', '🔧', '🍳', '🌶️', '🥩', '🍗', '🍖', '📦'];

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name: '', slug: '', icon: '📂', order: 0 });
      router.refresh();
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, slug: cat.slug, icon: cat.icon, order: cat.order });
  };

  const saveEdit = async (id: number) => {
    await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    router.refresh();
  };

  const checkDelete = async (cat: Category) => {
    setDeleteId(cat.id);
    setDeleteInfo({ name: cat.name, posts: cat._count.posts });
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/categories/${deleteId}`, { method: 'DELETE' });
    if (res.ok) {
      setDeleteId(null);
      setDeleteInfo(null);
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || '删除失败');
      setDeleteId(null);
      setDeleteInfo(null);
    }
  };

  const inputStyle = { padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.88rem', outline: 'none' };

  return (
    <div>
      {/* Create form */}
      <form onSubmit={createCategory} style={{ background: '#fff', padding: 20, borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h3 style={{ fontSize: '.95rem', fontWeight: 700, marginBottom: 16, color: '#1E3A8A' }}>➕ 添加新分类</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 600, marginBottom: 4, color: '#6B7280' }}>分类名称</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ ...inputStyle, width: 180 }} placeholder="如：工艺问题" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 600, marginBottom: 4, color: '#6B7280' }}>URL别名（选填）</label>
            <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} style={{ ...inputStyle, width: 160 }} placeholder="自动生成" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 600, marginBottom: 4, color: '#6B7280' }}>图标</label>
            <select value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} style={{ ...inputStyle, width: 70 }}>
              {iconOptions.map(ic => <option key={ic} value={ic}>{ic}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 600, marginBottom: 4, color: '#6B7280' }}>排序</label>
            <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} style={{ ...inputStyle, width: 80 }} />
          </div>
          <button type="submit" style={{ background: '#1E3A8A', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 6, fontSize: '.88rem', fontWeight: 600, cursor: 'pointer', height: 36 }}>添加分类</button>
        </div>
      </form>

      {/* Category table */}
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '.82rem', fontWeight: 600, color: '#6B7280' }}>图标</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '.82rem', fontWeight: 600, color: '#6B7280' }}>名称</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '.82rem', fontWeight: 600, color: '#6B7280' }}>别名</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '.82rem', fontWeight: 600, color: '#6B7280' }}>排序</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '.82rem', fontWeight: 600, color: '#6B7280' }}>文章数</th>
              <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: '.82rem', fontWeight: 600, color: '#6B7280' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                {editingId === cat.id ? (
                  <>
                    <td style={{ padding: '10px 16px' }}>
                      <select value={editForm.icon} onChange={e => setEditForm({ ...editForm, icon: e.target.value })} style={{ ...inputStyle, width: 60 }}>
                        {iconOptions.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={{ ...inputStyle, width: 160 }} />
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <input value={editForm.slug} onChange={e => setEditForm({ ...editForm, slug: e.target.value })} style={{ ...inputStyle, width: 140 }} />
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <input type="number" value={editForm.order} onChange={e => setEditForm({ ...editForm, order: parseInt(e.target.value) || 0 })} style={{ ...inputStyle, width: 60 }} />
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: '.82rem', color: '#9CA3AF' }}>{cat._count.posts}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                      <button onClick={() => saveEdit(cat.id)} style={{ background: '#059669', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: 6, fontSize: '.82rem', cursor: 'pointer', marginRight: 4 }}>保存</button>
                      <button onClick={() => setEditingId(null)} style={{ background: '#E5E7EB', color: '#374151', border: 'none', padding: '5px 12px', borderRadius: 6, fontSize: '.82rem', cursor: 'pointer' }}>取消</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '10px 16px', fontSize: '1.3rem' }}>{cat.icon === 'folder' ? '📂' : cat.icon}</td>
                    <td style={{ padding: '10px 16px', fontSize: '.88rem', fontWeight: 500 }}>{cat.name}</td>
                    <td style={{ padding: '10px 16px', fontSize: '.82rem', color: '#6B7280' }}>{cat.slug}</td>
                    <td style={{ padding: '10px 16px', fontSize: '.82rem' }}>{cat.order}</td>
                    <td style={{ padding: '10px 16px', fontSize: '.82rem' }}>{cat._count.posts}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                      <button onClick={() => startEdit(cat)} style={{ background: '#DBEAFE', color: '#1E3A8A', border: 'none', padding: '5px 12px', borderRadius: 6, fontSize: '.82rem', cursor: 'pointer', marginRight: 4 }}>编辑</button>
                      <button onClick={() => checkDelete(cat)} style={{ background: '#FEE2E2', color: '#991B1B', border: 'none', padding: '5px 12px', borderRadius: 6, fontSize: '.82rem', cursor: 'pointer' }}>删除</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      {deleteId && deleteInfo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setDeleteId(null)}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, maxWidth: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12, color: '#991B1B' }}>⚠️ 确认删除分类</h3>
            <p style={{ fontSize: '.9rem', color: '#374151', marginBottom: 8 }}>分类名称：<strong>{deleteInfo.name}</strong></p>
            {deleteInfo.posts > 0 ? (
              <div style={{ background: '#FEF3C7', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: '.85rem', color: '#92400E' }}>
                ⚠️ 该分类下有 <strong>{deleteInfo.posts}</strong> 篇文章，无法直接删除。请先将文章迁移到其他分类。
              </div>
            ) : (
              <p style={{ fontSize: '.85rem', color: '#6B7280', marginBottom: 16 }}>该分类下无文章，可以安全删除。此操作不可撤销。</p>
            )}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteId(null)} style={{ background: '#E5E7EB', color: '#374151', border: 'none', padding: '8px 18px', borderRadius: 8, fontSize: '.88rem', cursor: 'pointer' }}>取消</button>
              {deleteInfo.posts === 0 && (
                <button onClick={confirmDelete} style={{ background: '#991B1B', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 8, fontSize: '.88rem', cursor: 'pointer' }}>确认删除</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
