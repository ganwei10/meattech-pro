import { safeFindBookingWithLine } from '@/lib/safeQuery';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  const booking = await safeFindBookingWithLine(parseInt(params.id));

  if (!booking) {
    return (
      <>
        <Header />
        <div style={{ paddingTop: 120, paddingBottom: 60, textAlign: 'center', minHeight: '60vh' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#6B7280' }}>预约记录不存在</h1>
          <Link href="/booking" style={{ color: '#1E3A8A', fontWeight: 600, marginTop: 16, display: 'inline-block' }}>← 返回预约页</Link>
        </div>
        <Footer />
      </>
    );
  }

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: '待处理', color: '#92400E', bg: '#FEF3C7' },
    CONFIRMED: { label: '已确认', color: '#065F46', bg: '#D1FAE5' },
    IN_PROGRESS: { label: '执行中', color: '#1E40AF', bg: '#DBEAFE' },
    COMPLETED: { label: '已完成', color: '#065F46', bg: '#D1FAE5' },
    CANCELLED: { label: '已取消', color: '#991B1B', bg: '#FEE2E2' },
  };
  const st = statusMap[booking.status] || statusMap.PENDING;

  const fields = [
    { label: '预约编号', value: `#${booking.id}` },
    { label: '联系人', value: booking.contactName },
    { label: '联系电话', value: booking.contactPhone },
    { label: '邮箱', value: booking.contactEmail || '—' },
    { label: '公司', value: booking.company || '—' },
    { label: '实验类型', value: booking.experimentType || '—' },
    { label: '期望日期', value: booking.preferredDate || '—' },
    { label: '提交时间', value: new Date(booking.createdAt).toLocaleString('zh-CN') },
  ];

  return (
    <>
      <Header />
      <div className="container" style={{ paddingTop: 120, paddingBottom: 60, maxWidth: 720 }}>
        <Link href="/booking" style={{ color: '#6B7280', fontSize: '.88rem', marginBottom: 16, display: 'inline-block' }}>← 返回预约页</Link>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 24 }}>预约详情</h1>

        <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{booking.line?.name || '产线信息不可用'}</h2>
              <p style={{ fontSize: '.85rem', color: '#6B7280', marginTop: 4 }}>{booking.line?.region || ''} {booking.line?.specs ? `| ${booking.line.specs}` : ''}</p>
            </div>
            <span style={{ fontSize: '.82rem', padding: '6px 14px', borderRadius: 8, background: st.bg, color: st.color, fontWeight: 700 }}>{st.label}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {fields.map(f => (
              <div key={f.label} style={{ padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ fontSize: '.78rem', color: '#9CA3AF', marginBottom: 4 }}>{f.label}</div>
                <div style={{ fontSize: '.92rem', fontWeight: 500 }}>{f.value}</div>
              </div>
            ))}
          </div>
          {booking.requirement && (
            <div style={{ marginTop: 20, padding: 16, background: '#F3F4F6', borderRadius: 8 }}>
              <div style={{ fontSize: '.78rem', color: '#9CA3AF', marginBottom: 6 }}>实验需求</div>
              <div style={{ fontSize: '.88rem', lineHeight: 1.6 }}>{booking.requirement}</div>
            </div>
          )}
          {booking.adminNote && (
            <div style={{ marginTop: 16, padding: 16, background: '#DBEAFE', borderRadius: 8 }}>
              <div style={{ fontSize: '.78rem', color: '#1E40AF', marginBottom: 6 }}>📋 平台备注</div>
              <div style={{ fontSize: '.88rem', lineHeight: 1.6, color: '#1E3A8A' }}>{booking.adminNote}</div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
