import { prisma } from '@/lib/prisma';
import { safeFindPilotLines } from '@/lib/safeQuery';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePageCarousel from '@/components/HomePageCarousel';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featuredPosts, allPosts, categories, products, carouselSetting, industrySetting, footerSetting] = await Promise.all([
    prisma.post.findMany({ where: { status: 'PUBLISHED', featured: true }, include: { category: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.post.findMany({ where: { status: 'PUBLISHED' }, include: { category: true }, orderBy: { createdAt: 'desc' }, take: 6 }),
    prisma.category.findMany({ orderBy: { order: 'asc' }, include: { _count: { select: { posts: true } } } }),
    prisma.product.findMany({ where: { status: 'PUBLISHED' }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] }),
    prisma.setting.findUnique({ where: { key: 'homepage_carousel' } }),
    prisma.setting.findUnique({ where: { key: 'homepage_industry' } }),
    prisma.setting.findUnique({ where: { key: 'homepage_footer' } }),
  ]);
  // Safe PilotLine query (may fallback to SELECT * if DB not migrated yet)
  const pilotLines = await safeFindPilotLines('desc');

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
  // Fix known bad carousel links from older seed data
  carouselItems = carouselItems.map((item: any) => {
    if (item.link === '/#reverse' && products[0]) {
      return { ...item, link: `/product/${products[0].id}` };
    }
    if (item.link === '/tool/pilot-map') {
      return { ...item, link: '/booking' };
    }
    return item;
  });
  // Add featured post as carousel item if available
  const carouselPost = featuredPosts[0] || allPosts[0];
  if (carouselPost) {
    carouselItems.splice(1, 0, { tag: '技术前沿', title: carouselPost.title.slice(0, 20) + '...', desc: carouselPost.excerpt.slice(0, 60) + '...', bg: 'carousel-bg-2', btn: '阅读完整技术报告', link: `/article/${carouselPost.slug}` });
  }

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

  const banners = ['banner-1', 'banner-2', 'banner-3'];
  const bannersMap: Record<string, string> = { '气调预制菜': 'banner-1', '低温调理肉': 'banner-2', '休闲及其他': 'banner-3' };
  const bannerIcons: Record<string, string> = { '气调预制菜': '🍳', '低温调理肉': '🥩', '休闲及其他': '🌶️' };

  return (
    <>
      <Header />
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero-top">
            <h1 className="hero-slogan">赋能每一位肉品工艺工程师</h1>
            <p className="hero-sub">—— 从深度技术长文到中试产线预约，从疑难问答到同行交流，全链路服务肉制品研发</p>
          </div>
          <div className="hero-grid">
            <HomePageCarousel items={carouselItems} />
            <div className="tool-box" id="tools">
              <Link href="/tool/gb2760" className="tool-card">
                <div className="tool-icon" style={{ background: '#DBEAFE', color: '#1E3A8A' }}>📊</div>
                <div className="tool-info"><h4>GB 2760 添加剂限量计算器</h4><p>输入添加剂名称，一键合规审查</p></div>
                <span style={{ marginLeft: 'auto', color: '#9CA3AF', fontSize: '1.2rem' }}>›</span>
              </Link>
              <Link href="/tool/troubleshoot" className="tool-card">
                <div className="tool-icon" style={{ background: '#FEE2E2', color: '#991B1B' }}>🚨</div>
                <div className="tool-info"><h4>肉制品车间故障智能排查矩阵</h4><p>解决出水、散肉、色泽不均等顽疾</p></div>
                <span style={{ marginLeft: 'auto', color: '#9CA3AF', fontSize: '1.2rem' }}>›</span>
              </Link>
              <Link href="/tool/pilot-map" className="tool-card">
                <div className="tool-icon" style={{ background: '#D1FAE5', color: '#065F46' }}>🗺️</div>
                <div className="tool-info"><h4>全国肉类共享中试产线地图</h4><p>在线预约闲置产能，轻资产研发</p></div>
                <span style={{ marginLeft: 'auto', color: '#9CA3AF', fontSize: '1.2rem' }}>›</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" id="reverse" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-header">
            <span style={{ fontSize: '1.5rem' }}>📌</span>
            <h2 className="section-title">货架直通车间</h2>
            <span className="section-badge">商超爆款逆向研发</span>
          </div>
          <p className="section-intro">追踪山姆、盒马等零售终端销量走势，逆向拆解工业化量产工艺</p>
          <div className="reverse-grid">
            {products.map((p, i) => (
              <Link key={p.id} href={`/product/${p.id}`} className="reverse-card">
                <div className={`reverse-card-banner ${bannersMap[p.category] || banners[i % 3]}`}>
                  <span className="cat-tag">{p.category}</span>
                  {bannerIcons[p.category] || '🍖'}
                </div>
                <div className="reverse-card-body">
                  <h4>{p.title}</h4>
                  <div className="difficulty-box">
                    <div className="label">⚡ 关键难点</div>
                    <div className="text">{p.difficulty}</div>
                  </div>
                  <span style={{ color: '#1E3A8A', fontSize: '.88rem', fontWeight: 600, borderBottom: '2px solid transparent' }}>查看逆向工艺报告 →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding" id="science" style={{ background: '#F3F4F6' }}>
        <div className="container">
          <div className="section-header">
            <span style={{ fontSize: '1.5rem' }}>🔬</span>
            <h2 className="section-title">硬核肉品科学</h2>
            <span className="section-badge">工业配方重构与故障排查矩阵</span>
          </div>
          <p className="section-intro">深入肉类生物化学底层，解决清洁标签、减盐减硝等现代改性需求</p>
          <div className="science-layout">
            <div className="category-tree">
              <h4 style={{ fontSize: '.9rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>📂 品类导航</h4>
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
                    <span style={{ fontSize: '.8rem', color: '#9CA3AF' }}>技术前沿 · 深度长文</span>
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
                  <p style={{ fontSize: '1rem', marginBottom: '12px' }}>暂无文章，请在后台 CMS 发布文章后显示</p>
                  <Link href="/admin/posts/new" style={{ color: '#1E3A8A', fontSize: '.9rem', fontWeight: 600 }}>去发布文章 →</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pilot section-padding" id="pilot">
        <div className="container">
          <div className="pilot-header">
            <span className="slogan">💡 核心创新板块</span>
            <h2 className="pilot-title">柔性中试中心 —— 在线预约你的肉品工业实验室</h2>
            <p className="pilot-sub">无需买设备，盘活全行业闲置产能，打造肉类行业的"药明康德（CRO）"</p>
          </div>

          {/* 三类合作模式 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            <Link href="/tool/pilot-map" style={{ background: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)', borderRadius: 12, padding: 24, textDecoration: 'none', border: '1px solid #BFDBFE', transition: 'transform .2s' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎓</div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E3A8A', marginBottom: 6 }}>找专家、做大改动</h4>
              <p style={{ fontSize: '.82rem', color: '#374151', lineHeight: 1.5, margin: 0 }}>引流到华南理工、华农、省农科院等高校科研院所，走CRO高客单价分成模式</p>
            </Link>
            <Link href="/tool/pilot-map" style={{ background: 'linear-gradient(135deg, #D1FAE5 0%, #ECFDF5 100%)', borderRadius: 12, padding: 24, textDecoration: 'none', border: '1px solid #A7F3D0', transition: 'transform .2s' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>🏭</div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#065F46', marginBottom: 6 }}>初创品牌、预制菜试错</h4>
              <p style={{ fontSize: '.82rem', color: '#374151', lineHeight: 1.5, margin: 0 }}>推荐到佛山顺德、肇庆高要等公共中试仓，走标准场租抽佣，政府扶持收费透明</p>
            </Link>
            <Link href="/tool/pilot-map" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)', borderRadius: 12, padding: 24, textDecoration: 'none', border: '1px solid #FDE68A', transition: 'transform .2s' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>🧪</div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#92400E', marginBottom: 6 }}>调风味、做爆款逆向</h4>
              <p style={{ fontSize: '.82rem', color: '#374151', lineHeight: 1.5, margin: 0 }}>撮合到IFF、奇华顿、安琪酵母等辅料巨头演示中心，辅料带货换取产线开放</p>
            </Link>
          </div>

          <div className="pilot-grid">
            <div className="pilot-card">
              <h4>🗺️ 华南共享中试基地</h4>
              <p style={{ fontSize: '.82rem', opacity: .7, marginBottom: '16px' }}>粤港澳大湾区 · 三类机构全覆盖</p>
              <div className="line-list">
                {pilotLines.slice(0, 6).map((line) => (
                  <Link key={line.id} href={`/booking/${line.id}`} className="line-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="line-info">
                      <span className="line-region">
                        {line.type === 'UNIVERSITY' ? '🎓' : line.type === 'PARK' ? '🏭' : line.type === 'ENTERPRISE' ? '🧪' : '📍'} {line.region}
                      </span>
                      <span className="line-name">{line.name.length > 20 ? line.name.slice(0, 20) + '...' : line.name}</span>
                    </div>
                    <span className={`line-status ${line.status === 'AVAILABLE' ? 'available' : 'booked'}`}>
                      ● {line.status === 'AVAILABLE' ? '有档期' : '需预约'}
                    </span>
                  </Link>
                ))}
              </div>
              <Link href="/tool/pilot-map" style={{ display: 'block', textAlign: 'center', marginTop: 12, padding: '8px 0', background: 'rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', fontSize: '.85rem', fontWeight: 600, textDecoration: 'none' }}>
                查看全部 {pilotLines.length} 家机构 →
              </Link>
            </div>
            <div className="pilot-card">
              <h4>🎛️ 远程协同研发舱（数据孪生演示）</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="remote-video">
                  <div className="live-badge"><span className="pulse"></span>LIVE</div>
                  <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '.95rem', fontWeight: 600, marginBottom: '6px' }}>正在进行：真空滚揉放大实验</div>
                    <div style={{ fontSize: '.8rem', opacity: .7 }}>华南区·华南理工中试基地</div>
                  </div>
                </div>
                <div className="data-panel">
                  <div className="data-item"><span className="label">真空度</span><span className="value">-0.08 MPa</span></div>
                  <div className="data-item"><span className="label">料温</span><span className="value">4.2℃</span></div>
                  <div className="data-item"><span className="label">转速</span><span className="value">8 rpm</span></div>
                  <div className="data-item"><span className="label">运行时间</span><span className="value">00:42:18</span></div>
                </div>
                <div className="chat-box">
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', flexShrink: 0 }}>💬</div>
                  <div style={{ opacity: .9, lineHeight: 1.5 }}><strong style={{ color: '#FCD34D' }}>远程指挥 · 张总监：</strong>料温已到4℃，开始加胶体，注意控制添加速率在0.5kg/min以内</div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/booking" className="btn-book" style={{ display: 'inline-flex' }}>立即提交您的中试需求，平台专家1对1跟进 →</Link>
          </div>
        </div>
      </section>

      <section className="section-padding" id="industry" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-header">
            <span style={{ fontSize: '1.5rem' }}>⚙️</span>
            <h2 className="section-title">工业4.0</h2>
            <span className="section-badge">设备选型与原辅料应用指南</span>
          </div>
          <p className="section-intro">拒绝硬广告，只看辅料与设备在实际生产中的"应用案例（Case Study）"</p>
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

      {/* 工艺工程师赋能社区 */}
      <section className="section-padding" id="community" style={{ background: 'linear-gradient(180deg, #1E3A8A 0%, #1E40AF 100%)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ display: 'inline-block', padding: '4px 16px', borderRadius: 20, background: 'rgba(255,255,255,0.15)', color: '#FCD34D', fontSize: '.85rem', fontWeight: 600, marginBottom: 16 }}>工程师赋能社区</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: 12 }}>从知识获取到疑难解答，全链路服务肉品工艺工程师</h2>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', maxWidth: 700, margin: '0 auto' }}>无论你是刚入行的工艺新人，还是深耕肉品研发多年的技术总监，在这里都能找到你需要的资源与同行</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
            {/* 技术长文 */}
            <Link href="/category/chinese-braised" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 28, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📚</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 8 }}>深度技术长文</h4>
              <p style={{ fontSize: '.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 16 }}>涵盖原料改性、工艺优化、添加剂应用、故障排查等实战内容。后台随时更新，前沿技术持续沉淀。</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '.72rem', padding: '2px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.12)', color: '#FCD34D' }}>{allPosts.length} 篇长文</span>
                <span style={{ fontSize: '.72rem', padding: '2px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.12)', color: '#FCD34D' }}>{categories.length} 个品类</span>
              </div>
              <span style={{ display: 'block', marginTop: 16, color: '#FCD34D', fontSize: '.85rem', fontWeight: 600 }}>浏览全部技术文章 →</span>
            </Link>

            {/* 疑难问答 */}
            <Link href="/community" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 28, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>💬</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 8 }}>疑难杂症讨论</h4>
              <p style={{ fontSize: '.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 16 }}>出水、散肉、色泽不均、保质期不达标……遇到工艺难题？发帖求助，同行专家来解答。</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '.72rem', padding: '2px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.12)', color: '#FCD34D' }}>在线提问</span>
                <span style={{ fontSize: '.72rem', padding: '2px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.12)', color: '#FCD34D' }}>同行互助</span>
              </div>
              <span style={{ display: 'block', marginTop: 16, color: '#FCD34D', fontSize: '.85rem', fontWeight: 600 }}>进入讨论社区 →</span>
            </Link>

            {/* 微信社群 */}
            <a href="#footer" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 28, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📱</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 8 }}>技术互助社群</h4>
              <p style={{ fontSize: '.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 16 }}>{footerTitle.replace('📱 ', '')}，按品类分群，日常技术互助，私域深度沉淀。</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {footerGroups.slice(0, 3).map((g, i) => (
                  <span key={i} style={{ fontSize: '.72rem', padding: '2px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.12)', color: '#FCD34D' }}>{g.icon} {g.name}</span>
                ))}
              </div>
              <span style={{ display: 'block', marginTop: 16, color: '#FCD34D', fontSize: '.85rem', fontWeight: 600 }}>扫码加入交流群 ↓</span>
            </a>
          </div>

          {/* 工程师工具箱 */}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 28, border: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 20, textAlign: 'center' }}>工程师实战工具箱</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <Link href="/tool/gb2760" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', textDecoration: 'none' }}>
                <span style={{ fontSize: '1.5rem' }}>📊</span>
                <div>
                  <div style={{ fontSize: '.9rem', fontWeight: 600, color: '#fff' }}>GB 2760 添加剂计算器</div>
                  <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,0.5)' }}>一键合规审查</div>
                </div>
              </Link>
              <Link href="/tool/troubleshoot" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', textDecoration: 'none' }}>
                <span style={{ fontSize: '1.5rem' }}>🚨</span>
                <div>
                  <div style={{ fontSize: '.9rem', fontWeight: 600, color: '#fff' }}>故障智能排查矩阵</div>
                  <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,0.5)' }}>出水散肉一键诊断</div>
                </div>
              </Link>
              <Link href="/tool/pilot-map" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', textDecoration: 'none' }}>
                <span style={{ fontSize: '1.5rem' }}>🗺️</span>
                <div>
                  <div style={{ fontSize: '.9rem', fontWeight: 600, color: '#fff' }}>中试产线地图</div>
                  <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,0.5)' }}>在线预约闲置产能</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
