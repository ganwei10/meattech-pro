'use client';

import { useState, useEffect } from 'react';
import { defaultSiteGlobalConfig } from '@/lib/siteConfig';

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

interface SectionsConfig {
  heroBadge: string;
  heroSlogan: string;
  heroSub: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  reverseIcon: string;
  reverseTitle: string;
  reverseBadge: string;
  reverseIntro: string;
  scienceIcon: string;
  scienceTitle: string;
  scienceBadge: string;
  scienceIntro: string;
  communityBadge: string;
  communityTitle: string;
  communitySub: string;
  industryIcon: string;
  industryTitle: string;
  industryBadge: string;
  industryIntro: string;
}

interface ReverseItem {
  title: string; category: string; difficulty: string; link: string; icon: string; tags?: string;
}

interface GlobalConfig {
  header: {
    logoText: string;
    navItems: { label: string; href: string }[];
    searchPlaceholder: string;
    searchBtnText: string;
    askBtnText: string;
    bookBtnText: string;
  };
  footer: {
    disclaimerTitle: string;
    disclaimerText: string;
    cooperationTitle: string;
    cooperationText: string;
    cooperationBtnText: string;
    copyrightText: string;
  };
  tools: {
    gb2760: { title: string; subtitle: string; disclaimer: string };
    troubleshoot: { title: string; subtitle: string };
    pilotMap: {
      title: string; subtitle: string; mapIntro: string; backToHome: string;
      statsLabels: { total: string; regions: string; universities: string; parks: string; enterprises: string };
      typeConfig: Record<string, { label: string; icon: string; color: string; bg: string; desc: string; model: string; sectionTitle: string }>;
      cooperationModels: { icon: string; title: string; desc: string; bg: string; borderColor: string; color: string }[];
      cardLabels: { available: string; booked: string; advantages: string; equipment: string; cooperation: string; bookBtn: string; capacityFallback: string };
      emptyState: { icon: string; title: string; desc: string };
      cta: { title: string; desc: string; btnText: string };
    };
  };
  booking: { title: string; subtitle: string };
  bookingDetail: {
    backBtn: string; title: string; notFoundIcon: string; notFoundTitle: string; backToBooking: string;
    lineUnavailable: string; requirementLabel: string; adminNoteLabel: string;
    statusLabels: { PENDING: string; CONFIRMED: string; IN_PROGRESS: string; COMPLETED: string; CANCELLED: string };
    fieldLabels: { id: string; contactName: string; contactPhone: string; contactEmail: string; company: string; experimentType: string; preferredDate: string; createdAt: string };
  };
  community: {
    headerBadge: string; headerTitle: string; headerDesc: string; askBtnText: string;
    searchPlaceholder: string; searchBtnText: string; allTagText: string; readText: string;
    emptyState: { icon: string; title: string; desc: string; btnText: string };
  };
  ask: {
    backBtn: string; title: string; desc: string; titleLabel: string; titlePlaceholder: string;
    tagsLabel: string; tagsPlaceholder: string; tagSuggestions: string[];
    contentLabel: string; contentPlaceholder: string; contactTitle: string;
    authorLabel: string; authorPlaceholder: string; phoneLabel: string; phonePlaceholder: string;
    emailLabel: string; emailPlaceholder: string; submitBtn: string; submittingBtn: string; cancelBtn: string;
    successIcon: string; successTitle: string; successDesc: string;
    errorTitleRequired: string; errorContentRequired: string; errorNetwork: string;
  };
  homepage: {
    toolCards: { icon: string; bg: string; color: string; title: string; desc: string; link: string }[];
    discussionBarText: string; discussionBarCta: string;
    communityCards: { icon: string; title: string; desc: string; tags: string[]; link: string; highlight?: boolean }[];
    pilotDemo: { title: string; liveLabel: string; liveLocation: string; chatText: string };
    pilotCardTitle: string; pilotCardSubtitle: string; pilotBtnText: string;
    categoryNavTitle: string; reverseReportLink: string; keyDifficulty: string; viewAllInstitutions: string;
    liveBadge: string;
    dataPanelLabels: { vacuum: string; temp: string; speed: string; runtime: string };
    dataPanelValues: { vacuum: string; temp: string; speed: string; runtime: string };
    toolboxTitle: string; askNowBtn: string; browseAllBtn: string; coreFeatureBadge: string;
    communityCardCtas: { community: string; footer: string; articles: string };
    postCountText: string; categoryCountText: string; noPostsText: string; noPostsCta: string;
    availableText: string; bookedText: string; techFrontierText: string;
  };
  search: {
    title: string; resultCountText: string; emptyIcon: string; emptyText: string;
    articlesHeader: string; productsHeader: string;
  };
  category: {
    breadcrumbHome: string; breadcrumbScience: string; navTitle: string; postCountText: string; readText: string;
    notFoundIcon: string; notFoundTitle: string; notFoundDesc: string; backToHome: string;
    emptyIcon: string; emptyTitle: string; emptyDesc: string; emptyCta: string;
  };
  article: {
    breadcrumbHome: string; readText: string; helpfulText: string; ctaBtn: string;
  };
  product: {
    backBtn: string; keyDifficulty: string; featuredBadge: string; summaryTitle: string;
    reportTitle: string; reportLink: string; bookBtn: string; publishText: string;
  };
}

export default function HomepageAdminPage() {
  const [activeTab, setActiveTab] = useState<'carousel' | 'industry' | 'pilot' | 'footer' | 'sections' | 'reverse' | 'global'>('carousel');
  const [globalSubTab, setGlobalSubTab] = useState<'header-footer' | 'pilotmap' | 'pages' | 'homepage-detail'>('header-footer');
  const [carousel, setCarousel] = useState<CarouselItem[]>([]);
  const [industry, setIndustry] = useState<IndustryItem[]>([]);
  const [reverse, setReverse] = useState<ReverseItem[]>([]);
  const [globalCfg, setGlobalCfg] = useState<GlobalConfig>(defaultSiteGlobalConfig as unknown as GlobalConfig);
  const [footer, setFooter] = useState<FooterConfig>({ title: '', subtitle: '', groups: [] });
  const [sections, setSections] = useState<SectionsConfig>({
    heroBadge: '🥩 肉制品研发与智能中试平台',
    heroSlogan: '赋能每一位肉品工艺工程师',
    heroSub: '从深度技术长文到中试产线预约，从疑难问答到同行交流，全链路服务肉制品研发',
    heroCtaPrimary: '💬 进入工艺问答讨论',
    heroCtaSecondary: '🏭 预约中试线',
    reverseIcon: '📌',
    reverseTitle: '货架直通车间',
    reverseBadge: '商超爆款逆向研发',
    reverseIntro: '追踪山姆、盒马等零售终端销量走势，逆向拆解工业化量产工艺',
    scienceIcon: '🔬',
    scienceTitle: '硬核肉品科学',
    scienceBadge: '工业配方重构与故障排查矩阵',
    scienceIntro: '深入肉类生物化学底层，解决清洁标签、减盐减硝等现代改性需求',
    communityBadge: '💬 工艺工程师讨论社区',
    communityTitle: '有问题随时问，有经验随时分享',
    communitySub: '出水、散肉、色泽不均、保质期不达标……遇到工艺难题，发帖求助同行专家。已有技术内容沉淀，持续更新中。',
    industryIcon: '⚙️',
    industryTitle: '工业4.0',
    industryBadge: '设备选型与原辅料应用指南',
    industryIntro: '拒绝硬广告，只看辅料与设备在实际生产中的"应用案例（Case Study）"',
  });
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
      setReverse(data.reverse || []);
      setFooter(data.footer || { title: '', subtitle: '', groups: [] });
      if (data.pilot) setPilot(data.pilot);
      if (data.sections) setSections(data.sections);
      if (data.global) setGlobalCfg(data.global);
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

  const saveSections = async () => {
    setSaving(true); setMessage('');
    try {
      const res = await fetch('/api/admin/homepage', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sections }) });
      if (res.ok) setMessage('✅ 首页文案配置已保存'); else setMessage('❌ 保存失败');
    } catch { setMessage('❌ 保存失败'); }
    setSaving(false);
  };

  const saveReverse = async () => {
    setSaving(true); setMessage('');
    try {
      const res = await fetch('/api/admin/homepage', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reverse }) });
      if (res.ok) setMessage('✅ 货架直通车间配置已保存'); else setMessage('❌ 保存失败');
    } catch { setMessage('❌ 保存失败'); }
    setSaving(false);
  };

  const saveGlobal = async () => {
    setSaving(true); setMessage('');
    try {
      const res = await fetch('/api/admin/homepage', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ global: globalCfg }) });
      if (res.ok) setMessage('✅ 全站配置已保存'); else setMessage('❌ 保存失败');
    } catch { setMessage('❌ 保存失败'); }
    setSaving(false);
  };

  const bgOptions = ['carousel-bg-1', 'carousel-bg-2', 'carousel-bg-3', 'carousel-bg-4'];
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
        <button onClick={() => setActiveTab('sections')} style={tabBtnStyle(activeTab === 'sections')}>📝 首页文案</button>
        <button onClick={() => setActiveTab('reverse')} style={tabBtnStyle(activeTab === 'reverse')}>📌 货架直通</button>
        <button onClick={() => setActiveTab('carousel')} style={tabBtnStyle(activeTab === 'carousel')}>🎠 轮播图管理</button>
        <button onClick={() => setActiveTab('pilot')} style={tabBtnStyle(activeTab === 'pilot')}>🏭 中试中心</button>
        <button onClick={() => setActiveTab('industry')} style={tabBtnStyle(activeTab === 'industry')}>⚙️ 工业4.0栏目</button>
        <button onClick={() => setActiveTab('footer')} style={tabBtnStyle(activeTab === 'footer')}>📱 社群管理</button>
        <button onClick={() => setActiveTab('global')} style={tabBtnStyle(activeTab === 'global')}>🌐 全站配置</button>
      </div>

      {/* 首页文案管理 */}
      {activeTab === 'sections' && (
        <div>
          {/* Hero 区域 */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>🎯 Hero 区域（首屏顶部）</h3>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>徽章标签</label>
              <input type="text" value={sections.heroBadge} onChange={e => setSections({ ...sections, heroBadge: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>主标语（大标题）</label>
              <input type="text" value={sections.heroSlogan} onChange={e => setSections({ ...sections, heroSlogan: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>副标题描述</label>
              <textarea value={sections.heroSub} onChange={e => setSections({ ...sections, heroSub: e.target.value })} rows={2} style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>主按钮文字</label>
                <input type="text" value={sections.heroCtaPrimary} onChange={e => setSections({ ...sections, heroCtaPrimary: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>次按钮文字</label>
                <input type="text" value={sections.heroCtaSecondary} onChange={e => setSections({ ...sections, heroCtaSecondary: e.target.value })} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* 货架直通车间 */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>📌 货架直通车间板块</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={labelStyle}>图标</label>
                <input type="text" value={sections.reverseIcon} onChange={e => setSections({ ...sections, reverseIcon: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>标题</label>
                <input type="text" value={sections.reverseTitle} onChange={e => setSections({ ...sections, reverseTitle: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>标签文字</label>
                <input type="text" value={sections.reverseBadge} onChange={e => setSections({ ...sections, reverseBadge: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>描述文字</label>
              <textarea value={sections.reverseIntro} onChange={e => setSections({ ...sections, reverseIntro: e.target.value })} rows={2} style={inputStyle} />
            </div>
          </div>

          {/* 硬核肉品科学 */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>🔬 硬核肉品科学板块</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={labelStyle}>图标</label>
                <input type="text" value={sections.scienceIcon} onChange={e => setSections({ ...sections, scienceIcon: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>标题</label>
                <input type="text" value={sections.scienceTitle} onChange={e => setSections({ ...sections, scienceTitle: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>标签文字</label>
                <input type="text" value={sections.scienceBadge} onChange={e => setSections({ ...sections, scienceBadge: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>描述文字</label>
              <textarea value={sections.scienceIntro} onChange={e => setSections({ ...sections, scienceIntro: e.target.value })} rows={2} style={inputStyle} />
            </div>
          </div>

          {/* 工艺工程师讨论社区 */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>💬 工艺工程师讨论社区板块</h3>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>徽章标签</label>
              <input type="text" value={sections.communityBadge} onChange={e => setSections({ ...sections, communityBadge: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>标题</label>
              <input type="text" value={sections.communityTitle} onChange={e => setSections({ ...sections, communityTitle: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>描述文字</label>
              <textarea value={sections.communitySub} onChange={e => setSections({ ...sections, communitySub: e.target.value })} rows={3} style={inputStyle} />
            </div>
          </div>

          {/* 工业4.0 */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>⚙️ 工业4.0板块</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={labelStyle}>图标</label>
                <input type="text" value={sections.industryIcon} onChange={e => setSections({ ...sections, industryIcon: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>标题</label>
                <input type="text" value={sections.industryTitle} onChange={e => setSections({ ...sections, industryTitle: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>标签文字</label>
                <input type="text" value={sections.industryBadge} onChange={e => setSections({ ...sections, industryBadge: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>描述文字</label>
              <textarea value={sections.industryIntro} onChange={e => setSections({ ...sections, industryIntro: e.target.value })} rows={2} style={inputStyle} />
            </div>
          </div>

          <button onClick={saveSections} disabled={saving} style={btnSaveStyle}>{saving ? '保存中...' : '💾 保存首页文案配置'}</button>
        </div>
      )}

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

      {/* 货架直通车间管理 */}
      {activeTab === 'reverse' && (
        <div>
          <div style={{ ...cardStyle, background: '#FEF3C7', borderLeft: '4px solid #F59E0B' }}>
            <p style={{ fontSize: '.85rem', color: '#92400E', margin: 0 }}>
              💡 此处管理的卡片会显示在首页"货架直通车间"板块。数据库中的产品会自动追加在自定义卡片之后。
              如需管理产品库，请前往「商超爆款」页面。
            </p>
          </div>
          {reverse.map((item, i) => (
            <div key={i} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>逆向研发卡片 #{i + 1}</h3>
                <button onClick={() => setReverse(reverse.filter((_, idx) => idx !== i))} style={btnDelStyle}>删除</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>图标</label>
                  <input type="text" value={item.icon} onChange={e => { const arr = [...reverse]; arr[i] = { ...item, icon: e.target.value }; setReverse(arr); }} style={inputStyle} placeholder="🍖" />
                </div>
                <div>
                  <label style={labelStyle}>标题</label>
                  <input type="text" value={item.title} onChange={e => { const arr = [...reverse]; arr[i] = { ...item, title: e.target.value }; setReverse(arr); }} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>分类标签</label>
                  <input type="text" value={item.category} onChange={e => { const arr = [...reverse]; arr[i] = { ...item, category: e.target.value }; setReverse(arr); }} style={inputStyle} placeholder="如：气调预制菜" />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>关键难点</label>
                <textarea value={item.difficulty} onChange={e => { const arr = [...reverse]; arr[i] = { ...item, difficulty: e.target.value }; setReverse(arr); }} rows={2} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>跳转链接</label>
                <input type="text" value={item.link} onChange={e => { const arr = [...reverse]; arr[i] = { ...item, link: e.target.value }; setReverse(arr); }} style={inputStyle} placeholder="/product/1 或外部链接" />
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setReverse([...reverse, { title: '新逆向研发项目', category: '气调预制菜', difficulty: '关键工艺难点描述', link: '/product/1', icon: '🍖' }])} style={btnAddStyle}>＋ 添加卡片</button>
            <button onClick={saveReverse} disabled={saving} style={btnSaveStyle}>{saving ? '保存中...' : '💾 保存货架直通配置'}</button>
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

      {/* 全站配置管理 */}
      {activeTab === 'global' && globalCfg && (
        <div>
          {/* Sub-tabs for global config */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            <button onClick={() => setGlobalSubTab('header-footer')} style={tabBtnStyle(globalSubTab === 'header-footer')}>🖥️ Header/Footer</button>
            <button onClick={() => setGlobalSubTab('pilotmap')} style={tabBtnStyle(globalSubTab === 'pilotmap')}>🗺️ 中试地图页</button>
            <button onClick={() => setGlobalSubTab('pages')} style={tabBtnStyle(globalSubTab === 'pages')}>📄 各页面文案</button>
            <button onClick={() => setGlobalSubTab('homepage-detail')} style={tabBtnStyle(globalSubTab === 'homepage-detail')}>🏠 首页详细</button>
          </div>

          {/* Sub-tab: Header/Footer */}
          {globalSubTab === 'header-footer' && (
            <>
              {/* Header 配置 */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>🖥️ 顶部导航栏（Header）</h3>
                <div style={{ marginBottom: 12 }}>
                  <label style={labelStyle}>Logo 文字</label>
                  <input type="text" value={globalCfg.header.logoText} onChange={e => setGlobalCfg({ ...globalCfg, header: { ...globalCfg.header, logoText: e.target.value } })} style={inputStyle} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={labelStyle}>搜索框占位文字</label>
                  <input type="text" value={globalCfg.header.searchPlaceholder} onChange={e => setGlobalCfg({ ...globalCfg, header: { ...globalCfg.header, searchPlaceholder: e.target.value } })} style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div><label style={labelStyle}>搜索按钮文字</label><input type="text" value={globalCfg.header.searchBtnText} onChange={e => setGlobalCfg({ ...globalCfg, header: { ...globalCfg.header, searchBtnText: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>提问按钮文字</label><input type="text" value={globalCfg.header.askBtnText} onChange={e => setGlobalCfg({ ...globalCfg, header: { ...globalCfg.header, askBtnText: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>预约按钮文字</label><input type="text" value={globalCfg.header.bookBtnText} onChange={e => setGlobalCfg({ ...globalCfg, header: { ...globalCfg.header, bookBtnText: e.target.value } })} style={inputStyle} /></div>
                </div>
                <label style={labelStyle}>导航菜单项（可增删改）</label>
                {globalCfg.header.navItems.map((item, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, marginBottom: 8 }}>
                    <input type="text" value={item.label} onChange={e => { const arr = [...globalCfg.header.navItems]; arr[i] = { ...item, label: e.target.value }; setGlobalCfg({ ...globalCfg, header: { ...globalCfg.header, navItems: arr } }); }} placeholder="显示文字" style={inputStyle} />
                    <input type="text" value={item.href} onChange={e => { const arr = [...globalCfg.header.navItems]; arr[i] = { ...item, href: e.target.value }; setGlobalCfg({ ...globalCfg, header: { ...globalCfg.header, navItems: arr } }); }} placeholder="链接地址" style={inputStyle} />
                    <button onClick={() => setGlobalCfg({ ...globalCfg, header: { ...globalCfg.header, navItems: globalCfg.header.navItems.filter((_, j) => j !== i) } })} style={btnDelStyle}>删</button>
                  </div>
                ))}
                <button onClick={() => setGlobalCfg({ ...globalCfg, header: { ...globalCfg.header, navItems: [...globalCfg.header.navItems, { label: '新菜单项', href: '/' }] } })} style={btnAddStyle}>＋ 添加导航项</button>
              </div>

              {/* Footer 配置 */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>📄 页脚内容（Footer）</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div><label style={labelStyle}>免责声明标题</label><input type="text" value={globalCfg.footer.disclaimerTitle} onChange={e => setGlobalCfg({ ...globalCfg, footer: { ...globalCfg.footer, disclaimerTitle: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>合作入驻标题</label><input type="text" value={globalCfg.footer.cooperationTitle} onChange={e => setGlobalCfg({ ...globalCfg, footer: { ...globalCfg.footer, cooperationTitle: e.target.value } })} style={inputStyle} /></div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={labelStyle}>免责声明内容</label>
                  <textarea value={globalCfg.footer.disclaimerText} onChange={e => setGlobalCfg({ ...globalCfg, footer: { ...globalCfg.footer, disclaimerText: e.target.value } })} rows={3} style={inputStyle} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={labelStyle}>合作入驻内容</label>
                  <textarea value={globalCfg.footer.cooperationText} onChange={e => setGlobalCfg({ ...globalCfg, footer: { ...globalCfg.footer, cooperationText: e.target.value } })} rows={3} style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div><label style={labelStyle}>合作入驻按钮文字</label><input type="text" value={globalCfg.footer.cooperationBtnText} onChange={e => setGlobalCfg({ ...globalCfg, footer: { ...globalCfg.footer, cooperationBtnText: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>版权文字</label><input type="text" value={globalCfg.footer.copyrightText} onChange={e => setGlobalCfg({ ...globalCfg, footer: { ...globalCfg.footer, copyrightText: e.target.value } })} style={inputStyle} /></div>
                </div>
              </div>
            </>
          )}

          {/* Sub-tab: Pilot Map */}
          {globalSubTab === 'pilotmap' && (
            <>
              {/* 中试地图页基本配置 */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>🗺️ 中试地图页 - 基本配置</h3>
                <div style={{ marginBottom: 12 }}><label style={labelStyle}>返回首页文字</label><input type="text" value={globalCfg.tools.pilotMap.backToHome} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, backToHome: e.target.value } } })} style={inputStyle} /></div>
                <div style={{ marginBottom: 12 }}><label style={labelStyle}>页面标题</label><input type="text" value={globalCfg.tools.pilotMap.title} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, title: e.target.value } } })} style={inputStyle} /></div>
                <div style={{ marginBottom: 12 }}><label style={labelStyle}>页面副标题</label><input type="text" value={globalCfg.tools.pilotMap.subtitle} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, subtitle: e.target.value } } })} style={inputStyle} /></div>
                <div style={{ marginBottom: 12 }}><label style={labelStyle}>地图介绍文字</label><textarea value={globalCfg.tools.pilotMap.mapIntro} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, mapIntro: e.target.value } } })} rows={2} style={inputStyle} /></div>
              </div>

              {/* 统计栏标签 */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>📊 统计栏标签</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 8 }}>
                  <div><label style={labelStyle}>机构总数</label><input type="text" value={globalCfg.tools.pilotMap.statsLabels.total} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, statsLabels: { ...globalCfg.tools.pilotMap.statsLabels, total: e.target.value } } } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>覆盖区域</label><input type="text" value={globalCfg.tools.pilotMap.statsLabels.regions} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, statsLabels: { ...globalCfg.tools.pilotMap.statsLabels, regions: e.target.value } } } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>高校</label><input type="text" value={globalCfg.tools.pilotMap.statsLabels.universities} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, statsLabels: { ...globalCfg.tools.pilotMap.statsLabels, universities: e.target.value } } } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>产业园</label><input type="text" value={globalCfg.tools.pilotMap.statsLabels.parks} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, statsLabels: { ...globalCfg.tools.pilotMap.statsLabels, parks: e.target.value } } } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>辅料企业</label><input type="text" value={globalCfg.tools.pilotMap.statsLabels.enterprises} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, statsLabels: { ...globalCfg.tools.pilotMap.statsLabels, enterprises: e.target.value } } } })} style={inputStyle} /></div>
                </div>
              </div>

              {/* 机构类型配置 */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>🏷️ 机构类型配置</h3>
                {['UNIVERSITY', 'PARK', 'ENTERPRISE', 'OTHER'].map(typeKey => {
                  const tc = globalCfg.tools.pilotMap.typeConfig[typeKey];
                  if (!tc) return null;
                  return (
                    <div key={typeKey} style={{ marginBottom: 12, padding: 12, background: '#F9FAFB', borderRadius: 8 }}>
                      <strong style={{ fontSize: '.85rem' }}>{typeKey}</strong>
                      <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr', gap: 8, marginTop: 8 }}>
                        <div><label style={labelStyle}>图标</label><input type="text" value={tc.icon} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, typeConfig: { ...globalCfg.tools.pilotMap.typeConfig, [typeKey]: { ...tc, icon: e.target.value } } } } })} style={inputStyle} /></div>
                        <div><label style={labelStyle}>标签</label><input type="text" value={tc.label} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, typeConfig: { ...globalCfg.tools.pilotMap.typeConfig, [typeKey]: { ...tc, label: e.target.value } } } } })} style={inputStyle} /></div>
                        <div><label style={labelStyle}>区块标题</label><input type="text" value={tc.sectionTitle} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, typeConfig: { ...globalCfg.tools.pilotMap.typeConfig, [typeKey]: { ...tc, sectionTitle: e.target.value } } } } })} style={inputStyle} /></div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                        <div><label style={labelStyle}>描述</label><input type="text" value={tc.desc} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, typeConfig: { ...globalCfg.tools.pilotMap.typeConfig, [typeKey]: { ...tc, desc: e.target.value } } } } })} style={inputStyle} /></div>
                        <div><label style={labelStyle}>合作模式提示</label><input type="text" value={tc.model} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, typeConfig: { ...globalCfg.tools.pilotMap.typeConfig, [typeKey]: { ...tc, model: e.target.value } } } } })} style={inputStyle} /></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 合作模式卡片 */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>🤝 合作模式卡片</h3>
                {globalCfg.tools.pilotMap.cooperationModels.map((model, i) => (
                  <div key={i} style={{ marginBottom: 12, padding: 12, background: '#F9FAFB', borderRadius: 8 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr auto', gap: 8 }}>
                      <input type="text" value={model.icon} onChange={e => { const arr = [...globalCfg.tools.pilotMap.cooperationModels]; arr[i] = { ...model, icon: e.target.value }; setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, cooperationModels: arr } } }); }} placeholder="图标" style={{ ...inputStyle, textAlign: 'center' }} />
                      <input type="text" value={model.title} onChange={e => { const arr = [...globalCfg.tools.pilotMap.cooperationModels]; arr[i] = { ...model, title: e.target.value }; setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, cooperationModels: arr } } }); }} placeholder="标题" style={inputStyle} />
                      <input type="text" value={model.desc} onChange={e => { const arr = [...globalCfg.tools.pilotMap.cooperationModels]; arr[i] = { ...model, desc: e.target.value }; setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, cooperationModels: arr } } }); }} placeholder="描述" style={inputStyle} />
                      <button onClick={() => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, cooperationModels: globalCfg.tools.pilotMap.cooperationModels.filter((_, j) => j !== i) } } })} style={btnDelStyle}>删</button>
                    </div>
                  </div>
                ))}
                <button onClick={() => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, cooperationModels: [...globalCfg.tools.pilotMap.cooperationModels, { icon: '🔬', title: '新模式', desc: '描述', bg: '#F3F4F6', borderColor: '#E5E7EB', color: '#374151' }] } } })} style={btnAddStyle}>＋ 添加合作模式</button>
              </div>

              {/* 卡片标签 + 空状态 + CTA */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>🏷️ 机构卡片标签文字</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                  <div><label style={labelStyle}>有档期</label><input type="text" value={globalCfg.tools.pilotMap.cardLabels.available} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, cardLabels: { ...globalCfg.tools.pilotMap.cardLabels, available: e.target.value } } } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>需预约</label><input type="text" value={globalCfg.tools.pilotMap.cardLabels.booked} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, cardLabels: { ...globalCfg.tools.pilotMap.cardLabels, booked: e.target.value } } } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>产能面议</label><input type="text" value={globalCfg.tools.pilotMap.cardLabels.capacityFallback} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, cardLabels: { ...globalCfg.tools.pilotMap.cardLabels, capacityFallback: e.target.value } } } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>核心优势</label><input type="text" value={globalCfg.tools.pilotMap.cardLabels.advantages} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, cardLabels: { ...globalCfg.tools.pilotMap.cardLabels, advantages: e.target.value } } } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>设备配置</label><input type="text" value={globalCfg.tools.pilotMap.cardLabels.equipment} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, cardLabels: { ...globalCfg.tools.pilotMap.cardLabels, equipment: e.target.value } } } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>合作模式</label><input type="text" value={globalCfg.tools.pilotMap.cardLabels.cooperation} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, cardLabels: { ...globalCfg.tools.pilotMap.cardLabels, cooperation: e.target.value } } } })} style={inputStyle} /></div>
                </div>
                <div style={{ marginBottom: 12 }}><label style={labelStyle}>预约按钮文字</label><input type="text" value={globalCfg.tools.pilotMap.cardLabels.bookBtn} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, cardLabels: { ...globalCfg.tools.pilotMap.cardLabels, bookBtn: e.target.value } } } })} style={inputStyle} /></div>
              </div>

              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>📭 空状态 & 底部CTA</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 8, marginBottom: 12 }}>
                  <div><label style={labelStyle}>空状态图标</label><input type="text" value={globalCfg.tools.pilotMap.emptyState.icon} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, emptyState: { ...globalCfg.tools.pilotMap.emptyState, icon: e.target.value } } } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>空状态标题</label><input type="text" value={globalCfg.tools.pilotMap.emptyState.title} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, emptyState: { ...globalCfg.tools.pilotMap.emptyState, title: e.target.value } } } })} style={inputStyle} /></div>
                </div>
                <div style={{ marginBottom: 12 }}><label style={labelStyle}>空状态描述</label><textarea value={globalCfg.tools.pilotMap.emptyState.desc} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, emptyState: { ...globalCfg.tools.pilotMap.emptyState, desc: e.target.value } } } })} rows={2} style={inputStyle} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                  <div><label style={labelStyle}>CTA标题</label><input type="text" value={globalCfg.tools.pilotMap.cta.title} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, cta: { ...globalCfg.tools.pilotMap.cta, title: e.target.value } } } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>CTA描述</label><input type="text" value={globalCfg.tools.pilotMap.cta.desc} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, cta: { ...globalCfg.tools.pilotMap.cta, desc: e.target.value } } } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>CTA按钮文字</label><input type="text" value={globalCfg.tools.pilotMap.cta.btnText} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, pilotMap: { ...globalCfg.tools.pilotMap, cta: { ...globalCfg.tools.pilotMap.cta, btnText: e.target.value } } } })} style={inputStyle} /></div>
                </div>
              </div>
            </>
          )}

          {/* Sub-tab: Pages */}
          {globalSubTab === 'pages' && (
            <>
              {/* 工具页配置 */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>🛠️ GB2760 & 故障排查页</h3>
                <div style={{ marginBottom: 12, padding: 12, background: '#F9FAFB', borderRadius: 8 }}>
                  <strong style={{ fontSize: '.85rem' }}>GB 2760 计算器页</strong>
                  <div style={{ marginTop: 8 }}><label style={labelStyle}>页面标题</label><input type="text" value={globalCfg.tools.gb2760.title} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, gb2760: { ...globalCfg.tools.gb2760, title: e.target.value } } })} style={inputStyle} /></div>
                  <div style={{ marginTop: 8 }}><label style={labelStyle}>页面副标题</label><input type="text" value={globalCfg.tools.gb2760.subtitle} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, gb2760: { ...globalCfg.tools.gb2760, subtitle: e.target.value } } })} style={inputStyle} /></div>
                  <div style={{ marginTop: 8 }}><label style={labelStyle}>免责声明</label><textarea value={globalCfg.tools.gb2760.disclaimer} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, gb2760: { ...globalCfg.tools.gb2760, disclaimer: e.target.value } } })} rows={2} style={inputStyle} /></div>
                </div>
                <div style={{ padding: 12, background: '#F9FAFB', borderRadius: 8 }}>
                  <strong style={{ fontSize: '.85rem' }}>故障排查矩阵页</strong>
                  <div style={{ marginTop: 8 }}><label style={labelStyle}>页面标题</label><input type="text" value={globalCfg.tools.troubleshoot.title} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, troubleshoot: { ...globalCfg.tools.troubleshoot, title: e.target.value } } })} style={inputStyle} /></div>
                  <div style={{ marginTop: 8 }}><label style={labelStyle}>页面副标题</label><input type="text" value={globalCfg.tools.troubleshoot.subtitle} onChange={e => setGlobalCfg({ ...globalCfg, tools: { ...globalCfg.tools, troubleshoot: { ...globalCfg.tools.troubleshoot, subtitle: e.target.value } } })} style={inputStyle} /></div>
                </div>
              </div>

              {/* 预约页 + 预约详情 */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>📅 预约页 & 预约详情页</h3>
                <div style={{ padding: 12, background: '#F9FAFB', borderRadius: 8, marginBottom: 12 }}>
                  <strong style={{ fontSize: '.85rem' }}>预约页</strong>
                  <div style={{ marginTop: 8 }}><label style={labelStyle}>标题</label><input type="text" value={globalCfg.booking.title} onChange={e => setGlobalCfg({ ...globalCfg, booking: { ...globalCfg.booking, title: e.target.value } })} style={inputStyle} /></div>
                  <div style={{ marginTop: 8 }}><label style={labelStyle}>副标题</label><input type="text" value={globalCfg.booking.subtitle} onChange={e => setGlobalCfg({ ...globalCfg, booking: { ...globalCfg.booking, subtitle: e.target.value } })} style={inputStyle} /></div>
                </div>
                <div style={{ padding: 12, background: '#F9FAFB', borderRadius: 8 }}>
                  <strong style={{ fontSize: '.85rem' }}>预约详情页</strong>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                    <div><label style={labelStyle}>返回按钮</label><input type="text" value={globalCfg.bookingDetail.backBtn} onChange={e => setGlobalCfg({ ...globalCfg, bookingDetail: { ...globalCfg.bookingDetail, backBtn: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>页面标题</label><input type="text" value={globalCfg.bookingDetail.title} onChange={e => setGlobalCfg({ ...globalCfg, bookingDetail: { ...globalCfg.bookingDetail, title: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>需求标签</label><input type="text" value={globalCfg.bookingDetail.requirementLabel} onChange={e => setGlobalCfg({ ...globalCfg, bookingDetail: { ...globalCfg.bookingDetail, requirementLabel: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>备注标签</label><input type="text" value={globalCfg.bookingDetail.adminNoteLabel} onChange={e => setGlobalCfg({ ...globalCfg, bookingDetail: { ...globalCfg.bookingDetail, adminNoteLabel: e.target.value } })} style={inputStyle} /></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 8, marginTop: 8 }}>
                    <div><label style={labelStyle}>待处理</label><input type="text" value={globalCfg.bookingDetail.statusLabels.PENDING} onChange={e => setGlobalCfg({ ...globalCfg, bookingDetail: { ...globalCfg.bookingDetail, statusLabels: { ...globalCfg.bookingDetail.statusLabels, PENDING: e.target.value } } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>已确认</label><input type="text" value={globalCfg.bookingDetail.statusLabels.CONFIRMED} onChange={e => setGlobalCfg({ ...globalCfg, bookingDetail: { ...globalCfg.bookingDetail, statusLabels: { ...globalCfg.bookingDetail.statusLabels, CONFIRMED: e.target.value } } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>执行中</label><input type="text" value={globalCfg.bookingDetail.statusLabels.IN_PROGRESS} onChange={e => setGlobalCfg({ ...globalCfg, bookingDetail: { ...globalCfg.bookingDetail, statusLabels: { ...globalCfg.bookingDetail.statusLabels, IN_PROGRESS: e.target.value } } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>已完成</label><input type="text" value={globalCfg.bookingDetail.statusLabels.COMPLETED} onChange={e => setGlobalCfg({ ...globalCfg, bookingDetail: { ...globalCfg.bookingDetail, statusLabels: { ...globalCfg.bookingDetail.statusLabels, COMPLETED: e.target.value } } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>已取消</label><input type="text" value={globalCfg.bookingDetail.statusLabels.CANCELLED} onChange={e => setGlobalCfg({ ...globalCfg, bookingDetail: { ...globalCfg.bookingDetail, statusLabels: { ...globalCfg.bookingDetail.statusLabels, CANCELLED: e.target.value } } })} style={inputStyle} /></div>
                  </div>
                </div>
              </div>

              {/* 社区页 + 提问页 */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>💬 社区页 & 提问页</h3>
                <div style={{ padding: 12, background: '#F9FAFB', borderRadius: 8, marginBottom: 12 }}>
                  <strong style={{ fontSize: '.85rem' }}>社区页</strong>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                    <div><label style={labelStyle}>徽章标签</label><input type="text" value={globalCfg.community.headerBadge} onChange={e => setGlobalCfg({ ...globalCfg, community: { ...globalCfg.community, headerBadge: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>提问按钮</label><input type="text" value={globalCfg.community.askBtnText} onChange={e => setGlobalCfg({ ...globalCfg, community: { ...globalCfg.community, askBtnText: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>搜索占位</label><input type="text" value={globalCfg.community.searchPlaceholder} onChange={e => setGlobalCfg({ ...globalCfg, community: { ...globalCfg.community, searchPlaceholder: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>搜索按钮</label><input type="text" value={globalCfg.community.searchBtnText} onChange={e => setGlobalCfg({ ...globalCfg, community: { ...globalCfg.community, searchBtnText: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>全部标签</label><input type="text" value={globalCfg.community.allTagText} onChange={e => setGlobalCfg({ ...globalCfg, community: { ...globalCfg.community, allTagText: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>阅读文字</label><input type="text" value={globalCfg.community.readText} onChange={e => setGlobalCfg({ ...globalCfg, community: { ...globalCfg.community, readText: e.target.value } })} style={inputStyle} /></div>
                  </div>
                  <div style={{ marginTop: 8 }}><label style={labelStyle}>页面标题</label><input type="text" value={globalCfg.community.headerTitle} onChange={e => setGlobalCfg({ ...globalCfg, community: { ...globalCfg.community, headerTitle: e.target.value } })} style={inputStyle} /></div>
                  <div style={{ marginTop: 8 }}><label style={labelStyle}>页面描述</label><textarea value={globalCfg.community.headerDesc} onChange={e => setGlobalCfg({ ...globalCfg, community: { ...globalCfg.community, headerDesc: e.target.value } })} rows={2} style={inputStyle} /></div>
                </div>
                <div style={{ padding: 12, background: '#F9FAFB', borderRadius: 8 }}>
                  <strong style={{ fontSize: '.85rem' }}>提问页</strong>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                    <div><label style={labelStyle}>返回按钮</label><input type="text" value={globalCfg.ask.backBtn} onChange={e => setGlobalCfg({ ...globalCfg, ask: { ...globalCfg.ask, backBtn: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>页面标题</label><input type="text" value={globalCfg.ask.title} onChange={e => setGlobalCfg({ ...globalCfg, ask: { ...globalCfg.ask, title: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>提交按钮</label><input type="text" value={globalCfg.ask.submitBtn} onChange={e => setGlobalCfg({ ...globalCfg, ask: { ...globalCfg.ask, submitBtn: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>取消按钮</label><input type="text" value={globalCfg.ask.cancelBtn} onChange={e => setGlobalCfg({ ...globalCfg, ask: { ...globalCfg.ask, cancelBtn: e.target.value } })} style={inputStyle} /></div>
                  </div>
                  <div style={{ marginTop: 8 }}><label style={labelStyle}>页面描述</label><textarea value={globalCfg.ask.desc} onChange={e => setGlobalCfg({ ...globalCfg, ask: { ...globalCfg.ask, desc: e.target.value } })} rows={2} style={inputStyle} /></div>
                </div>
              </div>

              {/* 搜索页 */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>🔍 搜索结果页</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div><label style={labelStyle}>页面标题</label><input type="text" value={globalCfg.search.title} onChange={e => setGlobalCfg({ ...globalCfg, search: { ...globalCfg.search, title: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>结果数前缀</label><input type="text" value={globalCfg.search.resultCountText} onChange={e => setGlobalCfg({ ...globalCfg, search: { ...globalCfg.search, resultCountText: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>空状态图标</label><input type="text" value={globalCfg.search.emptyIcon} onChange={e => setGlobalCfg({ ...globalCfg, search: { ...globalCfg.search, emptyIcon: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>文章区标题</label><input type="text" value={globalCfg.search.articlesHeader} onChange={e => setGlobalCfg({ ...globalCfg, search: { ...globalCfg.search, articlesHeader: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>产品区标题</label><input type="text" value={globalCfg.search.productsHeader} onChange={e => setGlobalCfg({ ...globalCfg, search: { ...globalCfg.search, productsHeader: e.target.value } })} style={inputStyle} /></div>
                </div>
                <div style={{ marginTop: 8 }}><label style={labelStyle}>空状态文字</label><input type="text" value={globalCfg.search.emptyText} onChange={e => setGlobalCfg({ ...globalCfg, search: { ...globalCfg.search, emptyText: e.target.value } })} style={inputStyle} /></div>
              </div>

              {/* 分类页 */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>📂 分类列表页</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <div><label style={labelStyle}>面包屑首页</label><input type="text" value={globalCfg.category.breadcrumbHome} onChange={e => setGlobalCfg({ ...globalCfg, category: { ...globalCfg.category, breadcrumbHome: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>面包屑科学</label><input type="text" value={globalCfg.category.breadcrumbScience} onChange={e => setGlobalCfg({ ...globalCfg, category: { ...globalCfg.category, breadcrumbScience: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>导航标题</label><input type="text" value={globalCfg.category.navTitle} onChange={e => setGlobalCfg({ ...globalCfg, category: { ...globalCfg.category, navTitle: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>阅读文字</label><input type="text" value={globalCfg.category.readText} onChange={e => setGlobalCfg({ ...globalCfg, category: { ...globalCfg.category, readText: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>文章数前缀</label><input type="text" value={globalCfg.category.postCountText} onChange={e => setGlobalCfg({ ...globalCfg, category: { ...globalCfg.category, postCountText: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>不存在标题</label><input type="text" value={globalCfg.category.notFoundTitle} onChange={e => setGlobalCfg({ ...globalCfg, category: { ...globalCfg.category, notFoundTitle: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>空状态标题</label><input type="text" value={globalCfg.category.emptyTitle} onChange={e => setGlobalCfg({ ...globalCfg, category: { ...globalCfg.category, emptyTitle: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>空状态描述</label><input type="text" value={globalCfg.category.emptyDesc} onChange={e => setGlobalCfg({ ...globalCfg, category: { ...globalCfg.category, emptyDesc: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>空状态CTA</label><input type="text" value={globalCfg.category.emptyCta} onChange={e => setGlobalCfg({ ...globalCfg, category: { ...globalCfg.category, emptyCta: e.target.value } })} style={inputStyle} /></div>
                </div>
              </div>

              {/* 文章页 & 产品页 */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>📄 文章详情页 & 产品详情页</h3>
                <div style={{ padding: 12, background: '#F9FAFB', borderRadius: 8, marginBottom: 12 }}>
                  <strong style={{ fontSize: '.85rem' }}>文章详情页</strong>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                    <div><label style={labelStyle}>面包屑首页</label><input type="text" value={globalCfg.article.breadcrumbHome} onChange={e => setGlobalCfg({ ...globalCfg, article: { ...globalCfg.article, breadcrumbHome: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>阅读文字</label><input type="text" value={globalCfg.article.readText} onChange={e => setGlobalCfg({ ...globalCfg, article: { ...globalCfg.article, readText: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>帮助提示</label><input type="text" value={globalCfg.article.helpfulText} onChange={e => setGlobalCfg({ ...globalCfg, article: { ...globalCfg.article, helpfulText: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>CTA按钮</label><input type="text" value={globalCfg.article.ctaBtn} onChange={e => setGlobalCfg({ ...globalCfg, article: { ...globalCfg.article, ctaBtn: e.target.value } })} style={inputStyle} /></div>
                  </div>
                </div>
                <div style={{ padding: 12, background: '#F9FAFB', borderRadius: 8 }}>
                  <strong style={{ fontSize: '.85rem' }}>产品详情页</strong>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                    <div><label style={labelStyle}>返回按钮</label><input type="text" value={globalCfg.product.backBtn} onChange={e => setGlobalCfg({ ...globalCfg, product: { ...globalCfg.product, backBtn: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>关键难点</label><input type="text" value={globalCfg.product.keyDifficulty} onChange={e => setGlobalCfg({ ...globalCfg, product: { ...globalCfg.product, keyDifficulty: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>推荐徽章</label><input type="text" value={globalCfg.product.featuredBadge} onChange={e => setGlobalCfg({ ...globalCfg, product: { ...globalCfg.product, featuredBadge: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>概述标题</label><input type="text" value={globalCfg.product.summaryTitle} onChange={e => setGlobalCfg({ ...globalCfg, product: { ...globalCfg.product, summaryTitle: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>报告标题</label><input type="text" value={globalCfg.product.reportTitle} onChange={e => setGlobalCfg({ ...globalCfg, product: { ...globalCfg.product, reportTitle: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>报告链接</label><input type="text" value={globalCfg.product.reportLink} onChange={e => setGlobalCfg({ ...globalCfg, product: { ...globalCfg.product, reportLink: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>预约按钮</label><input type="text" value={globalCfg.product.bookBtn} onChange={e => setGlobalCfg({ ...globalCfg, product: { ...globalCfg.product, bookBtn: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>发布前缀</label><input type="text" value={globalCfg.product.publishText} onChange={e => setGlobalCfg({ ...globalCfg, product: { ...globalCfg.product, publishText: e.target.value } })} style={inputStyle} /></div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Sub-tab: Homepage Detail */}
          {globalSubTab === 'homepage-detail' && (
            <>
              {/* 首页工具卡片 */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>🔧 首页工具卡片配置</h3>
                {globalCfg.homepage.toolCards.map((card, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr auto', gap: 8, marginBottom: 8, padding: 8, background: '#F9FAFB', borderRadius: 8 }}>
                    <input type="text" value={card.icon} onChange={e => { const arr = [...globalCfg.homepage.toolCards]; arr[i] = { ...card, icon: e.target.value }; setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, toolCards: arr } }); }} placeholder="图标" style={{ ...inputStyle, textAlign: 'center' }} />
                    <input type="text" value={card.title} onChange={e => { const arr = [...globalCfg.homepage.toolCards]; arr[i] = { ...card, title: e.target.value }; setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, toolCards: arr } }); }} placeholder="标题" style={inputStyle} />
                    <input type="text" value={card.desc} onChange={e => { const arr = [...globalCfg.homepage.toolCards]; arr[i] = { ...card, desc: e.target.value }; setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, toolCards: arr } }); }} placeholder="描述" style={inputStyle} />
                    <button onClick={() => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, toolCards: globalCfg.homepage.toolCards.filter((_, j) => j !== i) } })} style={btnDelStyle}>删</button>
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                  <div><label style={labelStyle}>讨论条文字</label><input type="text" value={globalCfg.homepage.discussionBarText} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, discussionBarText: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>讨论条按钮</label><input type="text" value={globalCfg.homepage.discussionBarCta} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, discussionBarCta: e.target.value } })} style={inputStyle} /></div>
                </div>
              </div>

              {/* 首页中试板块 */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>🏭 首页中试板块</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div><label style={labelStyle}>中试卡片标题</label><input type="text" value={globalCfg.homepage.pilotCardTitle} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, pilotCardTitle: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>中试卡片副标题</label><input type="text" value={globalCfg.homepage.pilotCardSubtitle} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, pilotCardSubtitle: e.target.value } })} style={inputStyle} /></div>
                </div>
                <div style={{ marginBottom: 12 }}><label style={labelStyle}>中试CTA按钮文字</label><input type="text" value={globalCfg.homepage.pilotBtnText} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, pilotBtnText: e.target.value } })} style={inputStyle} /></div>
                <div style={{ padding: 12, background: '#F9FAFB', borderRadius: 8 }}>
                  <strong style={{ fontSize: '.85rem' }}>远程协同研发舱</strong>
                  <div style={{ marginTop: 8 }}><label style={labelStyle}>舱标题</label><input type="text" value={globalCfg.homepage.pilotDemo.title} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, pilotDemo: { ...globalCfg.homepage.pilotDemo, title: e.target.value } } })} style={inputStyle} /></div>
                  <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div><label style={labelStyle}>实验标签</label><input type="text" value={globalCfg.homepage.pilotDemo.liveLabel} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, pilotDemo: { ...globalCfg.homepage.pilotDemo, liveLabel: e.target.value } } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>位置标签</label><input type="text" value={globalCfg.homepage.pilotDemo.liveLocation} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, pilotDemo: { ...globalCfg.homepage.pilotDemo, liveLocation: e.target.value } } })} style={inputStyle} /></div>
                  </div>
                  <div style={{ marginTop: 8 }}><label style={labelStyle}>聊天文字</label><textarea value={globalCfg.homepage.pilotDemo.chatText} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, pilotDemo: { ...globalCfg.homepage.pilotDemo, chatText: e.target.value } } })} rows={2} style={inputStyle} /></div>
                  <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div><label style={labelStyle}>LIVE标签</label><input type="text" value={globalCfg.homepage.liveBadge} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, liveBadge: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>查看全部前缀</label><input type="text" value={globalCfg.homepage.viewAllInstitutions} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, viewAllInstitutions: e.target.value } })} style={inputStyle} /></div>
                  </div>
                  <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
                    <div><label style={labelStyle}>真空度标签</label><input type="text" value={globalCfg.homepage.dataPanelLabels.vacuum} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, dataPanelLabels: { ...globalCfg.homepage.dataPanelLabels, vacuum: e.target.value } } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>料温标签</label><input type="text" value={globalCfg.homepage.dataPanelLabels.temp} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, dataPanelLabels: { ...globalCfg.homepage.dataPanelLabels, temp: e.target.value } } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>转速标签</label><input type="text" value={globalCfg.homepage.dataPanelLabels.speed} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, dataPanelLabels: { ...globalCfg.homepage.dataPanelLabels, speed: e.target.value } } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>运行时间标签</label><input type="text" value={globalCfg.homepage.dataPanelLabels.runtime} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, dataPanelLabels: { ...globalCfg.homepage.dataPanelLabels, runtime: e.target.value } } })} style={inputStyle} /></div>
                  </div>
                  <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
                    <div><label style={labelStyle}>真空度值</label><input type="text" value={globalCfg.homepage.dataPanelValues.vacuum} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, dataPanelValues: { ...globalCfg.homepage.dataPanelValues, vacuum: e.target.value } } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>料温值</label><input type="text" value={globalCfg.homepage.dataPanelValues.temp} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, dataPanelValues: { ...globalCfg.homepage.dataPanelValues, temp: e.target.value } } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>转速值</label><input type="text" value={globalCfg.homepage.dataPanelValues.speed} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, dataPanelValues: { ...globalCfg.homepage.dataPanelValues, speed: e.target.value } } })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>运行时间值</label><input type="text" value={globalCfg.homepage.dataPanelValues.runtime} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, dataPanelValues: { ...globalCfg.homepage.dataPanelValues, runtime: e.target.value } } })} style={inputStyle} /></div>
                  </div>
                </div>
              </div>

              {/* 首页社区板块 */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>💬 首页社区板块</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                  <div><label style={labelStyle}>提问按钮</label><input type="text" value={globalCfg.homepage.askNowBtn} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, askNowBtn: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>浏览按钮</label><input type="text" value={globalCfg.homepage.browseAllBtn} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, browseAllBtn: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>核心功能徽章</label><input type="text" value={globalCfg.homepage.coreFeatureBadge} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, coreFeatureBadge: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>工具箱标题</label><input type="text" value={globalCfg.homepage.toolboxTitle} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, toolboxTitle: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>品类导航标题</label><input type="text" value={globalCfg.homepage.categoryNavTitle} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, categoryNavTitle: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>关键难点</label><input type="text" value={globalCfg.homepage.keyDifficulty} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, keyDifficulty: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>逆向报告链接</label><input type="text" value={globalCfg.homepage.reverseReportLink} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, reverseReportLink: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>有档期</label><input type="text" value={globalCfg.homepage.availableText} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, availableText: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>需预约</label><input type="text" value={globalCfg.homepage.bookedText} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, bookedText: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>篇长文</label><input type="text" value={globalCfg.homepage.postCountText} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, postCountText: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>个品类</label><input type="text" value={globalCfg.homepage.categoryCountText} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, categoryCountText: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>技术前沿</label><input type="text" value={globalCfg.homepage.techFrontierText} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, techFrontierText: e.target.value } })} style={inputStyle} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                  <div><label style={labelStyle}>社区CTA</label><input type="text" value={globalCfg.homepage.communityCardCtas.community} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, communityCardCtas: { ...globalCfg.homepage.communityCardCtas, community: e.target.value } } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>群CTA</label><input type="text" value={globalCfg.homepage.communityCardCtas.footer} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, communityCardCtas: { ...globalCfg.homepage.communityCardCtas, footer: e.target.value } } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>文章CTA</label><input type="text" value={globalCfg.homepage.communityCardCtas.articles} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, communityCardCtas: { ...globalCfg.homepage.communityCardCtas, articles: e.target.value } } })} style={inputStyle} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div><label style={labelStyle}>无文章提示</label><input type="text" value={globalCfg.homepage.noPostsText} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, noPostsText: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>无文章CTA</label><input type="text" value={globalCfg.homepage.noPostsCta} onChange={e => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, noPostsCta: e.target.value } })} style={inputStyle} /></div>
                </div>
              </div>

              {/* 首页社区卡片 */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>💬 首页社区板块卡片</h3>
                {globalCfg.homepage.communityCards.map((card, i) => (
                  <div key={i} style={{ marginBottom: 12, padding: 12, background: '#F9FAFB', borderRadius: 8 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr auto', gap: 8 }}>
                      <input type="text" value={card.icon} onChange={e => { const arr = [...globalCfg.homepage.communityCards]; arr[i] = { ...card, icon: e.target.value }; setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, communityCards: arr } }); }} placeholder="图标" style={{ ...inputStyle, textAlign: 'center' }} />
                      <input type="text" value={card.title} onChange={e => { const arr = [...globalCfg.homepage.communityCards]; arr[i] = { ...card, title: e.target.value }; setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, communityCards: arr } }); }} placeholder="标题" style={inputStyle} />
                      <input type="text" value={card.link} onChange={e => { const arr = [...globalCfg.homepage.communityCards]; arr[i] = { ...card, link: e.target.value }; setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, communityCards: arr } }); }} placeholder="链接" style={inputStyle} />
                      <button onClick={() => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, communityCards: globalCfg.homepage.communityCards.filter((_, j) => j !== i) } })} style={btnDelStyle}>删</button>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <textarea value={card.desc} onChange={e => { const arr = [...globalCfg.homepage.communityCards]; arr[i] = { ...card, desc: e.target.value }; setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, communityCards: arr } }); }} placeholder="描述" rows={2} style={inputStyle} />
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <input type="text" value={card.tags.join(', ')} onChange={e => { const arr = [...globalCfg.homepage.communityCards]; arr[i] = { ...card, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }; setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, communityCards: arr } }); }} placeholder="标签（逗号分隔，留空则显示文章数和品类数）" style={inputStyle} />
                    </div>
                  </div>
                ))}
                <button onClick={() => setGlobalCfg({ ...globalCfg, homepage: { ...globalCfg.homepage, communityCards: [...globalCfg.homepage.communityCards, { icon: '🆕', title: '新卡片', desc: '描述内容', tags: [], link: '/' }] } })} style={btnAddStyle}>＋ 添加社区卡片</button>
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button onClick={saveGlobal} disabled={saving} style={btnSaveStyle}>{saving ? '保存中...' : '💾 保存全站配置'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
