import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TroubleshootEngine from '@/components/TroubleshootEngine';

export const dynamic = 'force-dynamic';

export default function TroubleshootPage() {
  return (
    <>
      <Header />
      <div className="container" style={{ paddingTop: 100, paddingBottom: 60, minHeight: '80vh', maxWidth: 800 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1E3A8A', marginBottom: 8 }}>🚨 车间故障智能排查矩阵</h1>
          <p style={{ color: '#6B7280', fontSize: '.95rem' }}>10分钟快速排查出水、出油、散碎、色泽等常见肉制品生产故障</p>
        </div>
        <TroubleshootEngine />
      </div>
      <Footer />
    </>
  );
}
