'use client';

import { useState, useEffect } from 'react';

interface CarouselItem {
  tag: string; title: string; desc: string; bg: string; btn: string; link: string;
}
interface IndustryItem {
  icon: string; tag: string; tagBg: string; tagColor: string; title: string; desc: string; link: string;
}
interface FooterGroup {
  icon: string; name: string; qrcode: string;
}
interface FooterConfig {
  title: string; subtitle: string; groups: FooterGroup[];
}

export default function HomepageAdminPage() {
  const [activeTab, setActiveTab] = useState<'carousel' | 'industry' | 'footer'>('carousel');
  const [carousel, setCarousel] = useState<CarouselItem[]>([]);
  const [industry, setIndustry] = useState<IndustryItem[]>([]);
  const [footer, setFooter] = useState<FooterConfig>({ title: '', subtitle: '', groups: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin/homepage');
      const data = await res.json();
      setCarousel(data.carousel || []);
      setIndustry(data.industry || []);
      setFooter(data.footer || { title: '', subtitle: '', groups: [] });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const saveCarousel = async () => {
    setSaving(true); setMessage('');
    try {
      const res = await fetch('/api/admin/homepage', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ carousel }) });
      if (res.ok) setMessage('✅ 轮播图配置已保存'); else setMessage('❌ 保存失败');
    } catch { setMessage('❌ 保存失败'); }
    setSaving(false);
  };

  const saveIndustry = async () => {
    setSaving(true); setMessage('');
    try {
      const res = await fetch('/api/admin/homepage', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ industry }) });
      if (res.ok) setMessage('✅ 工业4.0栏目已保存'); else setMessage('❌ 保存失败');
    } catch { setMessage('❌ 保存失败'); }
    setSaving(false);
  };

  const saveFooter = async () => {
    setSaving(true); setMessage('');
    try {
      const res = await fetch('/api/admin/homepage', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ footer }) });
      if (res.ok) setMessage('✅ 社群配置已保存'); else setMessage('❌ 保存失败');
    } catch { setMessage('❌ 保存失败'); }
    setSaving(false);
  };

  const bgOptions = ['carousel-bg-1', 'carousel-bg-2', 'carousel-bg-3'];
  const iconOptions = ['🔬', '⚙️', '📦', '🏭', '🧪', '📊', '🥩', '🍳', '🌶️', '❄️'];

  if (loading) return <div style={{ padding: 60, textAlign: 'center' }}>加载中...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>🏠 首页内容管理</h1>

      {message && (
        <div style={{ padding: '10px 16px', borderRadius: 8, marginBottom: 20, background: message.startsWith('✅') ? '#D1FAE5' : '#FEE2E2', color: message.startsWith('✅') ? '#065F46' : '#991B1B', fontSize: '.9rem' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button onClick={() => setActiveTab('carousel')} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '.9rem', fontWeight: 600, background: activeTab === 'carousel' ? '#1E3A8A' : '#F3F4F6', color: activeTab === 'carousel' ? '#fff' : '#374151' }}>🎠 轮播图管理</button>
        <button onClick={() => setActiveTab('industry')} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '.9rem', fontWeight: 600, background: activeTab === 'industry' ? '#1E3A8A' : '#F3F4F6', color: activeTab === 'industry' ? '#fff' : '#374151' }}>⚙️ 工业4.0栏目</button>
        <button onClick={() => setActiveTab('footer')} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '.9rem', fontWeight: 600, background: activeTab === 'footer' ? '#1E3A8A' : '#F3F4F6', color: activeTab === 'footer' ? '#fff' : '#374151' }}>📱 社群管理</button>
      </div>

      {activeTab === 'carousel' && (
        <div>
          {carousel.map((item, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>轮播图 #{i + 1}</h3>
                <button onClick={() => setCarousel(carousel.filter((_, idx) => idx !== i))} style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: '.85rem' }}>删除</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.85rem', fontWeight: 500 }}>标签</label>
                  <input type="text" value={item.tag} onChange={e => { const arr = [...carousel]; arr[i] = { ...item, tag: e.target.value }; setCarousel(arr); }} style={{ width: '100%', padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.85rem', fontWeight: 500 }}>背景样式</label>
                  <select value={item.bg} onChange={e => { const arr = [...carousel]; arr[i] = { ...item, bg: e.target.value }; setCarousel(arr); }} style={{ width: '100%', padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }}>
                    {bgOptions.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.85rem', fontWeight: 500 }}>标题</label>
                  <input type="text" value={item.title} onChange={e => { const arr = [...carousel]; arr[i] = { ...item, title: e.target.value }; setCarousel(arr); }} style={{ width: '100%', padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.85rem', fontWeight: 500 }}>描述</label>
                  <textarea value={item.desc} onChange={e => { const arr = [...carousel]; arr[i] = { ...item, desc: e.target.value }; setCarousel(arr); }} rows={2} style={{ width: '100%', padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.85rem', fontWeight: 500 }}>按钮文字</label>
                  <input type="text" value={item.btn} onChange={e => { const arr = [...carousel]; arr[i] = { ...item, btn: e.target.value }; setCarousel(arr); }} style={{ width: '100%', padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.85rem', fontWeight: 500 }}>跳转链接</label>
                  <input type="text" value={item.link || ''} onChange={e => { const arr = [...carousel]; arr[i] = { ...item, link: e.target.value }; setCarousel(arr); }} placeholder="/admin/products" style={{ width: '100%', padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setCarousel([...carousel, { tag: '新标签', title: '新标题', desc: '描述内容', bg: 'carousel-bg-1', btn: '点击查看', link: '' }])} style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>＋ 添加轮播图</button>
            <button onClick={saveCarousel} disabled={saving} style={{ padding: '8px 24px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>{saving ? '保存中...' : '💾 保存轮播图'}</button>
          </div>
        </div>
      )}

      {activeTab === 'industry' && (
        <div>
          {industry.map((item, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>栏目 #{i + 1}</h3>
                <button onClick={() => setIndustry(industry.filter((_, idx) => idx !== i))} style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: '.85rem' }}>删除</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.85rem', fontWeight: 500 }}>图标</label>
                  <select value={item.icon} onChange={e => { const arr = [...industry]; arr[i] = { ...item, icon: e.target.value }; setIndustry(arr); }} style={{ width: '100%', padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem' }}>
                    {iconOptions.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.85rem', fontWeight: 500 }}>标签</label>
                  <input type="text" value={item.tag} onChange={e => { const arr = [...industry]; arr[i] = { ...item, tag: e.target.value }; setIndustry(arr); }} style={{ width: '100%', padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.85rem', fontWeight: 500 }}>标签背景色</label>
                  <input type="text" value={item.tagBg} onChange={e => { const arr = [...industry]; arr[i] = { ...item, tagBg: e.target.value }; setIndustry(arr); }} style={{ width: '100%', padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.85rem', fontWeight: 500 }}>标签文字色</label>
                  <input type="text" value={item.tagColor} onChange={e => { const arr = [...industry]; arr[i] = { ...item, tagColor: e.target.value }; setIndustry(arr); }} style={{ width: '100%', padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.85rem', fontWeight: 500 }}>标题</label>
                <input type="text" value={item.title} onChange={e => { const arr = [...industry]; arr[i] = { ...item, title: e.target.value }; setIndustry(arr); }} style={{ width: '100%', padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.85rem', fontWeight: 500 }}>描述</label>
                <textarea value={item.desc} onChange={e => { const arr = [...industry]; arr[i] = { ...item, desc: e.target.value }; setIndustry(arr); }} rows={3} style={{ width: '100%', padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.85rem', fontWeight: 500 }}>跳转链接（可选，留空则不可点击）</label>
                <input type="text" value={item.link || ''} onChange={e => { const arr = [...industry]; arr[i] = { ...item, link: e.target.value }; setIndustry(arr); }} placeholder="/article/xxx 或 /product/1" style={{ width: '100%', padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }} />
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setIndustry([...industry, { icon: '🔬', tag: '新标签', tagBg: '#FEF3C7', tagColor: '#92400E', title: '新标题', desc: '描述内容', link: '' }])} style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>＋ 添加栏目</button>
            <button onClick={saveIndustry} disabled={saving} style={{ padding: '8px 24px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>{saving ? '保存中...' : '💾 保存栏目'}</button>
          </div>
        </div>
      )}

      {activeTab === 'footer' && (
        <div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>社群标题与副标题</h3>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: '.85rem', fontWeight: 500 }}>主标题（显示在二维码上方）</label>
              <input type="text" value={footer.title} onChange={e => setFooter({ ...footer, title: e.target.value })} placeholder="📱 加入肉品工程师日常技术互助群（微信私域沉淀）" style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: '.85rem', fontWeight: 500 }}>副标题（可选）</label>
              <input type="text" value={footer.subtitle} onChange={e => setFooter({ ...footer, subtitle: e.target.value })} placeholder="扫码加入对应技术交流群" style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }} />
            </div>
          </div>

          {footer.groups.map((group, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>社群 #{i + 1}</h3>
                <button onClick={() => setFooter({ ...footer, groups: footer.groups.filter((_, idx) => idx !== i) })} style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: '.85rem' }}>删除</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.85rem', fontWeight: 500 }}>图标</label>
                  <select value={group.icon} onChange={e => { const arr = [...footer.groups]; arr[i] = { ...group, icon: e.target.value }; setFooter({ ...footer, groups: arr }); }} style={{ width: '100%', padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem' }}>
                    {['🍖','🥓','🍱','🧪','⚙️','📦','🥩','🍳','🌶️','❄️','🔬','📊'].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.85rem', fontWeight: 500 }}>群名称</label>
                  <input type="text" value={group.name} onChange={e => { const arr = [...footer.groups]; arr[i] = { ...group, name: e.target.value }; setFooter({ ...footer, groups: arr }); }} style={{ width: '100%', padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.85rem', fontWeight: 500 }}>二维码图片 URL（可选，留空则显示图标占位）</label>
                <input type="text" value={group.qrcode || ''} onChange={e => { const arr = [...footer.groups]; arr[i] = { ...group, qrcode: e.target.value }; setFooter({ ...footer, groups: arr }); }} placeholder="/uploads/qrcode-1.png 或外部链接" style={{ width: '100%', padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }} />
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setFooter({ ...footer, groups: [...footer.groups, { icon: '🍖', name: '新交流群', qrcode: '' }] })} style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>＋ 添加社群</button>
            <button onClick={saveFooter} disabled={saving} style={{ padding: '8px 24px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>{saving ? '保存中...' : '💾 保存社群配置'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
