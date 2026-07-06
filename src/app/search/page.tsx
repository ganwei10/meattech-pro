import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSiteGlobalConfig } from '@/lib/siteConfig';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q || '';
  let posts: any[] = [];
  let products: any[] = [];
  let total = 0;

  if (q.trim()) {
    const keyword = q.trim();
    [posts, products] = await Promise.all([
      prisma.post.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: keyword } },
            { excerpt: { contains: keyword } },
            { tags: { contains: keyword } },
            { content: { contains: keyword } },
          ],
        },
        include: { category: true },
        take: 20,
        orderBy: { views: 'desc' },
      }),
      prisma.product.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: keyword } },
            { category: { contains: keyword } },
            { difficulty: { contains: keyword } },
          ],
        },
        take: 10,
      }),
    ]);
    total = posts.length + products.length;
  }

  const config = await getSiteGlobalConfig();
  const sc = config.search;

  return (
    <>
      <Header />
      <div className="container pt-20 md:pt-24 pb-12 md:pb-16 min-h-[60vh]">
        <h1 className="text-xl md:text-3xl font-extrabold mb-2">
          {sc.title} {q && <span className="text-[#6B7280] text-base md:text-xl">— "{q}"</span>}
        </h1>
        <p className="text-[#6B7280] mb-6 md:mb-8 text-sm">{sc.resultCountText} {total} 条结果</p>

        {total === 0 && q && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>{sc.emptyIcon}</div>
            <p>{sc.emptyText}</p>
          </div>
        )}

        {posts.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16, color: '#1E3A8A' }}>{sc.articlesHeader} ({posts.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {posts.map(post => (
                <Link href={`/article/${post.slug}`} key={post.id} style={{ display: 'block', background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #F3F4F6' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: '.75rem', background: '#DBEAFE', color: '#1E3A8A', padding: '2px 8px', borderRadius: 4 }}>{post.category.name}</span>
                    <span style={{ fontSize: '.78rem', color: '#9CA3AF' }}>👁️ {post.views} · {new Date(post.createdAt).toISOString().slice(0, 10)}</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6 }}>{post.title}</h3>
                  <p style={{ fontSize: '.88rem', color: '#6B7280', lineHeight: 1.6 }}>{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {products.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16, color: '#1E3A8A' }}>{sc.productsHeader} ({products.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(p => (
                <div key={p.id} style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: '.75rem', background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: 4 }}>{p.category}</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginTop: 10, marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontSize: '.85rem', color: '#6B7280' }}>⚡ {p.difficulty}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
