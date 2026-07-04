import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import BookingActions from '@/components/BookingActions';

export const dynamic = 'force-dynamic';

export default async function AdminBookings() {
  const bookings = await prisma.booking.findMany({
    include: { line: true },
    orderBy: { createdAt: 'desc' },
  });

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: '待处理', color: '#92400E', bg: '#FEF3C7' },
    CONFIRMED: { label: '已确认', color: '#065F46', bg: '#D1FAE5' },
    IN_PROGRESS: { label: '执行中', color: '#1E40AF', bg: '#DBEAFE' },
    COMPLETED: { label: '已完成', color: '#065F46', bg: '#D1FAE5' },
    CANCELLED: { label: '已取消', color: '#991B1B', bg: '#FEE2E2' },
  };

  const stats = [
    { label: '全部', value: bookings.length, status: '' },
    { label: '待处理', value: bookings.filter(b => b.status === 'PENDING').length, status: 'PENDING' },
    { label: '已确认', value: bookings.filter(b => b.status === 'CONFIRMED').length, status: 'CONFIRMED' },
    { label: '执行中', value: bookings.filter(b => b.status === 'IN_PROGRESS').length, status: 'IN_PROGRESS' },
    { label: '已完成', value: bookings.filter(b => b.status === 'COMPLETED').length, status: 'COMPLETED' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>预约管理</h1>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#fff', padding: '16px 24px', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E3A8A' }}>{s.value}</div>
            <div style={{ fontSize: '.78rem', color: '#6B7280' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>编号</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>联系人</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>产线</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>实验类型</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>期望日期</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>状态</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>暂无预约记录</td></tr>
            ) : bookings.map(b => {
              const st = statusMap[b.status] || statusMap.PENDING;
              return (
                <tr key={b.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 16px', fontSize: '.85rem' }}>
                    <Link href={`/booking/${b.id}`} style={{ color: '#1E3A8A', fontWeight: 600 }}>#{b.id}</Link>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '.88rem', fontWeight: 500 }}>
                    {b.contactName}
                    <div style={{ fontSize: '.78rem', color: '#9CA3AF' }}>{b.contactPhone}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '.85rem' }}>
                    {b.line.name}
                    <div style={{ fontSize: '.75rem', color: '#9CA3AF' }}>{b.line.region}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '.82rem' }}>{b.experimentType || '-'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '.82rem' }}>{b.preferredDate || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '.75rem', padding: '3px 8px', borderRadius: 4, background: st.bg, color: st.color, fontWeight: 600 }}>{st.label}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <BookingActions id={b.id} currentStatus={b.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
