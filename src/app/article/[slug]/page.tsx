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
      <article className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <nav className="mb-4 text-xs md:text-sm text-[#9CA3AF]">
          <Link href="/" className="text-[#6B7280] no-underline">{ac.breadcrumbHome}</Link>
          <span className="mx-1.5">/</span>
          <Link href={`/category/${post.category.slug}`} className="text-[#6B7280] no-underline">{post.category.name}</Link>
          <span className="mx-1.5">/</span>
          <span className="text-[#1E3A8A]">{post.title.slice(0, 30)}{post.title.length > 30 ? '...' : ''}</span>
        </nav>
        <div className="flex gap-2.5 mb-4 flex-wrap">
          <span className="bg-[#1E3A8A] text-white px-2.5 py-1 rounded text-xs font-semibold">{post.category.name}</span>
          {post.tags.split(',').filter(Boolean).map((tag, i) => (
            <span key={i} className="bg-[#F3F4F6] text-[#6B7280] px-2.5 py-1 rounded text-xs">#{tag.trim()}</span>
          ))}
        </div>
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-xl md:text-3xl font-extrabold leading-snug m-0">{post.title}</h1>
          <FavoriteButton targetType="ARTICLE" targetId={post.id} />
        </div>
        <div className="flex flex-wrap gap-4 text-xs md:text-sm text-[#9CA3AF] mb-8 pb-6 border-b border-[#E5E7EB]">
          <span>👨‍🔬 {post.author}</span>
          <span>📅 {new Date(post.createdAt).toISOString().slice(0, 10)}</span>
          <span>👁️ {post.views.toLocaleString()} {ac.readText}</span>
        </div>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} style={{ lineHeight: 1.8, fontSize: '1rem' }} />
        <div className="mt-8 md:mt-12 p-6 bg-[#F3F4F6] rounded-xl text-center">
          <p className="text-[#6B7280] text-sm">{ac.helpfulText}</p>
          <Link href="/booking" className="inline-block mt-3 text-white px-7 py-2.5 rounded-full font-semibold text-sm" style={{ background: 'linear-gradient(135deg, #F97316, #DC2626)' }}>{ac.ctaBtn}</Link>
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
