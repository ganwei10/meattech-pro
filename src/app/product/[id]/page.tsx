import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!product) notFound();

  const bannerIcons: Record<string, string> = { '气调预制菜': '🍳', '低温调理肉': '🥩', '休闲及其他': '🌶️' };
  const bannerColors: Record<string, string> = { '气调预制菜': 'banner-1', '低温调理肉': 'banner-2', '休闲及其他': 'banner-3' };

  return (
    <>
      <Header />
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ marginBottom: 24 }}>
          <Link href="/#reverse" style={{ color: '#6B7280', fontSize: '.88rem', textDecoration: 'none' }}>← 返回货架直通车</Link>
        </div>

        {product.cover && (
          <div className={`reverse-card-banner ${bannerColors[product.category] || 'banner-1'}`} style={{ height: 280, borderRadius: 16, marginBottom: 24, position: 'relative' }}>
            <img src={product.cover} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} />
            <span className="cat-tag">{product.category}</span>
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: '2rem' }}>{bannerIcons[product.category] || '🍖'}</span>
            <span style={{ background: '#F3F4F6', color: '#374151', padding: '4px 12px', borderRadius: 4, fontSize: '.8rem', fontWeight: 600 }}>{product.category}</span>
            {product.featured && <span style={{ background: '#FEF3C7', color: '#92400E', padding: '4px 12px', borderRadius: 4, fontSize: '.8rem', fontWeight: 600 }}>⭐ 推荐</span>}
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1F2937', marginBottom: 16 }}>{product.title}</h1>

          {product.tags && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {product.tags.split(',').map((tag, i) => (
                <span key={i} style={{ background: '#DBEAFE', color: '#1E3A8A', padding: '4px 10px', borderRadius: 4, fontSize: '.78rem', fontWeight: 500 }}>{tag.trim()}</span>
              ))}
            </div>
          )}

          <div style={{ background: '#FEF3C7', borderRadius: 8, padding: 16, marginBottom: 24, borderLeft: '4px solid #F59E0B' }}>
            <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#92400E', marginBottom: 6 }}>⚡ 关键难点</div>
            <div style={{ fontSize: '.92rem', color: '#78350F', lineHeight: 1.6 }}>{product.difficulty}</div>
          </div>

          {product.description && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 10, color: '#1F2937' }}>📋 产品概述</h3>
              <p style={{ color: '#4B5563', lineHeight: 1.8, fontSize: '.95rem' }}>{product.description}</p>
            </div>
          )}

          {product.content && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 10, color: '#1F2937' }}>🔬 逆向工艺报告</h3>
              <div className="article-content" dangerouslySetInnerHTML={{ __html: product.content }} />
            </div>
          )}

          {product.reportUrl && (
            <div style={{ marginTop: 24 }}>
              <a href={product.reportUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1E3A8A', color: '#fff', padding: '12px 24px', borderRadius: 10, fontSize: '.92rem', fontWeight: 600, textDecoration: 'none' }}>
                📄 查看完整工艺说明书 →
              </a>
            </div>
          )}

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '.82rem', color: '#9CA3AF' }}>发布于 {new Date(product.createdAt).toISOString().slice(0, 10)}</span>
            <Link href="/booking" style={{ background: 'linear-gradient(135deg, #F97316, #DC2626)', color: '#fff', padding: '10px 20px', borderRadius: 8, fontSize: '.88rem', fontWeight: 600, textDecoration: 'none' }}>
              预约中试验证 →
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
