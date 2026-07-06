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
      <div className="container pt-20 md:pt-24 pb-12 md:pb-16 min-h-[80vh]">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E3A8A] mb-2">{t.title}</h1>
          <p className="text-[#6B7280] text-sm md:text-base">{t.subtitle}</p>
        </div>
        <GB2760Calculator />
        <div className="mt-8 md:mt-10 p-5 bg-[#FEF3C7] rounded-xl text-xs md:text-sm text-[#92400E] leading-relaxed">
          {t.disclaimer}
        </div>
      </div>
      <Footer />
    </>
  );
}
