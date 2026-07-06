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
        <div className="pt-20 md:pt-24 pb-12 md:pb-16 text-center min-h-[60vh]">
          <div className="text-4xl md:text-5xl mb-4">{bd.notFoundIcon}</div>
          <h1 className="text-lg md:text-xl font-bold text-[#6B7280]">{bd.notFoundTitle}</h1>
          <Link href="/booking" className="text-[#1E3A8A] font-semibold mt-4 inline-block">{bd.backToBooking}</Link>
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
        <div className="pt-20 md:pt-24 pb-12 md:pb-16 max-w-3xl mx-auto px-4">
        <Link href="/booking" className="text-[#6B7280] text-sm mb-4 inline-block">{bd.backBtn}</Link>
        <h1 className="text-xl md:text-2xl font-extrabold mb-6">{bd.title}</h1>

        <div className="bg-white rounded-2xl p-5 md:p-8 shadow-sm mb-6">
          <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-lg md:text-xl font-bold">{booking.line?.name || bd.lineUnavailable}</h2>
              <p className="text-sm text-[#6B7280] mt-1">{booking.line?.region || ''} {booking.line?.specs ? `| ${booking.line.specs}` : ''}</p>
            </div>
            <span className="text-xs px-3 py-1.5 rounded-lg font-bold" style={{ background: st.bg, color: st.color }}>{st.label}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
