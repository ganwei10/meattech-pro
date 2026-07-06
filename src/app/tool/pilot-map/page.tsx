import Link from 'next/link';
import { safeFindPilotLines } from '@/lib/safeQuery';
import { getSiteGlobalConfig } from '@/lib/siteConfig';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PilotMapTabs from './PilotMapTabs';

export const dynamic = 'force-dynamic';

export default async function PilotMapPage() {
  const lines = await safeFindPilotLines('asc');
  const globalConfig = await getSiteGlobalConfig();
  const pm = globalConfig.tools.pilotMap;

  // Group by region
  const regionOrder = ['华南', '华东', '华北', '华中', '西南', '东北', '其他'];
  const regionMap: Record<string, typeof lines> = {};
  for (const line of lines) {
    const r = regionOrder.includes(line.region) ? line.region : '其他';
    if (!regionMap[r]) regionMap[r] = [];
    regionMap[r].push(line);
  }
  const activeRegions = regionOrder.filter(r => regionMap[r] && regionMap[r].length > 0);

  // Overall stats
  const allUniversities = lines.filter(l => l.type === 'UNIVERSITY' || (!l.type && l.name.includes('大学')));
  const allParks = lines.filter(l => l.type === 'PARK');
  const allEnterprises = lines.filter(l => l.type === 'ENTERPRISE');

  return (
    <>
      <Header />
      <section className="pt-16 pb-16 md:pt-24 md:pb-16" style={{ background: '#F3F4F6', minHeight: '80vh' }}>
        <div className="container max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="text-[#1E3A8A] text-sm no-underline">{pm.backToHome}</Link>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E3A8A] mt-3">{pm.title}</h1>
            <p className="text-[#6B7280] mt-2 max-w-3xl leading-relaxed text-sm md:text-base">
              {pm.subtitle} {pm.mapIntro}
            </p>
          </div>

          {/* Stats bar — 2x2 grid on mobile, flex on desktop */}
          <div className="grid grid-cols-2 md:flex gap-4 mb-8 md:flex-wrap">
            <div className="md:flex-1 md:basis-[200px] bg-white rounded-xl p-4 md:p-5 shadow-sm">
              <div className="text-2xl md:text-3xl font-extrabold text-[#1E3A8A]">{lines.length}</div>
              <div className="text-xs md:text-sm text-[#6B7280]">{pm.statsLabels.total}</div>
            </div>
            <div className="md:flex-1 md:basis-[200px] bg-white rounded-xl p-4 md:p-5 shadow-sm">
              <div className="text-2xl md:text-3xl font-extrabold text-[#1E3A8A]">{activeRegions.length}</div>
              <div className="text-xs md:text-sm text-[#6B7280]">{pm.statsLabels.regions}</div>
            </div>
            <div className="md:flex-1 md:basis-[200px] bg-white rounded-xl p-4 md:p-5 shadow-sm">
              <div className="text-2xl md:text-3xl font-extrabold text-[#1E3A8A]">{allUniversities.length}</div>
              <div className="text-xs md:text-sm text-[#6B7280]">{pm.statsLabels.universities}</div>
            </div>
            <div className="md:flex-1 md:basis-[200px] bg-white rounded-xl p-4 md:p-5 shadow-sm">
              <div className="text-2xl md:text-3xl font-extrabold text-[#065F46]">{allParks.length}</div>
              <div className="text-xs md:text-sm text-[#6B7280]">{pm.statsLabels.parks}</div>
            </div>
            <div className="md:flex-1 md:basis-[200px] col-span-2 md:col-span-1 bg-white rounded-xl p-4 md:p-5 shadow-sm">
              <div className="text-2xl md:text-3xl font-extrabold text-[#92400E]">{allEnterprises.length}</div>
              <div className="text-xs md:text-sm text-[#6B7280]">{pm.statsLabels.enterprises}</div>
            </div>
          </div>

          {/* Three cooperation models */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {pm.cooperationModels.map((model, i) => (
              <div key={i} style={{ background: model.bg, borderRadius: 12, padding: 20, border: `1px solid ${model.borderColor}` }}>
                <div className="text-2xl md:text-3xl mb-1.5">{model.icon}</div>
                <h4 className="text-sm md:text-base font-extrabold mb-1" style={{ color: model.color }}>{model.title}</h4>
                <p className="text-xs md:text-sm text-[#374151] m-0">{model.desc}</p>
              </div>
            ))}
          </div>

          {/* Region tabs + institution display (client component) */}
          <PilotMapTabs regions={activeRegions} regionMap={regionMap} typeConfig={pm.typeConfig} cardLabels={pm.cardLabels} />

          {/* Empty state */}
          {lines.length === 0 && (
            <div className="bg-white rounded-xl p-10 md:p-16 text-center text-[#9CA3AF]">
              <div className="text-4xl md:text-5xl mb-4">{pm.emptyState.icon}</div>
              <p className="text-base mb-2">{pm.emptyState.title}</p>
              <p className="text-sm mb-5">{pm.emptyState.desc}</p>
            </div>
          )}

          {/* CTA */}
          <div className="rounded-2xl p-6 md:p-10 text-center text-white mt-8 md:mt-10" style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)' }}>
            <h3 className="text-xl md:text-2xl font-extrabold mb-2">{pm.cta.title}</h3>
            <p className="text-sm opacity-80 mb-5">{pm.cta.desc}</p>
            <Link href="/booking" className="inline-block bg-white text-[#1E3A8A] px-6 md:px-8 py-3 rounded-lg text-sm md:text-base font-bold no-underline">
              {pm.cta.btnText}
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
