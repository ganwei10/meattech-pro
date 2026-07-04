import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminPilotLines() {
  const lines = await prisma.pilotLine.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>中试产线管理</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {lines.map(line => (
          <div key={line.id} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: '.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#DBEAFE', color: '#1E3A8A' }}>{line.region}</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginTop: 8 }}>{line.name}</h3>
              </div>
              <span style={{ fontSize: '.78rem', fontWeight: 600, padding: '4px 12px', borderRadius: 12, background: line.status === 'AVAILABLE' ? '#D1FAE5' : '#FEF3C7', color: line.status === 'AVAILABLE' ? '#065F46' : '#92400E' }}>{line.status === 'AVAILABLE' ? '● 有档期' : '● 需预约'}</span>
            </div>
            <p style={{ fontSize: '.82rem', color: '#6B7280', lineHeight: 1.6 }}>{line.specs || '暂无设备规格信息'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
