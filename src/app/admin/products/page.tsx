'use client';

import { useState, useEffect } from 'react';
import MediaPicker from '@/components/MediaPicker';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'cover' | null>(null);

  const [form, setForm] = useState({
    title: '', category: '气调预制菜', difficulty: '', reportUrl: '', cover: '',
    status: 'PUBLISHED', description: '', content: '', tags: '', featured: false, sortOrder: 0,
  });

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.set('keyword', keyword);
      if (categoryFilter) params.set('category', categoryFilter);
      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); loadProducts(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage(`✅ 产品已${editingProduct ? '更新' : '创建'}`);
        setShowModal(false); resetForm(); loadProducts();
      } else {
        const d = await res.json();
        setMessage(`❌ ${d.error || '操作失败'}`);
      }
    } catch { setMessage('❌ 操作失败'); }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`确定要删除产品「${title}」吗？`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) { setMessage('✅ 产品已删除'); loadProducts(); }
    } catch { setMessage('❌ 删除失败'); }
  };

  const openEdit = (p: any) => {
    setForm({
      title: p.title, category: p.category, difficulty: p.difficulty || '', reportUrl: p.reportUrl || '',
      cover: p.cover || '', status: p.status, description: p.description || '', content: p.content || '',
      tags: p.tags || '', featured: p.featured || false, sortOrder: p.sortOrder || 0,
    });
    setEditingProduct(p);
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({ title: '', category: '气调预制菜', difficulty: '', reportUrl: '', cover: '', status: 'PUBLISHED', description: '', content: '', tags: '', featured: false, sortOrder: 0 });
    setEditingProduct(null);
  };

  const categories = ['气调预制菜', '低温调理肉', '休闲及其他'];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>📦 商超爆款逆向研发</h1>

      {message && (
        <div style={{ padding: '10px 16px', borderRadius: 8, marginBottom: 20, background: message.startsWith('✅') ? '#D1FAE5' : '#FEE2E2', color: message.startsWith('✅') ? '#065F46' : '#991B1B', fontSize: '.9rem' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1 }}>
          <input type="text" placeholder="搜索产品名称..." value={keyword} onChange={e => setKeyword(e.target.value)}
            style={{ flex: 1, padding: '8px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none' }} />
          <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); }}
            style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem' }}>
            <option value="">全部分类</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit" style={{ padding: '8px 20px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>搜索</button>
        </form>
        <button onClick={() => { resetForm(); setShowModal(true); }} style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap' }}>＋ 新增产品</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>加载中...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF', background: '#fff', borderRadius: 12 }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>📦</div>
          <div>暂无产品数据，点击「新增产品」创建</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {products.map(p => (
            <div key={p.id} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              {p.cover ? (
                <img src={p.cover} alt={p.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: 160, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🍖</div>
              )}
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '.75rem', fontWeight: 600, background: '#DBEAFE', color: '#1E40AF' }}>{p.category}</span>
                  {p.featured && <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '.75rem', fontWeight: 600, background: '#FEF3C7', color: '#92400E' }}>★ 推荐</span>}
                  <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '.75rem', fontWeight: 600, background: p.status === 'PUBLISHED' ? '#D1FAE5' : '#FEE2E2', color: p.status === 'PUBLISHED' ? '#065F46' : '#991B1B' }}>
                    {p.status === 'PUBLISHED' ? '已发布' : '草稿'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>{p.title}</h3>
                {p.difficulty && <p style={{ fontSize: '.85rem', color: '#6B7280', marginBottom: 8 }}>⚡ {p.difficulty.slice(0, 60)}{p.difficulty.length > 60 ? '...' : ''}</p>}
                {p.tags && <p style={{ fontSize: '.8rem', color: '#9CA3AF' }}>🏷️ {p.tags}</p>}
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => openEdit(p)} style={{ flex: 1, padding: '6px 0', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '.85rem' }}>编辑</button>
                  <button onClick={() => handleDelete(p.id, p.title)} style={{ padding: '6px 12px', background: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '.85rem' }}>删除</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 680, maxHeight: '85vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 20 }}>{editingProduct ? '编辑产品' : '新增产品'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>产品名称 *</label>
                  <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>分类 *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', boxSizing: 'border-box' }}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>关键难点</label>
                <textarea value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} rows={2}
                  style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #E5E7EB', boxSizing: 'border-box', fontSize: '.9rem' }} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>产品描述</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                  style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #E5E7EB', boxSizing: 'border-box', fontSize: '.9rem' }} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>逆向工艺报告（富文本HTML）</label>
                <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={6}
                  placeholder="支持HTML格式：原料配比、灌装工艺、蒸煮曲线等..."
                  style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #E5E7EB', boxSizing: 'border-box', fontSize: '.85rem', fontFamily: 'monospace' }} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>封面图</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="text" value={form.cover} onChange={e => setForm({ ...form, cover: e.target.value })} placeholder="输入图片URL或点击选择"
                    style={{ flex: 1, padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem' }} />
                  <button type="button" onClick={() => { setPickerTarget('cover'); setShowPicker(true); }} style={{ padding: '8px 14px', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 8, cursor: 'pointer', fontSize: '.85rem', whiteSpace: 'nowrap' }}>📁 选择</button>
                </div>
                {form.cover && <img src={form.cover} alt="封面预览" style={{ marginTop: 8, width: 120, height: 80, objectFit: 'cover', borderRadius: 8 }} />}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>标签（逗号分隔）</label>
                  <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="如：山姆,脆皮肠,逆向"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>报告链接</label>
                  <input type="text" value={form.reportUrl} onChange={e => setForm({ ...form, reportUrl: e.target.value })} placeholder="PDF报告URL"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>状态</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', boxSizing: 'border-box' }}>
                    <option value="PUBLISHED">已发布</option>
                    <option value="DRAFT">草稿</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>排序权重</label>
                  <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '.9rem' }}>
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /> 推荐显示
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} style={{ padding: '8px 20px', background: '#F3F4F6', border: 'none', borderRadius: 8, cursor: 'pointer' }}>取消</button>
                <button type="submit" style={{ padding: '8px 20px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>{editingProduct ? '保存' : '创建'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPicker && pickerTarget === 'cover' && (
        <MediaPicker onSelect={(url) => { setForm({ ...form, cover: url }); setShowPicker(false); }} onClose={() => setShowPicker(false)} />
      )}
    </div>
  );
}
