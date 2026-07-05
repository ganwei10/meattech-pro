import Link from 'next/link';
import { safeFindPilotLines } from '@/lib/safeQuery';
import { prisma } from '@/lib/prisma';
import { getSiteGlobalConfig } from '@/lib/siteConfig';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PilotMapTabs from './PilotMapTabs';

export const dynamic = 'force-dynamic';

const typeConfig: Record<string, { label: string; icon: string; color: string; bg: string; desc: string; model: string }> = {
  UNIVERSITY: { label: '高校及科研院所', icon: '🎓', color: '#1E3A8A', bg: '#DBEAFE', desc: '技术权威型 · 适合硬核改性、CRO研发', model: '💡 找专家、做大改动 → 走CRO高客单价分成' },
  PARK: { label: '产业园与公共平台', icon: '🏭', color: '#065F46', bg: '#D1FAE5', desc: '政策支持型 · 适合轻资产初创品牌', model: '💡 初创品牌、预制菜试错 → 走标准场租抽佣' },
  ENTERPRISE: { label: '辅料企业演示中心', icon: '🧪', color: '#92400E', bg: '#FEF3C7', desc: '商业敏锐型 · 适合爆款逆向、快速打样', model: '💡 调风味、做爆款逆向 → 辅料带货+产线开放' },
};

export default async function PilotMapPage() {
  const lines = await safeFindPilotLines('asc');
  const globalConfig = await getSiteGlobalConfig();
  const pilotIntro = globalConfig.tools.pilotMap.mapIntro;
  const pageTitle = globalConfig.tools.pilotMap.title;
  const pageSubtitle = globalConfig.tools.pilotMap.subtitle;

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
            <Link href="/" style={{ color: '#1E3A8A', fontSize: '.9rem', textDecoration: 'none' }}>← 返回首页</Link>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E3A8A', marginTop: 12 }}>{pageTitle}</h1>
            <p style={{ color: '#6B7280', marginTop: 8, maxWidth: 800, lineHeight: 1.7 }}>
              {pageSubtitle} {pilotIntro}
            </p>
          </div>

          {/* Stats bar */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px', background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1E3A8A' }}>{lines.length}</div>
              <div style={{ fontSize: '.82rem', color: '#6B7280' }}>中试机构总数</div>
            </div>
            <div style={{ flex: '1 1 200px', background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1E3A8A' }}>{activeRegions.length}</div>
              <div style={{ fontSize: '.82rem', color: '#6B7280' }}>覆盖区域</div>
            </div>
            <div style={{ flex: '1 1 200px', background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1E3A8A' }}>{allUniversities.length}</div>
              <div style={{ fontSize: '.82rem', color: '#6B7280' }}>高校及科研院所</div>
            </div>
            <div style={{ flex: '1 1 200px', background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#065F46' }}>{allParks.length}</div>
              <div style={{ fontSize: '.82rem', color: '#6B7280' }}>产业园公共平台</div>
            </div>
            <div style={{ flex: '1 1 200px', background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#92400E' }}>{allEnterprises.length}</div>
              <div style={{ fontSize: '.82rem', color: '#6B7280' }}>辅料企业中心</div>
            </div>
          </div>

          {/* Three cooperation models */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            <div style={{ background: '#DBEAFE', borderRadius: 12, padding: 20, border: '1px solid #BFDBFE' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>🎓</div>
              <h4 style={{ fontSize: '.95rem', fontWeight: 800, color: '#1E3A8A', marginBottom: 4 }}>找专家、做大改动</h4>
              <p style={{ fontSize: '.8rem', color: '#374151', margin: 0 }}>高校科研院所 · CRO高客单价分成</p>
            </div>
            <div style={{ background: '#D1FAE5', borderRadius: 12, padding: 20, border: '1px solid #A7F3D0' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>🏭</div>
              <h4 style={{ fontSize: '.95rem', fontWeight: 800, color: '#065F46', marginBottom: 4 }}>初创品牌、预制菜试错</h4>
              <p style={{ fontSize: '.8rem', color: '#374151', margin: 0 }}>产业园公共平台 · 标准场租抽佣</p>
            </div>
            <div style={{ background: '#FEF3C7', borderRadius: 12, padding: 20, border: '1px solid #FDE68A' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>🧪</div>
              <h4 style={{ fontSize: '.95rem', fontWeight: 800, color: '#92400E', marginBottom: 4 }}>调风味、做爆款逆向</h4>
              <p style={{ fontSize: '.8rem', color: '#374151', margin: 0 }}>辅料企业演示中心 · 辅料带货+产线开放</p>
            </div>
          </div>

          {/* Region tabs + institution display (client component) */}
          <PilotMapTabs regions={activeRegions} regionMap={regionMap} typeConfig={typeConfig} />

          {/* Empty state */}
          {lines.length === 0 && (
            <div style={{ background: '#fff', borderRadius: 12, padding: 60, textAlign: 'center', color: '#9CA3AF' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🗺️</div>
              <p style={{ fontSize: '1rem', marginBottom: 8 }}>暂无中试机构数据</p>
              <p style={{ fontSize: '.85rem', marginBottom: 20 }}>请管理员访问 /api/setup 初始化数据，或在后台添加产线。</p>
            </div>
          )}

          {/* CTA */}
          <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)', borderRadius: 16, padding: '32px 40px', textAlign: 'center', color: '#fff', marginTop: 40 }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>找不到合适的机构？</h3>
            <p style={{ fontSize: '.9rem', opacity: .8, marginBottom: 20 }}>提交您的中试需求，平台专家1对1跟进，为您匹配最佳合作伙伴</p>
            <Link href="/booking" style={{ display: 'inline-block', background: '#fff', color: '#1E3A8A', padding: '12px 32px', borderRadius: 8, fontSize: '.95rem', fontWeight: 700, textDecoration: 'none' }}>
              立即提交中试需求 →
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
