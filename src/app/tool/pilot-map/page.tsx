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
      <section style={{ paddingTop: 100, paddingBottom: 60, background: '#F3F4F6', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <Link href="/" style={{ color: '#1E3A8A', fontSize: '.9rem', textDecoration: 'none' }}>{pm.backToHome}</Link>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E3A8A', marginTop: 12 }}>{pm.title}</h1>
            <p style={{ color: '#6B7280', marginTop: 8, maxWidth: 800, lineHeight: 1.7 }}>
              {pm.subtitle} {pm.mapIntro}
            </p>
          </div>

          {/* Stats bar */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px', background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1E3A8A' }}>{lines.length}</div>
              <div style={{ fontSize: '.82rem', color: '#6B7280' }}>{pm.statsLabels.total}</div>
            </div>
            <div style={{ flex: '1 1 200px', background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1E3A8A' }}>{activeRegions.length}</div>
              <div style={{ fontSize: '.82rem', color: '#6B7280' }}>{pm.statsLabels.regions}</div>
            </div>
            <div style={{ flex: '1 1 200px', background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1E3A8A' }}>{allUniversities.length}</div>
              <div style={{ fontSize: '.82rem', color: '#6B7280' }}>{pm.statsLabels.universities}</div>
            </div>
            <div style={{ flex: '1 1 200px', background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#065F46' }}>{allParks.length}</div>
              <div style={{ fontSize: '.82rem', color: '#6B7280' }}>{pm.statsLabels.parks}</div>
            </div>
            <div style={{ flex: '1 1 200px', background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#92400E' }}>{allEnterprises.length}</div>
              <div style={{ fontSize: '.82rem', color: '#6B7280' }}>{pm.statsLabels.enterprises}</div>
            </div>
          </div>

          {/* Three cooperation models */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            {pm.cooperationModels.map((model, i) => (
              <div key={i} style={{ background: model.bg, borderRadius: 12, padding: 20, border: `1px solid ${model.borderColor}` }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{model.icon}</div>
                <h4 style={{ fontSize: '.95rem', fontWeight: 800, color: model.color, marginBottom: 4 }}>{model.title}</h4>
                <p style={{ fontSize: '.8rem', color: '#374151', margin: 0 }}>{model.desc}</p>
              </div>
            ))}
          </div>

          {/* Region tabs + institution display (client component) */}
          <PilotMapTabs regions={activeRegions} regionMap={regionMap} typeConfig={pm.typeConfig} cardLabels={pm.cardLabels} />

          {/* Empty state */}
          {lines.length === 0 && (
            <div style={{ background: '#fff', borderRadius: 12, padding: 60, textAlign: 'center', color: '#9CA3AF' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>{pm.emptyState.icon}</div>
              <p style={{ fontSize: '1rem', marginBottom: 8 }}>{pm.emptyState.title}</p>
              <p style={{ fontSize: '.85rem', marginBottom: 20 }}>{pm.emptyState.desc}</p>
            </div>
          )}

          {/* CTA */}
          <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)', borderRadius: 16, padding: '32px 40px', textAlign: 'center', color: '#fff', marginTop: 40 }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>{pm.cta.title}</h3>
            <p style={{ fontSize: '.9rem', opacity: .8, marginBottom: 20 }}>{pm.cta.desc}</p>
            <Link href="/booking" style={{ display: 'inline-block', background: '#fff', color: '#1E3A8A', padding: '12px 32px', borderRadius: 8, fontSize: '.95rem', fontWeight: 700, textDecoration: 'none' }}>
              {pm.cta.btnText}
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
