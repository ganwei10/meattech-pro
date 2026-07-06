import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSiteGlobalConfig } from '@/lib/siteConfig';

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

  // Fetch global config for community page text
  const globalConfig = await getSiteGlobalConfig();
  const cc = globalConfig.community;

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
      <section className="py-10 md:py-14 text-white" style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #3730A3 100%)' }}>
        <div className="container">
          <div className="flex justify-between items-start flex-wrap gap-5">
            <div>
              <span className="inline-block px-3.5 py-1 rounded-2xl bg-white/15 text-xs md:text-sm font-semibold mb-3">{cc.headerBadge}</span>
              <h1 className="text-2xl md:text-3xl font-extrabold mb-2">{cc.headerTitle}</h1>
              <p className="text-sm md:text-base opacity-70 max-w-xl">{cc.headerDesc}</p>
            </div>
            <Link href="/community/ask" className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-[#FCD34D] text-[#1E3A8A] text-sm font-bold no-underline whitespace-nowrap">
              {cc.askBtnText}
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: '#F3F4F6', minHeight: '60vh' }}>
        <div className="container max-w-4xl">
          {/* Search bar */}
          <div className="mb-6">
            <form className="flex gap-2" action="/community" method="GET">
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder={cc.searchPlaceholder}
                style={{ flex: 1, padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '10px 24px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.9rem', fontWeight: 600, cursor: 'pointer' }}>{cc.searchBtnText}</button>
            </form>
          </div>

          {/* Tag filter */}
          {allTags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-6 overflow-x-auto">
              <Link href="/community" style={{ padding: '4px 14px', borderRadius: 16, fontSize: '.82rem', fontWeight: 500, textDecoration: 'none', background: !tag ? '#1E3A8A' : '#fff', color: !tag ? '#fff' : '#374151', border: '1px solid #E5E7EB' }}>{cc.allTagText}</Link>
              {allTags.map(t => (
                <Link key={t} href={`/community?tag=${encodeURIComponent(t)}`} style={{ padding: '4px 14px', borderRadius: 16, fontSize: '.82rem', fontWeight: 500, textDecoration: 'none', background: tag === t ? '#1E3A8A' : '#fff', color: tag === t ? '#fff' : '#374151', border: '1px solid #E5E7EB' }}>{t}</Link>
              ))}
            </div>
          )}

          {/* Posts list */}
          {posts.length > 0 ? (
            <div className="flex flex-col gap-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/article/${post.slug}`} className="block bg-white rounded-xl p-4 md:p-5 no-underline shadow-sm">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
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
                        <span>👁️ {post.views.toLocaleString()} {cc.readText}</span>
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 12, background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>💬</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 12 }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>{cc.emptyState.icon}</div>
              <p style={{ fontSize: '1rem', color: '#6B7280', marginBottom: 8 }}>{cc.emptyState.title}</p>
              <p style={{ fontSize: '.85rem', color: '#9CA3AF', marginBottom: 24 }}>{cc.emptyState.desc}</p>
              <Link href="/community/ask" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 28px', borderRadius: 8, background: '#1E3A8A', color: '#fff', fontSize: '.9rem', fontWeight: 600, textDecoration: 'none' }}>{cc.emptyState.btnText}</Link>
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
