'use client';

import { useState, useEffect } from 'react';

interface ReportData {
  year: number;
  bookings: {
    total: number;
    byStatus: { status: string; count: number }[];
    byMonth: { month: number; count: number; confirmed: number }[];
  };
  revenue: {
    total: number;
    pending: number;
    byMonth: { month: number; revenue: number; count: number }[];
  };
  lines: { id: number; name: string; bookings: number; revenue: number }[];
  customers: { total: number };
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: '待处理',
  CONFIRMED: '已确认',
  IN_PROGRESS: '执行中',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#F59E0B',
  CONFIRMED: '#059669',
  IN_PROGRESS: '#3B82F6',
  COMPLETED: '#6B7280',
  CANCELLED: '#DC2626',
};

const MONTH_NAMES = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?year=${year}`);
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [year]);

  if (loading) {
    return <div style={{ padding: 32, color: '#9CA3AF' }}>加载中...</div>;
  }

  if (!data) {
    return <div style={{ padding: 32, color: '#DC2626' }}>加载失败</div>;
  }

  const maxBookings = Math.max(...data.bookings.byMonth.map(m => m.count), 1);
  const maxRevenue = Math.max(...data.revenue.byMonth.map(m => m.revenue), 1);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E3A8A' }}>📈 报表统计</h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setYear(y => y - 1)} style={{ padding: '6px 12px', background: '#F3F4F6', border: 'none', borderRadius: 6, cursor: 'pointer' }}>←</button>
          <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{year}年</span>
          <button onClick={() => setYear(y => y + 1)} style={{ padding: '6px 12px', background: '#F3F4F6', border: 'none', borderRadius: 6, cursor: 'pointer' }}>→</button>
        </div>
      </div>

      {/* 总统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
          <div style={{ fontSize: '.85rem', color: '#6B7280', marginBottom: 4 }}>总预约数</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E3A8A' }}>{data.bookings.total}</div>
        </div>
        <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
          <div style={{ fontSize: '.85rem', color: '#6B7280', marginBottom: 4 }}>总营收（已支付）</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669' }}>¥{data.revenue.total.toFixed(2)}</div>
        </div>
        <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
          <div style={{ fontSize: '.85rem', color: '#6B7280', marginBottom: 4 }}>待收款</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D97706' }}>¥{data.revenue.pending.toFixed(2)}</div>
        </div>
        <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
          <div style={{ fontSize: '.85rem', color: '#6B7280', marginBottom: 4 }}>客户总数</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3B82F6' }}>{data.customers.total}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* 月度预约趋势 */}
        <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: 16 }}>月度预约趋势</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MONTH_NAMES.slice(1).map((name, i) => {
              const monthData = data.bookings.byMonth.find(m => m.month === i + 1);
              const count = monthData?.count || 0;
              const confirmed = monthData?.confirmed || 0;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 40, fontSize: '.8rem', color: '#6B7280', textAlign: 'right' }}>{name}</div>
                  <div style={{ flex: 1, height: 24, background: '#F3F4F6', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: `${(count / maxBookings) * 100}%`,
                        background: '#1E3A8A',
                        borderRadius: 4,
                        transition: 'width .3s',
                      }}
                    />
                    {confirmed > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          height: '100%',
                          width: `${(confirmed / maxBookings) * 100}%`,
                          background: '#059669',
                          borderRadius: 4,
                          transition: 'width .3s',
                        }}
                      />
                    )}
                  </div>
                  <div style={{ width: 40, fontSize: '.8rem', color: '#374151', fontWeight: 600 }}>{count}</div>
                </div>
              );
            })}
            <div style={{ fontSize: '.75rem', color: '#9CA3AF', marginTop: 8 }}>
              <span style={{ display: 'inline-block', width: 12, height: 12, background: '#1E3A8A', borderRadius: 2, marginRight: 4 }}></span>总预约
              <span style={{ display: 'inline-block', width: 12, height: 12, background: '#059669', borderRadius: 2, marginLeft: 12, marginRight: 4 }}></span>已确认
            </div>
          </div>
        </div>

        {/* 月度营收趋势 */}
        <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: 16 }}>月度营收趋势</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MONTH_NAMES.slice(1).map((name, i) => {
              const monthData = data.revenue.byMonth.find(m => m.month === i + 1);
              const revenue = monthData?.revenue || 0;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 40, fontSize: '.8rem', color: '#6B7280', textAlign: 'right' }}>{name}</div>
                  <div style={{ flex: 1, height: 24, background: '#F3F4F6', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: `${revenue / maxRevenue * 100}%`,
                        background: '#059669',
                        borderRadius: 4,
                        transition: 'width .3s',
                      }}
                    />
                  </div>
                  <div style={{ width: 80, fontSize: '.8rem', color: '#374151', fontWeight: 600, textAlign: 'right' }}>¥{revenue.toFixed(0)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* 预约状态分布 */}
        <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: 16 }}>预约状态分布</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.bookings.byStatus.map(s => (
              <div key={s.status} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: STATUS_COLORS[s.status] || '#9CA3AF' }} />
                <div style={{ flex: 1, fontSize: '.9rem', color: '#374151' }}>{STATUS_LABELS[s.status] || s.status}</div>
                <div style={{ fontSize: '.9rem', fontWeight: 600, color: '#1E3A8A' }}>{s.count}</div>
                <div style={{ width: 60, height: 8, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${(s.count / data.bookings.total) * 100}%`, height: '100%', background: STATUS_COLORS[s.status] || '#9CA3AF' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 产线利用率 */}
        <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: 16 }}>产线利用率排名</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.lines.slice(0, 8).map((line, idx) => (
              <div key={line.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: idx < 3 ? '#1E3A8A' : '#E5E7EB', color: idx < 3 ? '#fff' : '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.8rem', fontWeight: 600 }}>{idx + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '.9rem', fontWeight: 500, color: '#374151' }}>{line.name}</div>
                  <div style={{ fontSize: '.78rem', color: '#9CA3AF' }}>¥{line.revenue.toFixed(0)} 营收 · {line.bookings} 次预约</div>
                </div>
                <div style={{ fontSize: '.9rem', fontWeight: 600, color: '#1E3A8A' }}>{line.bookings}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
