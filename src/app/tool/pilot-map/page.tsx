import Link from 'next/link';
import { safeFindPilotLines } from '@/lib/safeQuery';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

const typeConfig: Record<string, { label: string; icon: string; color: string; bg: string; desc: string }> = {
  UNIVERSITY: { label: '高校及科研院所', icon: '🎓', color: '#1E3A8A', bg: '#DBEAFE', desc: '技术权威型 · 适合硬核改性、CRO研发' },
  PARK: { label: '产业园与公共平台', icon: '🏭', color: '#065F46', bg: '#D1FAE5', desc: '政策支持型 · 适合轻资产初创品牌' },
  ENTERPRISE: { label: '辅料企业演示中心', icon: '🧪', color: '#92400E', bg: '#FEF3C7', desc: '商业敏锐型 · 适合爆款逆向、快速打样' },
};

export default async function PilotMapPage() {
  const lines = await safeFindPilotLines('asc');

  const universities = lines.filter(l => l.type === 'UNIVERSITY' || (!l.type && l.name.includes('大学')));
  const parks = lines.filter(l => l.type === 'PARK');
  const enterprises = lines.filter(l => l.type === 'ENTERPRISE');
  const others = lines.filter(l => l.type !== 'UNIVERSITY' && l.type !== 'PARK' && l.type !== 'ENTERPRISE' && !l.name.includes('大学'));

  const regions = Array.from(new Set(lines.map(l => l.region)));

  return (
    <>
      <Header />
      <section style={{ paddingTop: 100, paddingBottom: 60, background: '#F3F4F6', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <Link href="/" style={{ color: '#1E3A8A', fontSize: '.9rem', textDecoration: 'none' }}>← 返回首页</Link>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E3A8A', marginTop: 12 }}>🗺️ 华南共享中试基地地图</h1>
            <p style={{ color: '#6B7280', marginTop: 8, maxWidth: 700 }}>
              粤港澳大湾区作为中国预制菜、速冻调制肉制品及休闲肉制品的研发和消费核心引擎，集中了大量顶尖的食品院校、地方质检研究院以及实力雄厚的辅料巨头。以下机构均具备极强的肉类中试能力，适合作为您的合作伙伴。
            </p>
          </div>

          {/* Stats bar */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
            <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1E3A8A' }}>{lines.length}</div>
              <div style={{ fontSize: '.82rem', color: '#6B7280' }}>中试机构总数</div>
            </div>
            <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1E3A8A' }}>{universities.length}</div>
              <div style={{ fontSize: '.82rem', color: '#6B7280' }}>高校及科研院所</div>
            </div>
            <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#065F46' }}>{parks.length}</div>
              <div style={{ fontSize: '.82rem', color: '#6B7280' }}>产业园公共平台</div>
            </div>
            <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#92400E' }}>{enterprises.length}</div>
              <div style={{ fontSize: '.82rem', color: '#6B7280' }}>辅料企业中心</div>
            </div>
          </div>

          {/* Section 1: Universities */}
          {universities.length > 0 && (
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: typeConfig.UNIVERSITY.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🎓</div>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E3A8A', margin: 0 }}>高校及科研院所</h2>
                  <p style={{ fontSize: '.85rem', color: '#6B7280', margin: '4px 0 0 0' }}>技术权威型 · 适合硬核改性、CRO研发</p>
                </div>
                <div style={{ marginLeft: 'auto', background: '#FEF3C7', color: '#92400E', padding: '6px 14px', borderRadius: 20, fontSize: '.8rem', fontWeight: 600 }}>
                  💡 找专家、做大改动 → 走CRO高客单价分成
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                {universities.map(line => (
                  <PilotCard key={line.id} line={line} typeKey="UNIVERSITY" />
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Parks */}
          {parks.length > 0 && (
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: typeConfig.PARK.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🏭</div>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#065F46', margin: 0 }}>产业园与公共服务平台</h2>
                  <p style={{ fontSize: '.85rem', color: '#6B7280', margin: '4px 0 0 0' }}>政策支持型 · 适合轻资产初创品牌</p>
                </div>
                <div style={{ marginLeft: 'auto', background: '#D1FAE5', color: '#065F46', padding: '6px 14px', borderRadius: 20, fontSize: '.8rem', fontWeight: 600 }}>
                  💡 初创品牌、预制菜试错 → 走标准场租抽佣
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                {parks.map(line => (
                  <PilotCard key={line.id} line={line} typeKey="PARK" />
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Enterprises */}
          {enterprises.length > 0 && (
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: typeConfig.ENTERPRISE.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🧪</div>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#92400E', margin: 0 }}>辅料及添加剂企业演示中心</h2>
                  <p style={{ fontSize: '.85rem', color: '#6B7280', margin: '4px 0 0 0' }}>商业敏锐型 · 适合爆款逆向、快速打样</p>
                </div>
                <div style={{ marginLeft: 'auto', background: '#FEF3C7', color: '#92400E', padding: '6px 14px', borderRadius: 20, fontSize: '.8rem', fontWeight: 600 }}>
                  💡 调风味、做爆款逆向 → 辅料带货+产线开放
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                {enterprises.map(line => (
                  <PilotCard key={line.id} line={line} typeKey="ENTERPRISE" />
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Others (legacy lines without type) */}
          {others.length > 0 && (
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📦</div>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#374151', margin: 0 }}>其他中试产线</h2>
                  <p style={{ fontSize: '.85rem', color: '#6B7280', margin: '4px 0 0 0' }}>已入驻的共享产线资源</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                {others.map(line => (
                  <PilotCard key={line.id} line={line} typeKey="UNIVERSITY" />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {lines.length === 0 && (
            <div style={{ background: '#fff', borderRadius: 12, padding: 60, textAlign: 'center', color: '#9CA3AF' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🗺️</div>
              <p style={{ fontSize: '1rem', marginBottom: 8 }}>暂无中试机构数据</p>
              <p style={{ fontSize: '.85rem', marginBottom: 20 }}>请管理员访问 /api/setup 初始化数据，或在后台添加产线。</p>
            </div>
          )}

          {/* CTA */}
          <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)', borderRadius: 16, padding: '32px 40px', textAlign: 'center', color: '#fff' }}>
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

function PilotCard({ line, typeKey }: { line: any; typeKey: string }) {
  const config = typeConfig[typeKey];
  return (
    <div style={{
      background: '#fff', borderRadius: 12, overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB',
      transition: 'all 0.2s', display: 'flex', flexDirection: 'column',
    }}>
      {/* Card header */}
      <div style={{ padding: '20px 20px 0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{
            padding: '4px 10px', borderRadius: 20, fontSize: '.75rem', fontWeight: 600,
            background: config.bg, color: config.color,
          }}>
            {config.icon} {config.label}
          </span>
          <span style={{
            padding: '3px 8px', borderRadius: 12, fontSize: '.72rem', fontWeight: 600,
            background: line.status === 'AVAILABLE' ? '#D1FAE5' : '#FEF3C7',
            color: line.status === 'AVAILABLE' ? '#065F46' : '#92400E',
          }}>
            ● {line.status === 'AVAILABLE' ? '有档期' : '需预约'}
          </span>
        </div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1F2937', marginBottom: 6, lineHeight: 1.4 }}>{line.name}</h3>
        <div style={{ fontSize: '.8rem', color: '#9CA3AF', marginBottom: 12 }}>📍 {line.region} · {line.capacity || '产能面议'}</div>
      </div>

      {/* Advantages */}
      {line.advantages && (
        <div style={{ padding: '0 20px', marginBottom: 12 }}>
          <div style={{ fontSize: '.78rem', fontWeight: 700, color: '#6B7280', marginBottom: 4 }}>✨ 核心优势</div>
          <p style={{ fontSize: '.85rem', color: '#374151', lineHeight: 1.6 }}>{line.advantages.length > 120 ? line.advantages.slice(0, 120) + '...' : line.advantages}</p>
        </div>
      )}

      {/* Equipment tags */}
      {line.equipment && (
        <div style={{ padding: '0 20px', marginBottom: 12 }}>
          <div style={{ fontSize: '.78rem', fontWeight: 700, color: '#6B7280', marginBottom: 6 }}>🛠️ 设备配置</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {line.equipment.split(',').slice(0, 4).map((eq: string, i: number) => (
              <span key={i} style={{ fontSize: '.72rem', padding: '2px 8px', borderRadius: 4, background: '#F3F4F6', color: '#374151' }}>{eq.trim()}</span>
            ))}
          </div>
        </div>
      )}

      {/* Cooperation model */}
      {line.cooperationModel && (
        <div style={{ padding: '0 20px', marginBottom: 16 }}>
          <div style={{ fontSize: '.78rem', fontWeight: 700, color: '#6B7280', marginBottom: 4 }}>🤝 合作模式</div>
          <p style={{ fontSize: '.82rem', color: line.cooperationModel.includes('CRO') ? '#1E3A8A' : line.cooperationModel.includes('场租') ? '#065F46' : '#92400E', lineHeight: 1.5, fontWeight: 500 }}>
            {line.cooperationModel.length > 80 ? line.cooperationModel.slice(0, 80) + '...' : line.cooperationModel}
          </p>
        </div>
      )}

      {/* Price */}
      {line.pricePerDay > 0 && (
        <div style={{ padding: '0 20px', marginBottom: 16 }}>
          <span style={{ fontSize: '.85rem', color: '#059669', fontWeight: 700 }}>💰 ¥{line.pricePerDay.toLocaleString()}/天</span>
          <span style={{ fontSize: '.75rem', color: '#9CA3AF', marginLeft: 8 }}>服务费 {line.serviceFeePercent}%</span>
        </div>
      )}

      {/* Actions */}
      <div style={{ marginTop: 'auto', padding: '0 20px 20px 20px', display: 'flex', gap: 8 }}>
        <Link href={`/booking/${line.id}`} style={{
          flex: 1, textAlign: 'center', padding: '10px 0',
          background: '#1E3A8A', color: '#fff', borderRadius: 8, fontSize: '.88rem',
          textDecoration: 'none', fontWeight: 600,
        }}>
          立即预约 →
        </Link>
      </div>
    </div>
  );
}
