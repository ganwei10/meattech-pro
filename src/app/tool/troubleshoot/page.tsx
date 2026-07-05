import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TroubleshootEngine from '@/components/TroubleshootEngine';
import { getSiteGlobalConfig } from '@/lib/siteConfig';

export const dynamic = 'force-dynamic';

export default async function TroubleshootPage() {
  const config = await getSiteGlobalConfig();
  const t = config.tools.troubleshoot;

  return (
    <>
      <Header />
      <div className="container" style={{ paddingTop: 100, paddingBottom: 60, minHeight: '80vh', maxWidth: 800 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1E3A8A', marginBottom: 8 }}>{t.title}</h1>
          <p style={{ color: '#6B7280', fontSize: '.95rem' }}>{t.subtitle}</p>
        </div>
        <TroubleshootEngine />
      </div>
      <Footer />
    </>
  );
}
