import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

// 鉴权：仅允许 Vercel Cron 或带正确 Secret 的请求
function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get('Authorization');
  if (authHeader === `Bearer ${process.env.CRON_SECRET || 'meattech-cron-secret'}` ) return true;
  // Vercel Cron 会设置 x-vercel-cron: true
  if (request.headers.get('x-vercel-cron') === 'true') return true;
  return false;
}

// 爬取 RSS 源
async function fetchRSSSource(source: { name: string; url: string; category: string }) {
  try {
    const res = await fetch(source.url, { headers: { 'User-Agent': 'MeatTechPro/1.0' }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return { source: source.name, error: `HTTP ${res.status}`, articles: [] };
    const xml = await res.text();

    // 简单解析 RSS/Atom
    const items: Array<{ title: string; link: string; description: string; pubDate: string }> = [];
    
    // 匹配 RSS 2.0 <item>
    const itemMatches = xml.match(/<item[\s\S]*?<\/item>/g) || [];
    for (const item of itemMatches.slice(0, 5)) {
      const title = (item.match(/<title>(.*?)<\/title>/) || [])[1] || '';
      const link = (item.match(/<link>(.*?)<\/link>/) || [])[1] || '';
      const description = (item.match(/<description>(.*?)<\/description>/) || [])[1] || '';
      const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || '';
      if (title && link) {
        // 解码 HTML 实体
        const decodedTitle = title.replace(/<!\[CDATA\[(.*?)\]\]>/, '$1').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        const decodedDesc = description.replace(/<!\[CDATA\[(.*?)\]\]>/, '$1').replace(/<[^>]+>/g, '').slice(0, 200);
        items.push({ title: decodedTitle, link: link.trim(), description: decodedDesc, pubDate });
      }
    }

    return { source: source.name, articles: items, error: null };
  } catch (e) {
    return { source: source.name, error: String(e), articles: [] };
  }
}

// 爬取 HTML 网页（简单提取文章列表）
async function fetchHTMLSource(source: { name: string; url: string; category: string }) {
  try {
    const res = await fetch(source.url, { headers: { 'User-Agent': 'Mozilla/5.0 MeatTechPro/1.0' }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return { source: source.name, error: `HTTP ${res.status}`, articles: [] };
    const html = await res.text();
    const $ = cheerio.load(html);

    const articles: Array<{ title: string; link: string; description: string }> = [];
    
    // 通用文章链接提取（适配大多数新闻站）
    $('a').each((i, el) => {
      if (i >= 10) return false;
      const $el = $(el);
      const href = $el.attr('href') || '';
      const text = $el.text().trim();
      if (text.length > 10 && (href.includes('/article') || href.includes('/news') || href.includes('/tech') || href.match(/\d{4,}/))) {
        const fullLink = href.startsWith('http') ? href : new URL(href, source.url).toString();
        articles.push({ title: text, link: fullLink, description: '' });
      }
    });

    return { source: source.name, articles: articles.slice(0, 5), error: null };
  } catch (e) {
    return { source: source.name, error: String(e), articles: [] };
  }
}

// 获取文章全文并提取摘要
async function fetchArticleContent(url: string): Promise<{ content: string; excerpt: string }> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 MeatTechPro/1.0' }, signal: AbortSignal.timeout(10000) });
    if (!res.ok) return { content: '', excerpt: '' };
    const html = await res.text();
    const $ = cheerio.load(html);

    // 移除脚本和样式
    $('script, style, nav, footer, header, .ads, .comments').remove();

    // 尝试提取正文（通用策略）
    let content = '';
    const $article = $('article, .article, .content, .post-content, .entry-content, main').first();
    if ($article.length) {
      content = $article.text().trim().replace(/\s+/g, ' ').slice(0, 5000);
    } else {
      content = $('p').map((i, el) => $(el).text()).get().join('\n').trim().slice(0, 5000);
    }

    const excerpt = content.slice(0, 150) + (content.length > 150 ? '...' : '');
    return { content: content || '暂无正文', excerpt };
  } catch {
    return { content: '', excerpt: '' };
  }
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 从 Setting 表读取文章来源
    const sourcesSetting = await prisma.setting.findUnique({ where: { key: 'article_sources' } });
    const sources = sourcesSetting ? JSON.parse(sourcesSetting.value) : [];

    if (sources.length === 0) {
      return NextResponse.json({ message: 'No article sources configured', fetched: 0 });
    }

    const results: Array<{ source: string; found: number; created: number; errors: string[] }> = [];

    for (const source of sources) {
      const result = source.type === 'rss' 
        ? await fetchRSSSource(source)
        : await fetchHTMLSource(source);

      let created = 0;
      const errors: string[] = [];

      for (const article of result.articles) {
        // 去重：检查是否已存在相同 sourceUrl
        const existing = await prisma.post.findFirst({
          where: { sourceUrl: article.link },
        });
        if (existing) continue;

        // 获取分类
        const category = await prisma.category.findFirst({
          where: { name: source.category },
        });
        if (!category) {
          errors.push(`分类不存在: ${source.category}`);
          continue;
        }

        // 获取文章正文
        const { content, excerpt } = await fetchArticleContent(article.link);

        // 生成 slug
        const baseSlug = article.title
          .toLowerCase()
          .replace(/[^\w\u4e00-\u9fff]+/g, '-')
          .replace(/^-|-$/g, '')
          .slice(0, 80) || `auto-${Date.now()}`;
        
        // 确保 slug 唯一
        let slug = baseSlug;
        let counter = 1;
        while (await prisma.post.findUnique({ where: { slug } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        await prisma.post.create({
          data: {
            title: article.title.slice(0, 200),
            slug,
            excerpt: excerpt || article.description || '自动抓取的文章',
            content: content || article.description || '暂无正文内容',
            author: source.name,
            tags: '自动抓取,行业动态',
            status: 'DRAFT', // 草稿状态，等待管理员审核
            categoryId: category.id,
            sourceUrl: article.link,
            sourceName: source.name,
            autoGenerated: true,
          },
        });
        created++;
      }

      results.push({
        source: result.source,
        found: result.articles.length,
        created,
        errors: result.error ? [result.error, ...errors] : errors,
      });
    }

    const totalCreated = results.reduce((sum, r) => sum + r.created, 0);

    return NextResponse.json({
      success: true,
      results,
      totalCreated,
      message: `爬取完成，新增 ${totalCreated} 篇草稿文章`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: '爬取失败', detail: String(error) },
      { status: 500 }
    );
  }
}
