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
      <div className="container pt-20 md:pt-24 pb-12 md:pb-16 min-h-[80vh] max-w-4xl">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E3A8A] mb-2">{t.title}</h1>
          <p className="text-[#6B7280] text-sm md:text-base">{t.subtitle}</p>
        </div>
        <TroubleshootEngine />
      </div>
      <Footer />
    </>
  );
}
