import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });
  if (!post) notFound();

  await prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  });

  return (
    <>
      <Header />
      <article style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
        <Link href="/" style={{ color: '#1E3A8A', fontSize: '.9rem', fontWeight: 600, marginBottom: '16px', display: 'inline-block' }}>← 返回首页</Link>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <span style={{ background: '#1E3A8A', color: '#fff', padding: '3px 10px', borderRadius: '4px', fontSize: '.75rem', fontWeight: 600 }}>{post.category.name}</span>
          {post.tags.split(',').filter(Boolean).map((tag, i) => (
            <span key={i} style={{ background: '#F3F4F6', color: '#6B7280', padding: '3px 10px', borderRadius: '4px', fontSize: '.75rem' }}>#{tag.trim()}</span>
          ))}
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.4 }}>{post.title}</h1>
        <div style={{ display: 'flex', gap: '16px', fontSize: '.85rem', color: '#9CA3AF', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #E5E7EB' }}>
          <span>👨‍🔬 {post.author}</span>
          <span>📅 {new Date(post.createdAt).toISOString().slice(0, 10)}</span>
          <span>👁️ {post.views.toLocaleString()} 阅读</span>
        </div>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} style={{ lineHeight: 1.8, fontSize: '1rem' }} />
        <div style={{ marginTop: '48px', padding: '24px', background: '#F3F4F6', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#6B7280', fontSize: '.9rem' }}>这篇技术文章对您有帮助吗？</p>
          <Link href="/booking" style={{ display: 'inline-block', marginTop: '12px', background: 'linear-gradient(135deg, #F97316, #DC2626)', color: '#fff', padding: '10px 28px', borderRadius: '20px', fontWeight: 600, fontSize: '.9rem' }}>预约中试线验证工艺 →</Link>
        </div>
      </article>
      <Footer />
    </>
  );
}
