import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Smart keyword matching for Q&A retrieval
function scoreRelevance(question: string, post: { title: string; excerpt: string; content: string; tags: string }): number {
  const q = question.toLowerCase();
  const title = post.title.toLowerCase();
  const excerpt = post.excerpt.toLowerCase();
  const content = post.content.toLowerCase();
  const tags = post.tags.toLowerCase();

  // Tokenize question (split by spaces and common punctuation, filter short tokens)
  const tokens = q.split(/[\s,，。？?！!、；;：:""''《》()（）\-\/]+/)
    .filter(t => t.length >= 2)
    .map(t => t.trim());

  let score = 0;

  for (const token of tokens) {
    // Title match is highest weight
    if (title.includes(token)) score += 10;
    // Tags match is high weight
    if (tags.includes(token)) score += 8;
    // Excerpt match is medium weight
    if (excerpt.includes(token)) score += 5;
    // Content match is lower weight
    if (content.includes(token)) score += 2;
  }

  // Bonus: exact phrase match in title
  if (q.length >= 4 && title.includes(q)) score += 20;

  // Bonus: question mark pattern match (e.g., "怎么办" "如何" "为什么")
  const questionPatterns = ['怎么办', '如何', '为什么', '原因', '怎样', '多少', '能否', '可以吗', '正常吗'];
  for (const pattern of questionPatterns) {
    if (q.includes(pattern) && title.includes(pattern)) score += 5;
  }

  return score;
}

// Generate a draft answer from relevant Q&A posts
function generateDraftAnswer(question: string, matches: { title: string; excerpt: string; content: string }[]): string {
  if (matches.length === 0) {
    return '<p>暂未找到与您问题直接相关的已有问答。建议您：</p><ul><li>尝试用更具体的关键词描述问题（如"香肠灌装气泡"、"滚揉真空度"等）</li><li>在社区发帖求助，同行专家会为您解答</li></ul>';
  }

  const topMatch = matches[0];
  const otherMatches = matches.slice(1, 3);

  let draft = `<p>根据您的问题"${question}"，参考已有技术问答，建议如下：</p>\n`;
  draft += `<h3>核心解答</h3>\n`;
  draft += `<p>${topMatch.excerpt}</p>\n`;

  if (otherMatches.length > 0) {
    draft += `<h3>相关参考</h3>\n<ul>\n`;
    for (const m of otherMatches) {
      draft += `<li><strong>${m.title}</strong>：${m.excerpt.slice(0, 100)}...</li>\n`;
    }
    draft += `</ul>\n`;
  }

  draft += `<h3>建议</h3>\n<p>如需进一步验证工艺参数，可通过平台预约中试产线进行实际测试。预约链接：<a href="/booking">/booking</a></p>`;

  return draft;
}

// GET: Fetch all Q&A posts for browsing
export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const qaCategory = await prisma.category.findUnique({ where: { slug: 'community-qa' } });
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED', ...(qaCategory ? { categoryId: qaCategory.id } : {}) },
      select: { id: true, title: true, slug: true, excerpt: true, tags: true, views: true, createdAt: true },
      orderBy: { views: 'desc' },
      take: 100,
    });

    // Get unanswered questions (posts without content or with low views)
    const unanswered = await prisma.post.findMany({
      where: { status: 'PUBLISHED', content: { equals: '' } },
      select: { id: true, title: true, excerpt: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ total: posts.length, posts, unanswered });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Q&A data', detail: String(error) }, { status: 500 });
  }
}

// POST: Smart answer generation
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { question, action } = await request.json();

    if (action === 'answer') {
      // Search for relevant Q&A posts
      const qaCategory = await prisma.category.findUnique({ where: { slug: 'community-qa' } });
      const allPosts = await prisma.post.findMany({
        where: { status: 'PUBLISHED', ...(qaCategory ? { categoryId: qaCategory.id } : {}) },
        select: { id: true, title: true, slug: true, excerpt: true, content: true, tags: true, views: true },
      });

      // Score each post
      const scored = allPosts.map(p => ({
        ...p,
        score: scoreRelevance(question, p),
      })).filter(p => p.score > 0).sort((a, b) => b.score - a.score);

      const topMatches = scored.slice(0, 5);
      const draftAnswer = generateDraftAnswer(question, topMatches);

      return NextResponse.json({
        question,
        relevantPosts: topMatches.map(p => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt,
          tags: p.tags,
          views: p.views,
          score: p.score,
          url: `/article/${p.slug}`,
        })),
        draftAnswer,
        totalMatched: scored.length,
      });
    }

    if (action === 'publish') {
      // Publish a new Q&A post with the generated answer
      const { title, content, tags, author } = await request.json();
      const slug = `qa-${Date.now()}`;

      const qaCategory = await prisma.category.findUnique({ where: { slug: 'community-qa' } });
      if (!qaCategory) {
        return NextResponse.json({ error: 'Q&A category not found' }, { status: 404 });
      }

      const post = await prisma.post.create({
        data: {
          title,
          slug,
          excerpt: content.replace(/<[^>]+>/g, '').slice(0, 200) + '...',
          content,
          tags: tags || 'AI回答,自动生成',
          author: author || 'AI助手',
          status: 'PUBLISHED',
          categoryId: qaCategory.id,
        },
      });

      return NextResponse.json({ ok: true, postId: post.id, slug: post.slug });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'AI assistant error', detail: String(error) }, { status: 500 });
  }
}
