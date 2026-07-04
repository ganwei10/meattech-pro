import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://meattech-pro.vercel.app';
  const posts = await prisma.post.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } });

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/booking`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tool/gb2760`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tool/troubleshoot`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${baseUrl}/article/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...postPages];
}
