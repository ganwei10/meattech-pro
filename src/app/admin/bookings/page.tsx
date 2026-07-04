import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminBookings() {
  const bookings = await prisma.booking.findMany({
    include: { line: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>预约管理</h1>
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>联系人</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>电话</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>公司</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>预约产线</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>需求</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>状态</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>提交时间</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>暂无预约记录</td></tr>
            ) : bookings.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '12px 16px', fontSize: '.9rem', fontWeight: 500 }}>{b.contactName}</td>
                <td style={{ padding: '12px 16px', fontSize: '.85rem' }}>{b.contactPhone}</td>
                <td style={{ padding: '12px 16px', fontSize: '.85rem' }}>{b.company || '-'}</td>
                <td style={{ padding: '12px 16px', fontSize: '.85rem' }}>{b.line.name}</td>
                <td style={{ padding: '12px 16px', fontSize: '.82rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.requirement || '-'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '.78rem', padding: '2px 8px', borderRadius: 4, background: b.status === 'PENDING' ? '#FEF3C7' : b.status === 'CONFIRMED' ? '#D1FAE5' : '#FEE2E2', color: b.status === 'PENDING' ? '#92400E' : b.status === 'CONFIRMED' ? '#065F46' : '#991B1B' }}>{b.status === 'PENDING' ? '待处理' : b.status === 'CONFIRMED' ? '已确认' : '已取消'}</span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '.8rem', color: '#9CA3AF' }}>{new Date(b.createdAt).toISOString().slice(0, 16).replace('T', ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
