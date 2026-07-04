import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const regionMap: Record<string, { lat: number; lng: number; name: string }> = {
  '华北': { lat: 39.9, lng: 116.4, name: '北京' },
  '华东': { lat: 31.2, lng: 121.5, name: '上海' },
  '华南': { lat: 23.1, lng: 113.3, name: '广州' },
  '华中': { lat: 30.6, lng: 114.3, name: '武汉' },
  '西南': { lat: 30.7, lng: 104.1, name: '成都' },
  '东北': { lat: 41.8, lng: 123.4, name: '沈阳' },
  '西北': { lat: 34.3, lng: 108.9, name: '西安' },
};

export const dynamic = 'force-dynamic';

export default async function PilotMapPage() {
  const lines = await prisma.pilotLine.findMany({ orderBy: { createdAt: 'desc' } });
  const regions = Array.from(new Set(lines.map(l => l.region)));

  return (
    <>
      <Header />
      <section style={{ padding: '40px 0', background: '#F3F4F6', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ marginBottom: 32 }}>
            <Link href="/" style={{ color: '#1E3A8A', fontSize: '.9rem', textDecoration: 'none' }}>← 返回首页</Link>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E3A8A', marginTop: 12 }}>🗺️ 全国肉类共享中试产线地图</h1>
            <p style={{ color: '#6B7280', marginTop: 8 }}>在线预约闲置产能，轻资产研发。点击产线查看详情并在线预约。</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
            {/* 侧边栏 - 地区和筛选 */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', height: 'fit-content', position: 'sticky', top: 20 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, color: '#1E3A8A' }}>地区筛选</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <a href="#all" style={{ padding: '8px 12px', borderRadius: 8, cursor: 'pointer', background: '#DBEAFE', color: '#1E3A8A', fontSize: '.9rem', fontWeight: 600, textDecoration: 'none' }}>
                  全部地区 ({lines.length})
                </a>
                {regions.map((r: string) => (
                  <a key={r} href={`#region-${r}`} style={{ padding: '8px 12px', borderRadius: 8, cursor: 'pointer', background: 'transparent', color: '#374151', fontSize: '.9rem', fontWeight: 400, textDecoration: 'none' }}>
                    {r} ({lines.filter((l: any) => l.region === r).length})
                  </a>
                ))}
              </div>

              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #E5E7EB' }}>
                <h4 style={{ fontSize: '.9rem', fontWeight: 600, marginBottom: 12, color: '#374151' }}>状态说明</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: '.85rem', color: '#059669' }}>● 有档期 - 可直接预约</div>
                  <div style={{ fontSize: '.85rem', color: '#D97706' }}>● 需预约 - 联系后安排</div>
                </div>
              </div>
            </div>

            {/* 主内容 - 产线卡片网格 */}
            <div>
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '.9rem', color: '#6B7280' }}>共找到 <strong>{lines.length}</strong> 条产线</div>
              </div>

              {lines.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center', color: '#9CA3AF' }}>
                  暂无产线数据，请管理员先添加产线。
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                  {lines.map(line => (
                    <div key={line.id} style={{
                      background: '#fff', borderRadius: 12, padding: 20,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB',
                      transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: 20, fontSize: '.78rem', fontWeight: 600,
                          background: line.status === 'AVAILABLE' ? '#D1FAE5' : '#FEF3C7',
                          color: line.status === 'AVAILABLE' ? '#065F46' : '#92400E',
                        }}>
                          {line.status === 'AVAILABLE' ? '● 有档期' : '● 需预约'}
                        </span>
                        <span style={{ fontSize: '.8rem', color: '#6B7280' }}>{line.region}</span>
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1E3A8A', marginBottom: 8 }}>{line.name}</h3>
                      {line.specs && (
                        <div style={{ fontSize: '.85rem', color: '#374151', marginBottom: 6 }}>📐 {line.specs}</div>
                      )}
                      {line.equipment && (
                        <div style={{ fontSize: '.85rem', color: '#374151', marginBottom: 6 }}>🛠️ {line.equipment}</div>
                      )}
                      {line.pricePerDay > 0 && (
                        <div style={{ fontSize: '.85rem', color: '#059669', marginBottom: 6, fontWeight: 600 }}>
                          💰 {line.pricePerDay}元/天
                        </div>
                      )}
                      <div style={{ fontSize: '.82rem', color: '#9CA3F', marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {line.contactPerson && <span>👤 {line.contactPerson}</span>}
                        {line.contactPhone && <span>📞 {line.contactPhone}</span>}
                      </div>
                      <Link href={`/booking/${line.id}`} style={{
                        display: 'block', marginTop: 16, padding: '8px 0', textAlign: 'center',
                        background: '#1E3A8A', color: '#fff', borderRadius: 8, fontSize: '.88rem',
                        textDecoration: 'none', fontWeight: 600,
                      }}>
                        立即预约 →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
