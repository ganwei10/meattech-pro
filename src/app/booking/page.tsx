import { prisma } from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';

export const dynamic = 'force-dynamic';

export default async function BookingPage() {
  const lines = await prisma.pilotLine.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <>
      <Header />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E3A8A', marginBottom: '8px' }}>中试产线预约</h1>
        <p style={{ color: '#6B7280', marginBottom: '32px' }}>提交您的中试需求，平台专家将在24小时内1对1跟进</p>
        <BookingForm lines={lines.map(l => ({ id: l.id, name: l.name, region: l.region, status: l.status }))} />
      </div>
      <Footer />
    </>
  );
}
