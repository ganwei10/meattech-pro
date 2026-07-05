import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GB2760Calculator from '@/components/GB2760Calculator';
import { getSiteGlobalConfig } from '@/lib/siteConfig';

export const dynamic = 'force-dynamic';

export default async function GB2760Page() {
  const config = await getSiteGlobalConfig();
  const t = config.tools.gb2760;

  return (
    <>
      <Header />
      <div className="container" style={{ paddingTop: 100, paddingBottom: 60, minHeight: '80vh' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1E3A8A', marginBottom: 8 }}>{t.title}</h1>
          <p style={{ color: '#6B7280', fontSize: '.95rem' }}>{t.subtitle}</p>
        </div>
        <GB2760Calculator />
        <div style={{ marginTop: 40, padding: 20, background: '#FEF3C7', borderRadius: 12, fontSize: '.82rem', color: '#92400E', lineHeight: 1.6 }}>
          {t.disclaimer}
        </div>
      </div>
      <Footer />
    </>
  );
}
