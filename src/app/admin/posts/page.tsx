import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminPosts() {
  const posts = await prisma.post.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>文章管理</h1>
        <Link href="/admin/posts/new" style={{ background: '#1E3A8A', color: '#fff', padding: '8px 20px', borderRadius: 8, fontSize: '.9rem', fontWeight: 600 }}>➕ 发布文章</Link>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>标题</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>分类</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>状态</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>浏览</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>日期</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '12px 16px', fontSize: '.9rem', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</td>
                <td style={{ padding: '12px 16px', fontSize: '.85rem' }}>{post.category.name}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '.78rem', padding: '2px 8px', borderRadius: 4, background: post.status === 'PUBLISHED' ? '#D1FAE5' : '#FEF3C7', color: post.status === 'PUBLISHED' ? '#065F46' : '#92400E' }}>{post.status === 'PUBLISHED' ? '已发布' : '草稿'}</span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '.85rem', color: '#6B7280' }}>{post.views}</td>
                <td style={{ padding: '12px 16px', fontSize: '.8rem', color: '#9CA3AF' }}>{new Date(post.createdAt).toISOString().slice(0, 10)}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <Link href={`/admin/posts/${post.id}`} style={{ color: '#1E3A8A', fontSize: '.82rem', fontWeight: 600, marginRight: 12 }}>编辑</Link>
                  <DeleteButton id={post.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
