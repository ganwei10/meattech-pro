'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MediaPicker from '@/components/MediaPicker';

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string;
  status: string;
  categoryId: number;
  featured: boolean;
  cover?: string;
};

export default function PostEditor({ categories, post }: {
  categories: { id: number; name: string }[];
  post?: Post;
}) {
  const router = useRouter();
  const isEdit = !!post;
  const [form, setForm] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    author: post?.author || 'MeatTech Pro 编辑部',
    tags: post?.tags || '',
    categoryId: post?.categoryId || categories[0]?.id || 1,
    featured: post?.featured || false,
    status: post?.status || 'PUBLISHED',
    cover: post?.cover || '',
  });
  const [saving, setSaving] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showContentMediaPicker, setShowContentMediaPicker] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '');
    const url = isEdit ? `/api/posts/${post!.id}` : '/api/posts';
    const method = isEdit ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, slug }),
    });
    router.push('/admin/posts');
    router.refresh();
  };

  const insertImageToContent = (url: string) => {
    setForm({ ...form, content: form.content + `\n<img src="${url}" alt="图片" style="max-width:100%;height:auto;" />` });
    setShowContentMediaPicker(false);
  };

  const insertVideoToContent = () => {
    const url = prompt('请输入视频 URL（支持 MP4 直链或 YouTube 嵌入链接）：');
    if (!url) return;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // YouTube 嵌入
      const videoId = url.includes('v=') ? new URLSearchParams(url.split('?')[1]).get('v') : url.split('/').pop();
      setForm({ ...form, content: form.content + `\n<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="max-width:100%;"></iframe>` });
    } else {
      setForm({ ...form, content: form.content + `\n<video controls style="max-width:100%;"><source src="${url}" type="video/mp4">您的浏览器不支持视频播放</video>` });
    }
  };

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none' };

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>{isEdit ? '编辑文章' : '发布新文章'}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>
        <div>
          <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>标题 *</label>
          <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} placeholder="请输入文章标题" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>URL 别名（留空自动生成）</label>
          <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} style={inputStyle} placeholder="如: clean-label-sausage" />
        </div>

        {/* 封面图 */}
        <div>
          <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>封面图</label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            {form.cover && (
              <img src={form.cover} alt="封面" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            )}
            <div style={{ flex: 1 }}>
              <input value={form.cover} onChange={e => setForm({ ...form, cover: e.target.value })} style={{ ...inputStyle, marginBottom: 8 }} placeholder="图片 URL（可选）" />
              <button type="button" onClick={() => setShowMediaPicker(true)} style={{ padding: '6px 12px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 6, fontSize: '.82rem', cursor: 'pointer' }}>
                从媒体库选择
              </button>
            </div>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>摘要 *</label>
          <textarea required value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="文章摘要，将显示在列表页" />
        </div>

        {/* 正文编辑区域 */}
        <div>
          <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>正文（支持 HTML） *</label>
          <div style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => setShowContentMediaPicker(true)} style={{ padding: '6px 12px', background: '#059669', color: '#fff', border: 'none', borderRadius: 6, fontSize: '.82rem', cursor: 'pointer' }}>
              📷 插入图片
            </button>
            <button type="button" onClick={insertVideoToContent} style={{ padding: '6px 12px', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 6, fontSize: '.82rem', cursor: 'pointer' }}>
              🎬 插入视频
            </button>
          </div>
          <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={14} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '.85rem' }} placeholder="<h2>标题</h2><p>正文内容...</p>" />
          <div style={{ marginTop: 8, fontSize: '.78rem', color: '#9CA3AF' }}>
            提示：点击"插入图片"从媒体库选择，或点击"插入视频"添加视频链接
          </div>
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
              <option value="ARCHIVED">已归档</option>
            </select>
          </div>
        </div>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.85rem', fontWeight: 600, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /> 首页推荐（显示在首屏和技术文章区）
          </label>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" disabled={saving} style={{ background: '#1E3A8A', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 8, fontSize: '.95rem', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>{saving ? '保存中...' : (isEdit ? '保存修改' : '发布文章')}</button>
          <button type="button" onClick={() => router.back()} style={{ background: '#F3F4F6', color: '#6B7280', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: '.95rem', cursor: 'pointer' }}>取消</button>
        </div>
      </form>

      {/* 封面图选择器 */}
      {showMediaPicker && (
        <MediaPicker
          onSelect={(url) => { setForm({ ...form, cover: url }); setShowMediaPicker(false); }}
          onClose={() => setShowMediaPicker(false)}
        />
      )}

      {/* 正文图片选择器 */}
      {showContentMediaPicker && (
        <MediaPicker
          onSelect={insertImageToContent}
          onClose={() => setShowContentMediaPicker(false)}
        />
      )}
    </div>
  );
}
