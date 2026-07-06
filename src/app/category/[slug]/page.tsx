import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSiteGlobalConfig } from '@/lib/siteConfig';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const config = await getSiteGlobalConfig();
  const cat = config.category;

  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: { _count: { select: { posts: true } } },
  });

  if (!category) {
    return (
      <>
        <Header />
        <div className="container" style={{ paddingTop: 120, paddingBottom: 60, minHeight: '60vh', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>{cat.notFoundIcon}</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>{cat.notFoundTitle}</h1>
          <p style={{ color: '#6B7280', marginBottom: 24 }}>{cat.notFoundDesc}</p>
          <Link href="/" style={{ color: '#1E3A8A', fontSize: '.9rem', fontWeight: 600 }}>{cat.backToHome}</Link>
        </div>
        <Footer />
      </>
    );
  }

  const posts = await prisma.post.findMany({
    where: { categoryId: category.id, status: 'PUBLISHED' },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  const allCategories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <>
      <Header />
      <div className="container pt-20 md:pt-24 pb-12 md:pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-xs md:text-sm text-[#9CA3AF]">
          <Link href="/" className="text-[#6B7280] no-underline">{cat.breadcrumbHome}</Link>
          <span>/</span>
          <Link href="/#science" className="text-[#6B7280] no-underline">{cat.breadcrumbScience}</Link>
          <span>/</span>
          <span className="text-[#1E3A8A] font-semibold">{category.name}</span>
        </div>

        {/* Category Header */}
        <div className="rounded-2xl p-5 md:p-9 mb-8 text-white" style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)' }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl md:text-3xl">{category.icon === 'folder' ? '📂' : category.icon}</span>
            <h1 className="text-xl md:text-3xl font-extrabold m-0">{category.name}</h1>
          </div>
          <p className="text-sm opacity-80 m-0">{cat.postCountText} {posts.length} 篇文章 · 持续更新中</p>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-[220px_1fr] gap-6 md:gap-8">
          {/* Category Sidebar — horizontal scroll on mobile */}
          <div className="md:sticky md:top-24 md:self-start">
            <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-3 md:mb-4 hidden md:block">{cat.navTitle}</h4>
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              {allCategories.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm whitespace-nowrap md:whitespace-normal no-underline transition-all"
                  style={{
                    fontWeight: c.id === category.id ? 700 : 500,
                    color: c.id === category.id ? '#1E3A8A' : '#6B7280',
                    background: c.id === category.id ? '#DBEAFE' : 'transparent',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{c.icon === 'folder' ? '📂' : c.icon}</span>
                  <span style={{ flex: 1 }}>{c.name}</span>
                  <span style={{ fontSize: '.78rem', color: '#9CA3AF' }}>{c._count.posts}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Posts List */}
          <div>
            {posts.length > 0 ? (
              <div className="flex flex-col gap-4">
                {posts.map((post) => (
                  <Link
                    href={`/article/${post.slug}`}
                    key={post.id}
                    className="block bg-white p-5 md:p-6 rounded-xl shadow-sm border border-[#F3F4F6] no-underline"
                  >
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontSize: '.75rem', background: '#DBEAFE', color: '#1E3A8A', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                        {post.tags.split(',')[0] || category.name}
                      </span>
                      <span style={{ fontSize: '.78rem', color: '#9CA3AF' }}>
                        {new Date(post.createdAt).toISOString().slice(0, 10)} · 👁️ {post.views.toLocaleString()} {cat.readText}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8, color: '#1F2937' }}>{post.title}</h3>
                    <p style={{ fontSize: '.9rem', color: '#6B7280', lineHeight: 1.6 }}>{post.excerpt}</p>
                    <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: '.82rem', color: '#9CA3AF' }}>
                      <span>👨‍🔬 {post.author}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: 12, padding: '60px 40px', textAlign: 'center', border: '1px solid #F3F4F6' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>{cat.emptyIcon}</div>
                <p style={{ fontSize: '1rem', color: '#6B7280', marginBottom: 8 }}>{cat.emptyTitle}</p>
                <p style={{ fontSize: '.85rem', color: '#9CA3AF', marginBottom: 20 }}>{cat.emptyDesc}</p>
                <Link href="/admin/posts/new" style={{ color: '#1E3A8A', fontSize: '.9rem', fontWeight: 600 }}>{cat.emptyCta}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
