import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function CommunityPage({ searchParams }: { searchParams: { q?: string; tag?: string } }) {
  const q = searchParams.q || '';
  const tag = searchParams.tag || '';

  // Get the community-qa category
  const qaCategory = await prisma.category.findUnique({ where: { slug: 'community-qa' } });

  // Build where clause
  const where: any = { status: 'PUBLISHED' };
  if (qaCategory) {
    where.categoryId = qaCategory.id;
  }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { excerpt: { contains: q, mode: 'insensitive' } },
      { content: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (tag) {
    where.tags = { contains: tag };
  }

  const posts = await prisma.post.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  // Extract all unique tags from posts
  const tagSet = new Set<string>();
  posts.forEach(p => p.tags.split(',').map(t => t.trim()).filter(Boolean).forEach(t => tagSet.add(t)));
  const allTags: string[] = Array.from(tagSet).slice(0, 20);

  // Build FAQ Schema for AEO (top 10 Q&A)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://meattech-pro.vercel.app';
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: posts.slice(0, 10).map(p => ({
      '@type': 'Question',
      name: p.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: p.excerpt,
        url: `${baseUrl}/article/${p.slug}`,
      },
    })),
  };

  return (
    <>
      <Header />
      <section style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #3730A3 100%)', padding: '60px 0', color: '#fff' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 16, background: 'rgba(255,255,255,0.15)', fontSize: '.82rem', fontWeight: 600, marginBottom: 12 }}>💬 工艺问答社区</span>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>疑难杂症讨论交流</h1>
              <p style={{ fontSize: '.95rem', opacity: .7, maxWidth: 600 }}>遇到工艺难题？发帖求助，同行专家来解答。出水、散肉、色泽不均、保质期不达标……这里都有答案。</p>
            </div>
            <Link href="/community/ask" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 10, background: '#FCD34D', color: '#1E3A8A', fontSize: '.95rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              ✏️ 我要提问
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: '#F3F4F6', minHeight: '60vh' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          {/* Search bar */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <form style={{ flex: 1, display: 'flex', gap: 8 }} action="/community" method="GET">
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="搜索问题、关键词……"
                style={{ flex: 1, padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '10px 24px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.9rem', fontWeight: 600, cursor: 'pointer' }}>搜索</button>
            </form>
          </div>

          {/* Tag filter */}
          {allTags.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              <Link href="/community" style={{ padding: '4px 14px', borderRadius: 16, fontSize: '.82rem', fontWeight: 500, textDecoration: 'none', background: !tag ? '#1E3A8A' : '#fff', color: !tag ? '#fff' : '#374151', border: '1px solid #E5E7EB' }}>全部</Link>
              {allTags.map(t => (
                <Link key={t} href={`/community?tag=${encodeURIComponent(t)}`} style={{ padding: '4px 14px', borderRadius: 16, fontSize: '.82rem', fontWeight: 500, textDecoration: 'none', background: tag === t ? '#1E3A8A' : '#fff', color: tag === t ? '#fff' : '#374151', border: '1px solid #E5E7EB' }}>{t}</Link>
              ))}
            </div>
          )}

          {/* Posts list */}
          {posts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {posts.map((post) => (
                <Link key={post.id} href={`/article/${post.slug}`} style={{ display: 'block', background: '#fff', borderRadius: 12, padding: 20, textDecoration: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'box-shadow .2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                        {post.tags.split(',').filter(Boolean).map((t, i) => (
                          <span key={i} style={{ fontSize: '.72rem', padding: '2px 10px', borderRadius: 12, background: '#FEF3C7', color: '#92400E', fontWeight: 500 }}>{t.trim()}</span>
                        ))}
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1F2937', marginBottom: 6 }}>{post.title}</h3>
                      <p style={{ fontSize: '.85rem', color: '#6B7280', lineHeight: 1.5 }}>{post.excerpt.slice(0, 120)}{post.excerpt.length > 120 ? '...' : ''}</p>
                      <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: '.78rem', color: '#9CA3AF' }}>
                        <span>👨‍🔬 {post.author}</span>
                        <span>📅 {new Date(post.createdAt).toISOString().slice(0, 10)}</span>
                        <span>👁️ {post.views.toLocaleString()} 阅读</span>
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 12, background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>💬</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 12 }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>💬</div>
              <p style={{ fontSize: '1rem', color: '#6B7280', marginBottom: 8 }}>还没有人提问，做第一个提问的人吧！</p>
              <p style={{ fontSize: '.85rem', color: '#9CA3AF', marginBottom: 24 }}>无论是工艺难题、配方问题还是设备故障，都可以在这里发帖求助</p>
              <Link href="/community/ask" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 28px', borderRadius: 8, background: '#1E3A8A', color: '#fff', fontSize: '.9rem', fontWeight: 600, textDecoration: 'none' }}>✏️ 我要提问</Link>
            </div>
          )}
        </div>
      </section>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
