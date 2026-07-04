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
interface CooperationModel {
  icon: string; title: string; desc: string; bg: string; borderColor: string; color: string;
}
interface PilotConfig {
  slogan: string;
  title: string;
  subtitle: string;
  mapIntro: string;
  cooperationModels: CooperationModel[];
}

export default function HomepageAdminPage() {
  const [activeTab, setActiveTab] = useState<'carousel' | 'industry' | 'pilot' | 'footer'>('carousel');
  const [carousel, setCarousel] = useState<CarouselItem[]>([]);
  const [industry, setIndustry] = useState<IndustryItem[]>([]);
  const [footer, setFooter] = useState<FooterConfig>({ title: '', subtitle: '', groups: [] });
  const [pilot, setPilot] = useState<PilotConfig>({
    slogan: '💡 核心创新板块',
    title: '柔性中试中心 —— 在线预约你的肉品工业实验室',
    subtitle: '无需买设备，盘活全行业闲置产能，打造肉类行业的"药明康德（CRO）"',
    mapIntro: '覆盖全国主要区域的肉类中试资源网络，每区域均面向三类客户服务：高校科研院所（CRO研发）、产业园公共平台（轻资产试错）、辅料企业演示中心（风味调优与爆款逆向）。',
    cooperationModels: [
      { icon: '🎓', title: '找专家、做大改动', desc: '引流到高校科研院所，走CRO高客单价分成模式', bg: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)', borderColor: '#BFDBFE', color: '#1E3A8A' },
      { icon: '🏭', title: '初创品牌、预制菜试错', desc: '推荐到公共中试仓，走标准场租抽佣，政府扶持收费透明', bg: 'linear-gradient(135deg, #D1FAE5 0%, #ECFDF5 100%)', borderColor: '#A7F3D0', color: '#065F46' },
      { icon: '🧪', title: '调风味、做爆款逆向', desc: '撮合到辅料巨头演示中心，辅料带货换取产线开放', bg: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)', borderColor: '#FDE68A', color: '#92400E' },
    ],
  });
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
      if (data.pilot) setPilot(data.pilot);
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

  const savePilot = async () => {
    setSaving(true); setMessage('');
    try {
      const res = await fetch('/api/admin/homepage', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pilot }) });
      if (res.ok) setMessage('✅ 中试中心配置已保存'); else setMessage('❌ 保存失败');
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
  const iconOptions = ['🔬', '⚙️', '📦', '🏭', '🧪', '📊', '🥩', '🍳', '🌶️', '❄️', '🎓', '🗺️'];
  const modelIconOptions = ['🎓', '🏭', '🧪', '🔬', '⚙️', '📦', '📊', '🥩', '🍳', '🌶️', '❄️', '🗺️'];

  const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block', marginBottom: 4, fontSize: '.85rem', fontWeight: 500 };
  const cardStyle = { background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' };
  const btnAddStyle = { padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' as const };
  const btnSaveStyle = { padding: '8px 24px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' as const };
  const btnDelStyle = { background: '#FEE2E2', color: '#EF4444', border: 'none', padding: '4px 12px', borderRadius: 6, cursor: 'pointer' as const, fontSize: '.85rem' };
  const tabBtnStyle = (active: boolean) => ({ padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer' as const, fontSize: '.9rem', fontWeight: 600, background: active ? '#1E3A8A' : '#F3F4F6', color: active ? '#fff' : '#374151' });

  if (loading) return <div style={{ padding: 60, textAlign: 'center' }}>加载中...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>🏠 首页内容管理</h1>

      {message && (
        <div style={{ padding: '10px 16px', borderRadius: 8, marginBottom: 20, background: message.startsWith('✅') ? '#D1FAE5' : '#FEE2E2', color: message.startsWith('✅') ? '#065F46' : '#991B1B', fontSize: '.9rem' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('carousel')} style={tabBtnStyle(activeTab === 'carousel')}>🎠 轮播图管理</button>
        <button onClick={() => setActiveTab('pilot')} style={tabBtnStyle(activeTab === 'pilot')}>🏭 中试中心</button>
        <button onClick={() => setActiveTab('industry')} style={tabBtnStyle(activeTab === 'industry')}>⚙️ 工业4.0栏目</button>
        <button onClick={() => setActiveTab('footer')} style={tabBtnStyle(activeTab === 'footer')}>📱 社群管理</button>
      </div>

      {/* 中试中心管理 */}
      {activeTab === 'pilot' && (
        <div>
          <div style={cardStyle}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>板块标题与描述</h3>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>标语标签（小标签文字）</label>
              <input type="text" value={pilot.slogan} onChange={e => setPilot({ ...pilot, slogan: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>主标题</label>
              <input type="text" value={pilot.title} onChange={e => setPilot({ ...pilot, title: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>副标题</label>
              <input type="text" value={pilot.subtitle} onChange={e => setPilot({ ...pilot, subtitle: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>中试地图页介绍文案</label>
              <textarea value={pilot.mapIntro || ''} onChange={e => setPilot({ ...pilot, mapIntro: e.target.value })} rows={3} style={inputStyle} placeholder="中试地图页顶部显示的介绍文字" />
            </div>
          </div>

          {/* 三类合作模式编辑 */}
          {pilot.cooperationModels.map((model, i) => (
            <div key={i} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>合作模式 #{i + 1}</h3>
                <button onClick={() => setPilot({ ...pilot, cooperationModels: pilot.cooperationModels.filter((_, idx) => idx !== i) })} style={btnDelStyle}>删除</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>图标</label>
                  <select value={model.icon} onChange={e => { const arr = [...pilot.cooperationModels]; arr[i] = { ...model, icon: e.target.value }; setPilot({ ...pilot, cooperationModels: arr }); }} style={{ width: '100%', padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem' }}>
                    {modelIconOptions.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>标题</label>
                  <input type="text" value={model.title} onChange={e => { const arr = [...pilot.cooperationModels]; arr[i] = { ...model, title: e.target.value }; setPilot({ ...pilot, cooperationModels: arr }); }} style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>描述</label>
                <textarea value={model.desc} onChange={e => { const arr = [...pilot.cooperationModels]; arr[i] = { ...model, desc: e.target.value }; setPilot({ ...pilot, cooperationModels: arr }); }} rows={2} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>背景渐变</label>
                  <input type="text" value={model.bg} onChange={e => { const arr = [...pilot.cooperationModels]; arr[i] = { ...model, bg: e.target.value }; setPilot({ ...pilot, cooperationModels: arr }); }} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>边框色</label>
                  <input type="text" value={model.borderColor} onChange={e => { const arr = [...pilot.cooperationModels]; arr[i] = { ...model, borderColor: e.target.value }; setPilot({ ...pilot, cooperationModels: arr }); }} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>文字色</label>
                  <input type="text" value={model.color} onChange={e => { const arr = [...pilot.cooperationModels]; arr[i] = { ...model, color: e.target.value }; setPilot({ ...pilot, cooperationModels: arr }); }} style={inputStyle} />
                </div>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setPilot({ ...pilot, cooperationModels: [...pilot.cooperationModels, { icon: '🔬', title: '新合作模式', desc: '描述内容', bg: 'linear-gradient(135deg, #F3F4F6 0%, #FFFFFF 100%)', borderColor: '#E5E7EB', color: '#374151' }] })} style={btnAddStyle}>＋ 添加合作模式</button>
            <button onClick={savePilot} disabled={saving} style={btnSaveStyle}>{saving ? '保存中...' : '💾 保存中试中心配置'}</button>
          </div>
          <div style={{ marginTop: 16, padding: 16, background: '#FEF3C7', borderRadius: 8, fontSize: '.85rem', color: '#92400E' }}>
            💡 提示：中试机构的具体数据请在「产线管理」页面编辑。此处仅管理首页中试中心板块的展示文案和合作模式卡片。
          </div>
        </div>
      )}

      {activeTab === 'carousel' && (
        <div>
          {carousel.map((item, i) => (
            <div key={i} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>轮播图 #{i + 1}</h3>
                <button onClick={() => setCarousel(carousel.filter((_, idx) => idx !== i))} style={btnDelStyle}>删除</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>标签</label>
                  <input type="text" value={item.tag} onChange={e => { const arr = [...carousel]; arr[i] = { ...item, tag: e.target.value }; setCarousel(arr); }} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>背景样式</label>
                  <select value={item.bg} onChange={e => { const arr = [...carousel]; arr[i] = { ...item, bg: e.target.value }; setCarousel(arr); }} style={{ width: '100%', padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }}>
                    {bgOptions.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>标题</label>
                  <input type="text" value={item.title} onChange={e => { const arr = [...carousel]; arr[i] = { ...item, title: e.target.value }; setCarousel(arr); }} style={inputStyle} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>描述</label>
                  <textarea value={item.desc} onChange={e => { const arr = [...carousel]; arr[i] = { ...item, desc: e.target.value }; setCarousel(arr); }} rows={2} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>按钮文字</label>
                  <input type="text" value={item.btn} onChange={e => { const arr = [...carousel]; arr[i] = { ...item, btn: e.target.value }; setCarousel(arr); }} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>跳转链接</label>
                  <input type="text" value={item.link || ''} onChange={e => { const arr = [...carousel]; arr[i] = { ...item, link: e.target.value }; setCarousel(arr); }} placeholder="/admin/products" style={inputStyle} />
                </div>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setCarousel([...carousel, { tag: '新标签', title: '新标题', desc: '描述内容', bg: 'carousel-bg-1', btn: '点击查看', link: '' }])} style={btnAddStyle}>＋ 添加轮播图</button>
            <button onClick={saveCarousel} disabled={saving} style={btnSaveStyle}>{saving ? '保存中...' : '💾 保存轮播图'}</button>
          </div>
        </div>
      )}

      {activeTab === 'industry' && (
        <div>
          {industry.map((item, i) => (
            <div key={i} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>栏目 #{i + 1}</h3>
                <button onClick={() => setIndustry(industry.filter((_, idx) => idx !== i))} style={btnDelStyle}>删除</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>图标</label>
                  <select value={item.icon} onChange={e => { const arr = [...industry]; arr[i] = { ...item, icon: e.target.value }; setIndustry(arr); }} style={{ width: '100%', padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem' }}>
                    {iconOptions.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>标签</label>
                  <input type="text" value={item.tag} onChange={e => { const arr = [...industry]; arr[i] = { ...item, tag: e.target.value }; setIndustry(arr); }} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>标签背景色</label>
                  <input type="text" value={item.tagBg} onChange={e => { const arr = [...industry]; arr[i] = { ...item, tagBg: e.target.value }; setIndustry(arr); }} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>标签文字色</label>
                  <input type="text" value={item.tagColor} onChange={e => { const arr = [...industry]; arr[i] = { ...item, tagColor: e.target.value }; setIndustry(arr); }} style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>标题</label>
                <input type="text" value={item.title} onChange={e => { const arr = [...industry]; arr[i] = { ...item, title: e.target.value }; setIndustry(arr); }} style={inputStyle} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>描述</label>
                <textarea value={item.desc} onChange={e => { const arr = [...industry]; arr[i] = { ...item, desc: e.target.value }; setIndustry(arr); }} rows={3} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>跳转链接（可选，留空则不可点击）</label>
                <input type="text" value={item.link || ''} onChange={e => { const arr = [...industry]; arr[i] = { ...item, link: e.target.value }; setIndustry(arr); }} placeholder="/article/xxx 或 /product/1" style={inputStyle} />
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setIndustry([...industry, { icon: '🔬', tag: '新标签', tagBg: '#FEF3C7', tagColor: '#92400E', title: '新标题', desc: '描述内容', link: '' }])} style={btnAddStyle}>＋ 添加栏目</button>
            <button onClick={saveIndustry} disabled={saving} style={btnSaveStyle}>{saving ? '保存中...' : '💾 保存栏目'}</button>
          </div>
        </div>
      )}

      {activeTab === 'footer' && (
        <div>
          <div style={cardStyle}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>社群标题与副标题</h3>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>主标题（显示在二维码上方）</label>
              <input type="text" value={footer.title} onChange={e => setFooter({ ...footer, title: e.target.value })} placeholder="📱 加入肉品工程师日常技术互助群（微信私域沉淀）" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>副标题（可选）</label>
              <input type="text" value={footer.subtitle} onChange={e => setFooter({ ...footer, subtitle: e.target.value })} placeholder="扫码加入对应技术交流群" style={inputStyle} />
            </div>
          </div>

          {footer.groups.map((group, i) => (
            <div key={i} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>社群 #{i + 1}</h3>
                <button onClick={() => setFooter({ ...footer, groups: footer.groups.filter((_, idx) => idx !== i) })} style={btnDelStyle}>删除</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>图标</label>
                  <select value={group.icon} onChange={e => { const arr = [...footer.groups]; arr[i] = { ...group, icon: e.target.value }; setFooter({ ...footer, groups: arr }); }} style={{ width: '100%', padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.9rem' }}>
                    {['🍖','🥓','🍱','🧪','⚙️','📦','🥩','🍳','🌶️','❄️','🔬','📊'].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>群名称</label>
                  <input type="text" value={group.name} onChange={e => { const arr = [...footer.groups]; arr[i] = { ...group, name: e.target.value }; setFooter({ ...footer, groups: arr }); }} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>二维码图片 URL（可选，留空则显示图标占位）</label>
                <input type="text" value={group.qrcode || ''} onChange={e => { const arr = [...footer.groups]; arr[i] = { ...group, qrcode: e.target.value }; setFooter({ ...footer, groups: arr }); }} placeholder="/uploads/qrcode-1.png 或外部链接" style={inputStyle} />
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setFooter({ ...footer, groups: [...footer.groups, { icon: '🍖', name: '新交流群', qrcode: '' }] })} style={btnAddStyle}>＋ 添加社群</button>
            <button onClick={saveFooter} disabled={saving} style={btnSaveStyle}>{saving ? '保存中...' : '💾 保存社群配置'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
