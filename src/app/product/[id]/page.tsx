import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import { getSiteGlobalConfig } from '@/lib/siteConfig';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!product) notFound();

  const config = await getSiteGlobalConfig();
  const pc = config.product;

  const bannerIcons: Record<string, string> = { '气调预制菜': '🍳', '低温调理肉': '🥩', '休闲及其他': '🌶️' };
  const bannerColors: Record<string, string> = { '气调预制菜': 'banner-1', '低温调理肉': 'banner-2', '休闲及其他': 'banner-3' };

  return (
    <>
      <Header />
      <section className="max-w-4xl mx-auto px-4 py-8 md:py-10 pb-16 md:pb-20">
        <div className="mb-6">
          <Link href="/#reverse" className="text-[#6B7280] text-sm no-underline">{pc.backBtn}</Link>
        </div>

        {product.cover && (
          <div className={`reverse-card-banner ${bannerColors[product.category] || 'banner-1'}`} style={{ height: 280, borderRadius: 16, marginBottom: 24, position: 'relative' }}>
            <img src={product.cover} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} />
            <span className="cat-tag">{product.category}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl p-5 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-2xl md:text-3xl">{bannerIcons[product.category] || '🍖'}</span>
            <span className="bg-[#F3F4F6] text-[#374151] px-3 py-1 rounded text-xs font-semibold">{product.category}</span>
            {product.featured && <span className="bg-[#FEF3C7] text-[#92400E] px-3 py-1 rounded text-xs font-semibold">{pc.featuredBadge}</span>}
          </div>

          <h1 className="text-xl md:text-3xl font-extrabold text-[#1F2937] mb-4">{product.title}</h1>

          {product.tags && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {product.tags.split(',').map((tag, i) => (
                <span key={i} style={{ background: '#DBEAFE', color: '#1E3A8A', padding: '4px 10px', borderRadius: 4, fontSize: '.78rem', fontWeight: 500 }}>{tag.trim()}</span>
              ))}
            </div>
          )}

          <div style={{ background: '#FEF3C7', borderRadius: 8, padding: 16, marginBottom: 24, borderLeft: '4px solid #F59E0B' }}>
            <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#92400E', marginBottom: 6 }}>{pc.keyDifficulty}</div>
            <div style={{ fontSize: '.92rem', color: '#78350F', lineHeight: 1.6 }}>{product.difficulty}</div>
          </div>

          {product.description && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 10, color: '#1F2937' }}>{pc.summaryTitle}</h3>
              <p style={{ color: '#4B5563', lineHeight: 1.8, fontSize: '.95rem' }}>{product.description}</p>
            </div>
          )}

          {product.content && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 10, color: '#1F2937' }}>{pc.reportTitle}</h3>
              <div className="article-content" dangerouslySetInnerHTML={{ __html: product.content }} />
            </div>
          )}

          {product.reportUrl && (
            <div style={{ marginTop: 24 }}>
              <a href={product.reportUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1E3A8A', color: '#fff', padding: '12px 24px', borderRadius: 10, fontSize: '.92rem', fontWeight: 600, textDecoration: 'none' }}>
                {pc.reportLink}
              </a>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-[#E5E7EB] flex flex-wrap justify-between items-center gap-3">
            <span className="text-xs md:text-sm text-[#9CA3AF]">{pc.publishText} {new Date(product.createdAt).toISOString().slice(0, 10)}</span>
            <Link href="/booking" className="text-white px-5 py-2.5 rounded-lg text-sm font-semibold no-underline" style={{ background: 'linear-gradient(135deg, #F97316, #DC2626)' }}>
              {pc.bookBtn}
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
