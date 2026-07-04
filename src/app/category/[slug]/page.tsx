import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: { _count: { select: { posts: true } } },
  });

  if (!category) {
    return (
      <>
        <Header />
        <div className="container" style={{ paddingTop: 120, paddingBottom: 60, minHeight: '60vh', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>📂</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>分类不存在</h1>
          <p style={{ color: '#6B7280', marginBottom: 24 }}>您访问的分类不存在或已被删除</p>
          <Link href="/" style={{ color: '#1E3A8A', fontSize: '.9rem', fontWeight: 600 }}>← 返回首页</Link>
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
      <div className="container" style={{ paddingTop: 100, paddingBottom: 60 }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: '.85rem', color: '#9CA3AF' }}>
          <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>首页</Link>
          <span>/</span>
          <Link href="/#science" style={{ color: '#6B7280', textDecoration: 'none' }}>硬核肉品科学</Link>
          <span>/</span>
          <span style={{ color: '#1E3A8A', fontWeight: 600 }}>{category.name}</span>
        </div>

        {/* Category Header */}
        <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)', borderRadius: 16, padding: '32px 36px', marginBottom: 32, color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: '1.8rem' }}>{category.icon === 'folder' ? '📂' : category.icon}</span>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>{category.name}</h1>
          </div>
          <p style={{ fontSize: '.9rem', opacity: .8, margin: 0 }}>共 {posts.length} 篇文章 · 持续更新中</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32 }}>
          {/* Category Sidebar */}
          <div style={{ position: 'sticky', top: 100, alignSelf: 'start' }}>
            <h4 style={{ fontSize: '.85rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>📂 品类导航</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {allCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8,
                    fontSize: '.88rem', fontWeight: cat.id === category.id ? 700 : 500,
                    color: cat.id === category.id ? '#1E3A8A' : '#6B7280',
                    background: cat.id === category.id ? '#DBEAFE' : 'transparent',
                    textDecoration: 'none', transition: 'all .15s',
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{cat.icon === 'folder' ? '📂' : cat.icon}</span>
                  <span style={{ flex: 1 }}>{cat.name}</span>
                  <span style={{ fontSize: '.78rem', color: '#9CA3AF' }}>{cat._count.posts}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Posts List */}
          <div>
            {posts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {posts.map((post) => (
                  <Link
                    href={`/article/${post.slug}`}
                    key={post.id}
                    style={{
                      display: 'block', background: '#fff', padding: 24, borderRadius: 12,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #F3F4F6',
                      textDecoration: 'none', transition: 'box-shadow .2s, transform .2s',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontSize: '.75rem', background: '#DBEAFE', color: '#1E3A8A', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                        {post.tags.split(',')[0] || category.name}
                      </span>
                      <span style={{ fontSize: '.78rem', color: '#9CA3AF' }}>
                        {new Date(post.createdAt).toISOString().slice(0, 10)} · 👁️ {post.views.toLocaleString()} 阅读
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
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>📝</div>
                <p style={{ fontSize: '1rem', color: '#6B7280', marginBottom: 8 }}>该分类下暂无文章</p>
                <p style={{ fontSize: '.85rem', color: '#9CA3AF', marginBottom: 20 }}>管理员可在后台 CMS 发布文章并选择此分类</p>
                <Link href="/admin/posts/new" style={{ color: '#1E3A8A', fontSize: '.9rem', fontWeight: 600 }}>去发布文章 →</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
