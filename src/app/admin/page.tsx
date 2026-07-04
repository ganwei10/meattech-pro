import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [postCount, productCount, lineCount, bookingCount, pendingBookings, recentPosts] = await Promise.all([
    prisma.post.count(),
    prisma.product.count(),
    prisma.pilotLine.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.post.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { category: true } }),
  ]);

  const stats = [
    { label: '技术文章', value: postCount, icon: '📝', color: '#DBEAFE', text: '#1E3A8A' },
    { label: '逆向产品', value: productCount, icon: '🛒', color: '#D1FAE5', text: '#065F46' },
    { label: '中试产线', value: lineCount, icon: '🏭', color: '#FEF3C7', text: '#92400E' },
    { label: '预约总数', value: bookingCount, icon: '📅', color: '#FEE2E2', text: '#991B1B' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>仪表盘</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: s.color, color: s.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: 12 }}>{s.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{s.value}</div>
            <div style={{ fontSize: '.85rem', color: '#6B7280' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {pendingBookings > 0 && (
        <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 12, padding: 16, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.2rem' }}>⏰</span>
          <span style={{ fontSize: '.9rem', color: '#92400E' }}>有 <strong>{pendingBookings}</strong> 条待处理的预约请求，<a href="/admin/bookings" style={{ color: '#1E3A8A', fontWeight: 600 }}>点击查看 →</a></span>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>最近发布文章</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {recentPosts.map(post => (
            <div key={post.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
              <div>
                <span style={{ fontSize: '.78rem', background: '#DBEAFE', color: '#1E3A8A', padding: '2px 8px', borderRadius: 4, marginRight: 8 }}>{post.category.name}</span>
                <span style={{ fontSize: '.9rem', fontWeight: 500 }}>{post.title}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: '.8rem', color: '#9CA3AF' }}>
                <span>👁️ {post.views}</span>
                <span>{new Date(post.createdAt).toISOString().slice(0, 10)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
