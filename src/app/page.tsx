import { prisma } from '@/lib/prisma';
import { safeFindPilotLines } from '@/lib/safeQuery';
import { getSiteGlobalConfig } from '@/lib/siteConfig';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePageCarousel from '@/components/HomePageCarousel';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featuredPosts, allPosts, categories, products, carouselSetting, industrySetting, footerSetting, pilotSetting, sectionsSetting, reverseSetting] = await Promise.all([
    prisma.post.findMany({ where: { status: 'PUBLISHED', featured: true }, include: { category: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.post.findMany({ where: { status: 'PUBLISHED' }, include: { category: true }, orderBy: { createdAt: 'desc' }, take: 6 }),
    prisma.category.findMany({ orderBy: { order: 'asc' }, include: { _count: { select: { posts: true } } } }),
    prisma.product.findMany({ where: { status: 'PUBLISHED' }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] }),
    prisma.setting.findUnique({ where: { key: 'homepage_carousel' } }),
    prisma.setting.findUnique({ where: { key: 'homepage_industry' } }),
    prisma.setting.findUnique({ where: { key: 'homepage_footer' } }),
    prisma.setting.findUnique({ where: { key: 'homepage_pilot' } }),
    prisma.setting.findUnique({ where: { key: 'homepage_sections' } }),
    prisma.setting.findUnique({ where: { key: 'homepage_reverse' } }),
  ]);
  // Safe PilotLine query (may fallback to SELECT * if DB not migrated yet)
  const pilotLines = await safeFindPilotLines('desc');

  // Fetch global site config
  const globalConfig = await getSiteGlobalConfig();
  const hpConfig = globalConfig.homepage;

  // Parse carousel settings, fallback to defaults
  let carouselItems: any[] = [];
  try {
    carouselItems = carouselSetting ? JSON.parse(carouselSetting.value) : [];
  } catch { carouselItems = []; }
  if (carouselItems.length === 0) {
    carouselItems = [
      { tag: '商超爆款逆向工程', title: '山姆某款爆汁脆皮肠', desc: '从"货架到车间"的工业化落地工艺参数拆解，涵盖原料配比、灌装工艺、蒸煮曲线全流程', bg: 'carousel-bg-1', btn: '点击查看工艺说明书及基础配方', link: products[0] ? `/product/${products[0].id}` : '/#reverse' },
      { tag: '中试产线动态', title: '华南区液氮速冻隧道产线开放预约', desc: '-196液氮速冻隧道，适用于预制菜速冻工艺验证，本周新增3个档期，先到先得', bg: 'carousel-bg-3', btn: '立即查看档期并预约', link: '/booking' },
    ];
  }
  // Carousel items are fully CMS-managed — no hardcoded additions or modifications

  // Split posts for different sections
  const sciencePosts = allPosts.slice(0, 3);
  const industryPosts = allPosts.slice(3, 6);

  // Parse industry settings, fallback to defaults
  let industryItems: any[] = [];
  try {
    industryItems = industrySetting ? JSON.parse(industrySetting.value) : [];
  } catch { industryItems = []; }
  if (industryItems.length === 0) {
    industryItems = [
      { icon: '⚙️', tag: '机械选型', tagBg: '#DBEAFE', tagColor: '#1E40AF', title: '汇川/西门子 PLC 控制系统在现代化高速斩拌机中的温度精准控制实践', desc: '对比汇川H3U系列与西门子S7-1200在高速斩拌机（6000rpm）刀盘温度闭环控制中的响应精度与稳定性表现，涵盖PID参数整定方法、斩拌过程中的冰屑添加策略。', link: '/search?q=PLC斩拌机' },
      { icon: '📦', tag: '包装创新', tagBg: '#D1FAE5', tagColor: '#065F46', title: '莫迪维克（Multivac）高阻隔气调包装对低温冷鲜肉货架期延长突破', desc: '基于Multivac R245封口机平台，测试70%O₂+30%CO₂气调配比下，不同阻隔膜对低温冷鲜猪肉货架期的影响。7层共挤膜可将货架期从12天延长至21天。', link: '/search?q=气调包装' },
    ];
  }

  // Parse footer community groups
  let footerGroups: { icon: string; name: string; qrcode?: string }[] = [];
  let footerTitle = '📱 加入肉品工程师日常技术互助群（微信私域沉淀）';
  try {
    if (footerSetting) {
      const fc = JSON.parse(footerSetting.value);
      footerTitle = fc.title || footerTitle;
      footerGroups = fc.groups || [];
    }
  } catch { /* defaults */ }
  if (footerGroups.length === 0) {
    footerGroups = [
      { icon: '🍖', name: '中式酱卤交流群', qrcode: '' },
      { icon: '🥓', name: '西式低温技术群', qrcode: '' },
      { icon: '🍱', name: '肉品预制菜研发群', qrcode: '' },
    ];
  }

  // Parse pilot center settings (CMS-managed)
  let pilotConfig: {
    slogan: string;
    title: string;
    subtitle: string;
    cooperationModels: { icon: string; title: string; desc: string; bg: string; borderColor: string; color: string }[];
  } = {
    slogan: '💡 核心创新板块',
    title: '柔性中试中心 —— 在线预约你的肉品工业实验室',
    subtitle: '无需买设备，盘活全行业闲置产能，打造肉类行业的"药明康德（CRO）"',
    cooperationModels: [
      { icon: '🎓', title: '找专家、做大改动', desc: '引流到高校科研院所，走CRO高客单价分成模式', bg: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)', borderColor: '#BFDBFE', color: '#1E3A8A' },
      { icon: '🏭', title: '初创品牌、预制菜试错', desc: '推荐到公共中试仓，走标准场租抽佣，政府扶持收费透明', bg: 'linear-gradient(135deg, #D1FAE5 0%, #ECFDF5 100%)', borderColor: '#A7F3D0', color: '#065F46' },
      { icon: '🧪', title: '调风味、做爆款逆向', desc: '撮合到辅料巨头演示中心，辅料带货换取产线开放', bg: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)', borderColor: '#FDE68A', color: '#92400E' },
    ],
  };
  try {
    if (pilotSetting) {
      const pc = JSON.parse(pilotSetting.value);
      pilotConfig = { ...pilotConfig, ...pc };
    }
  } catch { /* defaults */ }

  // Parse homepage section texts (CMS-managed)
  let sectionsConfig: {
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
  } = {
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
  };
  try {
    if (sectionsSetting) {
      const sc = JSON.parse(sectionsSetting.value);
      sectionsConfig = { ...sectionsConfig, ...sc };
    }
  } catch { /* defaults */ }

  // Parse reverse section items (CMS-managed "货架直通车间" cards)
  let reverseItems: { title: string; category: string; difficulty: string; link: string; icon: string; tags?: string }[] = [];
  try {
    if (reverseSetting) {
      reverseItems = JSON.parse(reverseSetting.value);
    }
  } catch { /* defaults */ }

  // Group pilot lines by region for multi-region display
  const regionOrder = ['华南', '华东', '华北', '华中', '西南', '东北', '其他'];
  const linesByRegion: Record<string, typeof pilotLines> = {};
  for (const line of pilotLines) {
    const r = regionOrder.includes(line.region) ? line.region : '其他';
    if (!linesByRegion[r]) linesByRegion[r] = [];
    linesByRegion[r].push(line);
  }
  const activeRegions = regionOrder.filter(r => linesByRegion[r] && linesByRegion[r].length > 0);

  const banners = ['banner-1', 'banner-2', 'banner-3'];
  const bannersMap: Record<string, string> = { '气调预制菜': 'banner-1', '低温调理肉': 'banner-2', '休闲及其他': 'banner-3' };
  const bannerIcons: Record<string, string> = { '气调预制菜': '🍳', '低温调理肉': '🥩', '休闲及其他': '🌶️' };

  return (
    <>
      <Header />
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero-inner">
            {/* Unified header: badge + slogan + CTA */}
            <div className="hero-header">
              <span className="hero-badge">{sectionsConfig.heroBadge}</span>
              <h1 className="hero-slogan">{sectionsConfig.heroSlogan}</h1>
              <p className="hero-sub">{sectionsConfig.heroSub}</p>
              <div className="hero-cta-row">
                <Link href="/community" className="hero-cta hero-cta-primary">{sectionsConfig.heroCtaPrimary}</Link>
                <Link href="/booking" className="hero-cta hero-cta-secondary">{sectionsConfig.heroCtaSecondary}</Link>
              </div>
            </div>
            {/* Full-width carousel */}
            <HomePageCarousel items={carouselItems} />
            {/* Tools row — 3 columns horizontal (CMS-managed) */}
            <div className="hero-tools-row">
              {hpConfig.toolCards.map((card, i) => (
                <Link key={i} href={card.link} className="tool-card">
                  <div className="tool-icon" style={{ background: card.bg, color: card.color }}>{card.icon}</div>
                  <div className="tool-info"><h4>{card.title}</h4><p>{card.desc}</p></div>
                </Link>
              ))}
            </div>
            {/* Discussion bar - prominent entry to community */}
            <Link href="/community" className="hero-discussion-bar">
              <span className="pulse-dot"></span>
              <span style={{ fontSize: '.88rem', fontWeight: 600 }}>{hpConfig.discussionBarText}</span>
              <span style={{ fontSize: '.82rem', opacity: .75, marginLeft: 'auto' }}>{hpConfig.discussionBarCta}</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding" id="reverse" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-header">
            <span style={{ fontSize: '1.5rem' }}>{sectionsConfig.reverseIcon}</span>
            <h2 className="section-title">{sectionsConfig.reverseTitle}</h2>
            <span className="section-badge">{sectionsConfig.reverseBadge}</span>
          </div>
          <p className="section-intro">{sectionsConfig.reverseIntro}</p>
          <div className="reverse-grid">
            {/* CMS-managed custom items first */}
            {reverseItems.map((item, i) => (
              <Link key={`rev-cms-${i}`} href={item.link || '/#reverse'} className="reverse-card">
                <div className={`reverse-card-banner ${banners[i % 3]}`}>
                  <span className="cat-tag">{item.category}</span>
                  {item.icon || '🍖'}
                </div>
                <div className="reverse-card-body">
                  <h4>{item.title}</h4>
                  <div className="difficulty-box">
                    <div className="label">{hpConfig.keyDifficulty}</div>
                    <div className="text">{item.difficulty}</div>
                  </div>
                  <span style={{ color: '#1E3A8A', fontSize: '.88rem', fontWeight: 600, borderBottom: '2px solid transparent' }}>{hpConfig.reverseReportLink}</span>
                </div>
              </Link>
            ))}
            {/* Then product database items */}
            {products.map((p, i) => (
              <Link key={p.id} href={`/product/${p.id}`} className="reverse-card">
                <div className={`reverse-card-banner ${bannersMap[p.category] || banners[i % 3]}`}>
                  <span className="cat-tag">{p.category}</span>
                  {bannerIcons[p.category] || '🍖'}
                </div>
                <div className="reverse-card-body">
                  <h4>{p.title}</h4>
                  <div className="difficulty-box">
                    <div className="label">{hpConfig.keyDifficulty}</div>
                    <div className="text">{p.difficulty}</div>
                  </div>
                  <span style={{ color: '#1E3A8A', fontSize: '.88rem', fontWeight: 600, borderBottom: '2px solid transparent' }}>{hpConfig.reverseReportLink}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding" id="science" style={{ background: '#F3F4F6' }}>
        <div className="container">
          <div className="section-header">
            <span style={{ fontSize: '1.5rem' }}>{sectionsConfig.scienceIcon}</span>
            <h2 className="section-title">{sectionsConfig.scienceTitle}</h2>
            <span className="section-badge">{sectionsConfig.scienceBadge}</span>
          </div>
          <p className="section-intro">{sectionsConfig.scienceIntro}</p>
          <div className="science-layout">
            <div className="category-tree">
              <h4 style={{ fontSize: '.9rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>{hpConfig.categoryNavTitle}</h4>
              {categories.map((cat) => (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="tree-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <span style={{ fontSize: '1.1rem' }}>{cat.icon === 'folder' ? '📂' : cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className="count">{cat._count.posts}</span>
                </Link>
              ))}
            </div>
            <div className="science-articles">
              {sciencePosts.length > 0 ? sciencePosts.map((post) => (
                <Link href={`/article/${post.slug}`} key={post.id} className="science-article-card">
                  <div className="article-header">
                    <span className={`tag ${post.tags.includes('故障') ? 'red' : ''}`}>{post.tags.split(',')[0] || '技术专题'}</span>
                    <span style={{ fontSize: '.8rem', color: '#9CA3AF' }}>{hpConfig.techFrontierText}</span>
                  </div>
                  <div className="article-body">
                    <h4>《{post.title}》</h4>
                    <p>{post.excerpt}</p>
                    <div className="article-meta">
                      <span>👨‍🔬 {post.author}</span>
                      <span>📅 {new Date(post.createdAt).toISOString().slice(0, 10)}</span>
                      <span>👁️ {post.views.toLocaleString()} 阅读</span>
                    </div>
                  </div>
                </Link>
              )) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
                  <p style={{ fontSize: '1rem', marginBottom: '12px' }}>{hpConfig.noPostsText}</p>
                  <Link href="/admin/posts/new" style={{ color: '#1E3A8A', fontSize: '.9rem', fontWeight: 600 }}>{hpConfig.noPostsCta}</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pilot section-padding" id="pilot">
        <div className="container">
          <div className="pilot-header">
            <span className="slogan">{pilotConfig.slogan}</span>
            <h2 className="pilot-title">{pilotConfig.title}</h2>
            <p className="pilot-sub">{pilotConfig.subtitle}</p>
          </div>

          {/* 三类合作模式 (CMS-managed) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            {pilotConfig.cooperationModels.map((model, i) => (
              <Link key={i} href="/tool/pilot-map" style={{ background: model.bg, borderRadius: 12, padding: 24, textDecoration: 'none', border: `1px solid ${model.borderColor}`, transition: 'transform .2s' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>{model.icon}</div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: model.color, marginBottom: 6 }}>{model.title}</h4>
                <p style={{ fontSize: '.82rem', color: '#374151', lineHeight: 1.5, margin: 0 }}>{model.desc}</p>
              </Link>
            ))}
          </div>

          {/* Multi-region pilot lines display */}
          <div className="pilot-grid">
            <div className="pilot-card">
              <h4>{hpConfig.pilotCardTitle}（{activeRegions.length}个区域）</h4>
              <p style={{ fontSize: '.82rem', opacity: .7, marginBottom: '16px' }}>{hpConfig.pilotCardSubtitle}</p>
              <div className="line-list">
                {pilotLines.slice(0, 8).map((line) => (
                  <Link key={line.id} href={`/booking/${line.id}`} className="line-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="line-info">
                      <span className="line-region">
                        {line.type === 'UNIVERSITY' ? '🎓' : line.type === 'PARK' ? '🏭' : line.type === 'ENTERPRISE' ? '🧪' : '📍'} {line.region}
                      </span>
                      <span className="line-name">{line.name.length > 20 ? line.name.slice(0, 20) + '...' : line.name}</span>
                    </div>
                    <span className={`line-status ${line.status === 'AVAILABLE' ? 'available' : 'booked'}`}>
                      ● {line.status === 'AVAILABLE' ? hpConfig.availableText : hpConfig.bookedText}
                    </span>
                  </Link>
                ))}
              </div>
              <Link href="/tool/pilot-map" style={{ display: 'block', textAlign: 'center', marginTop: 12, padding: '8px 0', background: 'rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', fontSize: '.85rem', fontWeight: 600, textDecoration: 'none' }}>
                {hpConfig.viewAllInstitutions} {pilotLines.length} 家机构 →
              </Link>
            </div>
            <div className="pilot-card">
              <h4>{hpConfig.pilotDemo.title}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="remote-video">
                  <div className="live-badge"><span className="pulse"></span>{hpConfig.liveBadge}</div>
                  <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '.95rem', fontWeight: 600, marginBottom: '6px' }}>{hpConfig.pilotDemo.liveLabel}</div>
                    <div style={{ fontSize: '.8rem', opacity: .7 }}>{hpConfig.pilotDemo.liveLocation}</div>
                  </div>
                </div>
                <div className="data-panel">
                  <div className="data-item"><span className="label">{hpConfig.dataPanelLabels.vacuum}</span><span className="value">{hpConfig.dataPanelValues.vacuum}</span></div>
                  <div className="data-item"><span className="label">{hpConfig.dataPanelLabels.temp}</span><span className="value">{hpConfig.dataPanelValues.temp}</span></div>
                  <div className="data-item"><span className="label">{hpConfig.dataPanelLabels.speed}</span><span className="value">{hpConfig.dataPanelValues.speed}</span></div>
                  <div className="data-item"><span className="label">{hpConfig.dataPanelLabels.runtime}</span><span className="value">{hpConfig.dataPanelValues.runtime}</span></div>
                </div>
                <div className="chat-box">
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', flexShrink: 0 }}>💬</div>
                  <div style={{ opacity: .9, lineHeight: 1.5 }}><strong style={{ color: '#FCD34D' }}>{hpConfig.pilotDemo.chatText.split('：')[0]}：</strong>{hpConfig.pilotDemo.chatText.split('：').slice(1).join('：')}</div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/booking" className="btn-book" style={{ display: 'inline-flex' }}>{hpConfig.pilotBtnText}</Link>
          </div>
        </div>
      </section>

      {/* 工艺工程师讨论社区 — 强化突出 */}
      <section className="section-padding" id="community" style={{ background: 'linear-gradient(180deg, #1E3A8A 0%, #1E40AF 100%)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ display: 'inline-block', padding: '4px 16px', borderRadius: 20, background: 'rgba(255,255,255,0.15)', color: '#FCD34D', fontSize: '.85rem', fontWeight: 600, marginBottom: 16 }}>{sectionsConfig.communityBadge}</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: 12 }}>{sectionsConfig.communityTitle}</h2>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', maxWidth: 700, margin: '0 auto' }}>{sectionsConfig.communitySub.replace(/已有.*持续更新中。/, `已有 ${allPosts.length} 篇技术内容沉淀，持续更新中。`)}</p>
          </div>

          {/* 快速提问入口 — 大号CTA */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 40 }}>
            <Link href="/community/ask" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', borderRadius: 28, background: '#FCD34D', color: '#1E3A8A', fontSize: '1rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(252,211,77,0.3)' }}>
              {hpConfig.askNowBtn}
            </Link>
            <Link href="/community" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', borderRadius: 28, background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: '1rem', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
              {hpConfig.browseAllBtn}
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
            {/* Community cards — CMS-managed */}
            {hpConfig.communityCards.map((card, i) => {
              const isHighlight = card.highlight;
              return (
                <Link
                  key={i}
                  href={card.link}
                  style={{
                    background: isHighlight ? 'rgba(252,211,77,0.12)' : 'rgba(255,255,255,0.1)',
                    borderRadius: 16,
                    padding: 28,
                    textDecoration: 'none',
                    border: isHighlight ? '2px solid rgba(252,211,77,0.4)' : '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  {isHighlight ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: '2.5rem' }}>{card.icon}</span>
                      <span style={{ padding: '2px 10px', borderRadius: 12, background: '#FCD34D', color: '#1E3A8A', fontSize: '.72rem', fontWeight: 700 }}>{hpConfig.coreFeatureBadge}</span>
                    </div>
                  ) : (
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{card.icon}</div>
                  )}
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 8 }}>{card.title}</h4>
                  <p style={{ fontSize: '.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 16 }}>{card.desc}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {card.tags && card.tags.length > 0 ? (
                      card.tags.map((tag, ti) => (
                        <span key={ti} style={{ fontSize: '.72rem', padding: '2px 10px', borderRadius: 12, background: isHighlight ? 'rgba(252,211,77,0.2)' : 'rgba(255,255,255,0.12)', color: '#FCD34D' }}>{tag}</span>
                      ))
                    ) : (
                      <>
                        <span style={{ fontSize: '.72rem', padding: '2px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.12)', color: '#FCD34D' }}>{allPosts.length} {hpConfig.postCountText}</span>
                        <span style={{ fontSize: '.72rem', padding: '2px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.12)', color: '#FCD34D' }}>{categories.length} {hpConfig.categoryCountText}</span>
                      </>
                    )}
                  </div>
                  <span style={{ display: 'block', marginTop: 16, color: '#FCD34D', fontSize: '.85rem', fontWeight: 600 }}>
                    {card.link === '/community' ? hpConfig.communityCardCtas.community : card.link === '#footer' ? hpConfig.communityCardCtas.footer : hpConfig.communityCardCtas.articles}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* 工程师工具箱 — CMS-managed tool cards */}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 28, border: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 20, textAlign: 'center' }}>{hpConfig.toolboxTitle}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {hpConfig.toolCards.map((card, i) => (
                <Link key={i} href={card.link} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', textDecoration: 'none' }}>
                  <span style={{ fontSize: '1.5rem' }}>{card.icon}</span>
                  <div>
                    <div style={{ fontSize: '.9rem', fontWeight: 600, color: '#fff' }}>{card.title}</div>
                    <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,0.5)' }}>{card.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" id="industry" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-header">
            <span style={{ fontSize: '1.5rem' }}>{sectionsConfig.industryIcon}</span>
            <h2 className="section-title">{sectionsConfig.industryTitle}</h2>
            <span className="section-badge">{sectionsConfig.industryBadge}</span>
          </div>
          <p className="section-intro">{sectionsConfig.industryIntro}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* CMS-managed articles */}
            {industryPosts.map((post) => (
              <Link href={`/article/${post.slug}`} key={`post-${post.id}`} className="industry-item">
                <div style={{ width: 56, height: 56, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, background: '#DBEAFE', color: '#1E40AF' }}>📄</div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}><span style={{ fontSize: '.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4, marginRight: 8, background: '#DBEAFE', color: '#1E40AF' }}>{post.tags.split(',')[0] || post.category.name}</span>{post.title}</h4>
                  <p style={{ fontSize: '.9rem', color: '#6B7280', lineHeight: 1.6 }}>{post.excerpt}</p>
                </div>
              </Link>
            ))}
            {/* CMS-managed industry items from Setting */}
            {industryItems.map((item, i) => {
              const inner = (
                <>
                  <div style={{ width: 56, height: 56, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, background: item.tagBg, color: item.tagColor }}>{item.icon}</div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}><span style={{ fontSize: '.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4, marginRight: 8, background: item.tagBg, color: item.tagColor }}>{item.tag}</span>{item.title}</h4>
                    <p style={{ fontSize: '.9rem', color: '#6B7280', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </>
              );
              const href = item.link || `/search?q=${encodeURIComponent(item.title)}`;
              return (
                <Link key={`ind-${i}`} href={href} className="industry-item">{inner}</Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
