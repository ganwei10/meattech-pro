import { safeFindBookingWithLine } from '@/lib/safeQuery';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReviewSection from '@/components/ReviewSection';
import { getSiteGlobalConfig } from '@/lib/siteConfig';

export const dynamic = 'force-dynamic';

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  const booking = await safeFindBookingWithLine(parseInt(params.id));
  const config = await getSiteGlobalConfig();
  const bd = config.bookingDetail;

  if (!booking) {
    return (
      <>
        <Header />
        <div style={{ paddingTop: 120, paddingBottom: 60, textAlign: 'center', minHeight: '60vh' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>{bd.notFoundIcon}</div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#6B7280' }}>{bd.notFoundTitle}</h1>
          <Link href="/booking" style={{ color: '#1E3A8A', fontWeight: 600, marginTop: 16, display: 'inline-block' }}>{bd.backToBooking}</Link>
        </div>
        <Footer />
      </>
    );
  }

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: bd.statusLabels.PENDING, color: '#92400E', bg: '#FEF3C7' },
    CONFIRMED: { label: bd.statusLabels.CONFIRMED, color: '#065F46', bg: '#D1FAE5' },
    IN_PROGRESS: { label: bd.statusLabels.IN_PROGRESS, color: '#1E40AF', bg: '#DBEAFE' },
    COMPLETED: { label: bd.statusLabels.COMPLETED, color: '#065F46', bg: '#D1FAE5' },
    CANCELLED: { label: bd.statusLabels.CANCELLED, color: '#991B1B', bg: '#FEE2E2' },
  };
  const st = statusMap[booking.status] || statusMap.PENDING;

  const fields = [
    { label: bd.fieldLabels.id, value: `#${booking.id}` },
    { label: bd.fieldLabels.contactName, value: booking.contactName },
    { label: bd.fieldLabels.contactPhone, value: booking.contactPhone },
    { label: bd.fieldLabels.contactEmail, value: booking.contactEmail || '—' },
    { label: bd.fieldLabels.company, value: booking.company || '—' },
    { label: bd.fieldLabels.experimentType, value: booking.experimentType || '—' },
    { label: bd.fieldLabels.preferredDate, value: booking.preferredDate || '—' },
    { label: bd.fieldLabels.createdAt, value: new Date(booking.createdAt).toLocaleString('zh-CN') },
  ];

  return (
    <>
      <Header />
      <div className="container" style={{ paddingTop: 120, paddingBottom: 60, maxWidth: 720 }}>
        <Link href="/booking" style={{ color: '#6B7280', fontSize: '.88rem', marginBottom: 16, display: 'inline-block' }}>{bd.backBtn}</Link>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 24 }}>{bd.title}</h1>

        <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{booking.line?.name || bd.lineUnavailable}</h2>
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
              <div style={{ fontSize: '.78rem', color: '#9CA3AF', marginBottom: 6 }}>{bd.requirementLabel}</div>
              <div style={{ fontSize: '.88rem', lineHeight: 1.6 }}>{booking.requirement}</div>
            </div>
          )}
          {booking.adminNote && (
            <div style={{ marginTop: 16, padding: 16, background: '#DBEAFE', borderRadius: 8 }}>
              <div style={{ fontSize: '.78rem', color: '#1E40AF', marginBottom: 6 }}>{bd.adminNoteLabel}</div>
              <div style={{ fontSize: '.88rem', lineHeight: 1.6, color: '#1E3A8A' }}>{booking.adminNote}</div>
            </div>
          )}
        </div>

        <ReviewSection bookingId={booking.id} />
      </div>
      <Footer />
    </>
  );
}
