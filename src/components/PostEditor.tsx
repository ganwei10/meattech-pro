'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PostEditor({ categories }: { categories: { id: number; name: string }[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', author: 'MeatTech Pro 编辑部',
    tags: '', categoryId: categories[0]?.id || 1, featured: false, status: 'PUBLISHED',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '');
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, slug }),
    });
    router.push('/admin/posts');
    router.refresh();
  };

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none' };

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>发布新文章</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
        <div>
          <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>标题 *</label>
          <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} placeholder="请输入文章标题" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>URL别名（留空自动生成）</label>
          <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} style={inputStyle} placeholder="如: clean-label-sausage" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>摘要 *</label>
          <textarea required value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="文章摘要，将显示在列表页" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>正文（支持HTML） *</label>
          <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={12} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }} placeholder="<h2>标题</h2><p>正文内容...</p>" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>分类 *</label>
            <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: parseInt(e.target.value) })} style={inputStyle}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>标签（逗号分隔）</label>
            <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} style={inputStyle} placeholder="清洁标签,保水性,烤肠" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>作者</label>
            <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>状态</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
              <option value="PUBLISHED">已发布</option>
              <option value="DRAFT">草稿</option>
            </select>
          </div>
        </div>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.85rem', fontWeight: 600, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /> 首页推荐（显示在首屏和技术文章区）
          </label>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" disabled={saving} style={{ background: '#1E3A8A', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 8, fontSize: '.95rem', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>{saving ? '保存中...' : '发布文章'}</button>
          <button type="button" onClick={() => router.back()} style={{ background: '#F3F4F6', color: '#6B7280', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: '.95rem', cursor: 'pointer' }}>取消</button>
        </div>
      </form>
    </div>
  );
}
