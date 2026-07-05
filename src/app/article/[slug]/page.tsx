import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';
import { getSiteGlobalConfig } from '@/lib/siteConfig';

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

  const config = await getSiteGlobalConfig();
  const ac = config.article;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://meattech-pro.vercel.app';
  const isQA = post.slug.startsWith('qa-');

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': isQA ? 'FAQPage' : 'TechArticle',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Person', name: post.author },
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    url: `${baseUrl}/article/${post.slug}`,
    articleSection: post.category.name,
    keywords: post.tags,
    inLanguage: 'zh-CN',
    ...(isQA ? {
      mainEntity: [{
        '@type': 'Question',
        name: post.title,
        acceptedAnswer: {
          '@type': 'Answer',
          text: post.excerpt,
        },
      }],
    } : {
      publisher: {
        '@type': 'Organization',
        name: 'MeatTech Pro',
        url: baseUrl,
      },
    }),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: ac.breadcrumbHome, item: baseUrl },
      { '@type': 'ListItem', position: 2, name: post.category.name, item: `${baseUrl}/category/${post.category.slug}` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${baseUrl}/article/${post.slug}` },
    ],
  };

  return (
    <>
      <Header />
      <article style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
        <nav style={{ marginBottom: '16px', fontSize: '.85rem', color: '#9CA3AF' }}>
          <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>{ac.breadcrumbHome}</Link>
          <span style={{ margin: '0 6px' }}>/</span>
          <Link href={`/category/${post.category.slug}`} style={{ color: '#6B7280', textDecoration: 'none' }}>{post.category.name}</Link>
          <span style={{ margin: '0 6px' }}>/</span>
          <span style={{ color: '#1E3A8A' }}>{post.title.slice(0, 30)}{post.title.length > 30 ? '...' : ''}</span>
        </nav>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <span style={{ background: '#1E3A8A', color: '#fff', padding: '3px 10px', borderRadius: '4px', fontSize: '.75rem', fontWeight: 600 }}>{post.category.name}</span>
          {post.tags.split(',').filter(Boolean).map((tag, i) => (
            <span key={i} style={{ background: '#F3F4F6', color: '#6B7280', padding: '3px 10px', borderRadius: '4px', fontSize: '.75rem' }}>#{tag.trim()}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '16px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.4, margin: 0 }}>{post.title}</h1>
          <FavoriteButton targetType="ARTICLE" targetId={post.id} />
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '.85rem', color: '#9CA3AF', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #E5E7EB' }}>
          <span>👨‍🔬 {post.author}</span>
          <span>📅 {new Date(post.createdAt).toISOString().slice(0, 10)}</span>
          <span>👁️ {post.views.toLocaleString()} {ac.readText}</span>
        </div>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} style={{ lineHeight: 1.8, fontSize: '1rem' }} />
        <div style={{ marginTop: '48px', padding: '24px', background: '#F3F4F6', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#6B7280', fontSize: '.9rem' }}>{ac.helpfulText}</p>
          <Link href="/booking" style={{ display: 'inline-block', marginTop: '12px', background: 'linear-gradient(135deg, #F97316, #DC2626)', color: '#fff', padding: '10px 28px', borderRadius: '20px', fontWeight: 600, fontSize: '.9rem' }}>{ac.ctaBtn}</Link>
        </div>
      </article>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
