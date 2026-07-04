import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featuredPosts, categories, products, pilotLines] = await Promise.all([
    prisma.post.findMany({ where: { status: 'PUBLISHED', featured: true }, include: { category: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.category.findMany({ orderBy: { order: 'asc' }, include: { _count: { select: { posts: true } } } }),
    prisma.product.findMany({ where: { status: 'PUBLISHED' }, orderBy: { createdAt: 'desc' } }),
    prisma.pilotLine.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  const carouselItems = [
    { tag: '商超爆款逆向工程', title: '山姆某款爆汁脆皮肠', desc: '从"货架到车间"的工业化落地工艺参数拆解，涵盖原料配比、灌装工艺、蒸煮曲线全流程', bg: 'carousel-bg-1', btn: '点击查看工艺说明书及基础配方' },
    ...(featuredPosts[0] ? [{ tag: '技术前沿', title: featuredPosts[0].title.slice(0, 20) + '...', desc: featuredPosts[0].excerpt.slice(0, 60) + '...', bg: 'carousel-bg-2', btn: '阅读完整技术报告' }] : []),
    { tag: '中试产线动态', title: '华南区液氮速冻隧道产线开放预约', desc: '-196液氮速冻隧道，适用于预制菜速冻工艺验证，本周新增3个档期，先到先得', bg: 'carousel-bg-3', btn: '立即查看档期并预约' },
  ];

  const banners = ['banner-1', 'banner-2', 'banner-3'];
  const bannersMap: Record<string, string> = { '气调预制菜': 'banner-1', '低温调理肉': 'banner-2', '休闲及其他': 'banner-3' };
  const bannerIcons: Record<string, string> = { '气调预制菜': '🍳', '低温调理肉': '🥩', '休闲及其他': '🌶️' };

  return (
    <>
      <Header />
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero-top">
            <h1 className="hero-slogan">让每一公斤肉发挥最大价值</h1>
            <p className="hero-sub">—— 工业化肉制品研发与智能中试平台</p>
          </div>
          <div className="hero-grid">
            <div className="carousel-slides" id="carousel">
              {carouselItems.map((item, i) => (
                <div key={i} className={`carousel-slide ${i === 0 ? 'active' : ''}`}>
                  <div className={`carousel-bg ${item.bg}`}></div>
                  <div className="slide-content">
                    <span className="carousel-tag">{item.tag}</span>
                    <h3 className="carousel-title">{item.title}</h3>
                    <p className="carousel-desc">{item.desc}</p>
                    <span className="carousel-btn">{item.btn} →</span>
                  </div>
                </div>
              ))}
              <div className="carousel-dots" id="dots">
                {carouselItems.map((_, i) => (
                  <span key={i} className={i === 0 ? 'active' : ''} data-index={i}></span>
                ))}
              </div>
            </div>
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
              <div key={p.id} className="reverse-card">
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
              </div>
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
              {categories.map((cat, i) => (
                <div key={cat.id} className={`tree-item ${i === 0 ? 'active' : ''}`}>
                  <span style={{ fontSize: '1.1rem' }}>{cat.icon === 'folder' ? '📂' : cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className="count">{cat._count.posts}</span>
                </div>
              ))}
            </div>
            <div className="science-articles">
              {featuredPosts.map((post) => (
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
              ))}
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
          <div className="pilot-grid">
            <div className="pilot-card">
              <h4>🗺️ 共享产线资源档期</h4>
              <p style={{ fontSize: '.82rem', opacity: .7, marginBottom: '16px' }}>可按地区 / 设备类型筛选</p>
              <div className="line-list">
                {pilotLines.map((line) => (
                  <div key={line.id} className="line-item">
                    <div className="line-info">
                      <span className="line-region">{line.region}</span>
                      <span className="line-name">{line.name}</span>
                    </div>
                    <span className={`line-status ${line.status === 'AVAILABLE' ? 'available' : 'booked'}`}>
                      ● {line.status === 'AVAILABLE' ? '有档期' : '需预约'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pilot-card">
              <h4>🎛️ 远程协同研发舱（数据孪生演示）</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="remote-video">
                  <div className="live-badge"><span className="pulse"></span>LIVE</div>
                  <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '.95rem', fontWeight: 600, marginBottom: '6px' }}>正在进行：真空滚揉放大实验</div>
                    <div style={{ fontSize: '.8rem', opacity: .7 }}>华北区·中试基地 B-03 产线</div>
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
            {featuredPosts.filter(p => !p.tags.includes('故障')).slice(0, 1).map(post => (
              <Link href={`/article/${post.slug}`} key={post.id} className="industry-item">
                <div style={{ width: 56, height: 56, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, background: '#FEF3C7', color: '#D97706' }}>🔬</div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}><span style={{ fontSize: '.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4, marginRight: 8, background: '#FEF3C7', color: '#92400E' }}>辅料应用</span>{post.title}</h4>
                  <p style={{ fontSize: '.9rem', color: '#6B7280', lineHeight: 1.6 }}>{post.excerpt}</p>
                </div>
              </Link>
            ))}
            <div className="industry-item">
              <div style={{ width: 56, height: 56, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, background: '#DBEAFE', color: '#2563EB' }}>⚙️</div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}><span style={{ fontSize: '.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4, marginRight: 8, background: '#DBEAFE', color: '#1E40AF' }}>机械选型</span>汇川/西门子 PLC 控制系统在现代化高速斩拌机中的温度精准控制实践</h4>
                <p style={{ fontSize: '.9rem', color: '#6B7280', lineHeight: 1.6 }}>对比汇川H3U系列与西门子S7-1200在高速斩拌机（6000rpm）刀盘温度闭环控制中的响应精度与稳定性表现，涵盖PID参数整定方法、斩拌过程中的冰屑添加策略。</p>
              </div>
            </div>
            <div className="industry-item">
              <div style={{ width: 56, height: 56, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, background: '#D1FAE5', color: '#059669' }}>📦</div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}><span style={{ fontSize: '.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4, marginRight: 8, background: '#D1FAE5', color: '#065F46' }}>包装创新</span>莫迪维克（Multivac）高阻隔气调包装对低温冷鲜肉货架期延长突破</h4>
                <p style={{ fontSize: '.9rem', color: '#6B7280', lineHeight: 1.6 }}>基于Multivac R245封口机平台，测试70%O₂+30%CO₂气调配比下，不同阻隔膜对低温冷鲜猪肉货架期的影响。7层共挤膜可将货架期从12天延长至21天。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          var slides=document.querySelectorAll('.carousel-slide');
          var dots=document.querySelectorAll('#dots span');
          var current=0,timer=null;
          function show(i){slides.forEach(function(s,j){s.classList.toggle('active',j===i)});dots.forEach(function(d,j){d.classList.toggle('active',j===i)});current=i}
          function next(){show((current+1)%slides.length)}
          function start(){timer=setInterval(next,5000)}
          function stop(){clearInterval(timer)}
          dots.forEach(function(dot){dot.addEventListener('click',function(){show(parseInt(this.dataset.index));stop();start()})});
          var c=document.getElementById('carousel');if(c){c.addEventListener('mouseenter',stop);c.addEventListener('mouseleave',start)}
          start();
        })();
      `}} />
    </>
  );
}
