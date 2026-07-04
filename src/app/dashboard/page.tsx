'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Booking {
  id: number;
  lineId: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  company: string;
  experimentType: string;
  requirement: string;
  preferredDate: string;
  status: string;
  adminNote: string;
  createdAt: string;
  line: { id: number; name: string; region: string };
}

interface Bill {
  id: number;
  bookingId: number;
  lineId: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  company: string;
  amount: number;
  serviceFee: number;
  totalAmount: number;
  status: string;
  billNo: string;
  createdAt: string;
  paidAt: string | null;
  line: { id: number; name: string };
  booking: { id: number; contactName: string };
}

export default function DashboardPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'bookings' | 'bills'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.user) {
          router.push('/login?redirect=/dashboard');
          return;
        }
        setUser(d.user);
        setChecking(false);
        loadData();
      })
      .catch(() => {
        router.push('/login?redirect=/dashboard');
      });
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    const [bRes, blRes] = await Promise.all([
      fetch('/api/me/bookings'),
      fetch('/api/me/bills'),
    ]);
    if (bRes.ok) {
      const d = await bRes.json();
      setBookings(d.bookings || []);
    }
    if (blRes.ok) {
      const d = await blRes.json();
      setBills(d.bills || []);
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      'PENDING': { label: '待确认', color: '#D97706' },
      'CONFIRMED': { label: '已确认', color: '#059669' },
      'IN_PROGRESS': { label: '进行中', color: '#2563EB' },
      'COMPLETED': { label: '已完成', color: '#059669' },
      'CANCELLED': { label: '已取消', color: '#DC2626' },
    };
    const s = map[status] || { label: status, color: '#6B7280' };
    return <span style={{ background: s.color + '20', color: s.color, padding: '2px 8px', borderRadius: 4, fontSize: '.75rem', fontWeight: 500 }}>{s.label}</span>;
  };

  const getBillStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      'PENDING': { label: '待支付', color: '#D97706' },
      'PAID': { label: '已支付', color: '#059669' },
      'CANCELLED': { label: '已取消', color: '#DC2626' },
    };
    const s = map[status] || { label: status, color: '#6B7280' };
    return <span style={{ background: s.color + '20', color: s.color, padding: '2px 8px', borderRadius: 4, fontSize: '.75rem', fontWeight: 500 }}>{s.label}</span>;
  };

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB' }}>
        <div style={{ color: '#9CA3AF', fontSize: '.95rem' }}>加载中...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      {/* 顶部 */}
      <div style={{ background: '#FFF', borderBottom: '1px solid #E5E7EB', padding: '16px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E3A8A', textDecoration: 'none' }}>🥩 MeatTech Pro</Link>
            <span style={{ color: '#D1D5DB' }}>|</span>
            <span style={{ fontSize: '.95rem', fontWeight: 600, color: '#374151' }}>用户中心</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '.9rem', color: '#6B7280' }}>
            <span>{user?.name || user?.email}</span>
            <button onClick={() => { document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; router.push('/'); }} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '.9rem' }}>退出</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* 统计卡片 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div style={{ background: '#FFF', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '.85rem', color: '#6B7280', marginBottom: 4 }}>我的预约</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E3A8A' }}>{bookings.length}</div>
          </div>
          <div style={{ background: '#FFF', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '.85rem', color: '#6B7280', marginBottom: 4 }}>我的账单</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E3A8A' }}>{bills.length}</div>
          </div>
          <div style={{ background: '#FFF', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '.85rem', color: '#6B7280', marginBottom: 4 }}>待支付</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D97706' }}>{bills.filter(b => b.status === 'PENDING').length}</div>
          </div>
        </div>

        {/* Tab 切换 */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '2px solid #E5E7EB' }}>
          <button onClick={() => setActiveTab('bookings')} style={{
            padding: '12px 24px', background: 'none', border: 'none', fontSize: '.95rem', fontWeight: activeTab === 'bookings' ? 700 : 400,
            color: activeTab === 'bookings' ? '#1E3A8A' : '#6B7280',
            borderBottom: activeTab === 'bookings' ? '2px solid #1E3A8A' : '2px solid transparent',
            cursor: 'pointer', marginTop: -2,
          }}>📅 我的预约</button>
          <button onClick={() => setActiveTab('bills')} style={{
            padding: '12px 24px', background: 'none', border: 'none', fontSize: '.95rem', fontWeight: activeTab === 'bills' ? 700 : 400,
            color: activeTab === 'bills' ? '#1E3A8A' : '#6B7280',
            borderBottom: activeTab === 'bills' ? '2px solid #1E3A8A' : '2px solid transparent',
            cursor: 'pointer', marginTop: -2,
          }}>📄 我的账单</button>
        </div>

        {loading ? <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>加载中...</div> : (
          <>
            {/* 预约列表 */}
            {activeTab === 'bookings' && (
              <div>
                {bookings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 60, background: '#FFF', borderRadius: 12, color: '#9CA3AF' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📅</div>
                    <p>暂无预约记录</p>
                    <Link href="/booking" style={{ color: '#1E3A8A', fontWeight: 600, marginTop: 12, display: 'inline-block' }}>立即预约中试产线 →</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {bookings.map(b => (
                      <div key={b.id} style={{ background: '#FFF', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                          <div>
                            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1E3A8A', marginBottom: 4 }}>{b.line.name}</div>
                            <div style={{ fontSize: '.85rem', color: '#6B7280' }}>{b.line.region} · {b.experimentType || '中试预约'}</div>
                          </div>
                          {getStatusBadge(b.status)}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', fontSize: '.85rem', color: '#374151', marginBottom: 12 }}>
                          <div><span style={{ color: '#9CA3AF' }}>预约人：</span>{b.contactName}</div>
                          <div><span style={{ color: '#9CA3AF' }}>公司：</span>{b.company}</div>
                          <div><span style={{ color: '#9CA3AF' }}>期望日期：</span>{b.preferredDate || '待协商'}</div>
                          <div><span style={{ color: '#9CA3AF' }}>预约时间：</span>{new Date(b.createdAt).toLocaleDateString('zh-CN')}</div>
                        </div>
                        {b.adminNote && (
                          <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 8, padding: '8px 12px', fontSize: '.85rem', color: '#0369A1' }}>
                            管理员备注：{b.adminNote}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 账单列表 */}
            {activeTab === 'bills' && (
              <div>
                {bills.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 60, background: '#FFF', borderRadius: 12, color: '#9CA3AF' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📄</div>
                    <p>暂无账单记录</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {bills.map(b => (
                      <div key={b.id} style={{ background: '#FFF', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                          <div>
                            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1E3A8A', marginBottom: 4 }}>账单 #{b.billNo}</div>
                            <div style={{ fontSize: '.85rem', color: '#6B7280' }}>{b.line.name}</div>
                          </div>
                          {getBillStatusBadge(b.status)}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', fontSize: '.85rem', color: '#374151', marginBottom: 16 }}>
                          <div><span style={{ color: '#9CA3AF' }}>客户：</span>{b.customerName}</div>
                          <div><span style={{ color: '#9CA3AF' }}>公司：</span>{b.company}</div>
                          <div><span style={{ color: '#9CA3AF' }}>产线费用：</span>¥{b.amount.toFixed(2)}</div>
                          <div><span style={{ color: '#9CA3AF' }}>服务费：</span>¥{b.serviceFee.toFixed(2)}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#059669' }}>总计：¥{b.totalAmount.toFixed(2)}</div>
                          {b.status === 'PENDING' && (
                            <Link href={`/bill/${b.id}/pay`} style={{
                              background: '#D97706', color: '#FFF', padding: '8px 20px', borderRadius: 8,
                              textDecoration: 'none', fontSize: '.9rem', fontWeight: 600
                            }}>去支付</Link>
                          )}
                          {b.status === 'PAID' && (
                            <div style={{ fontSize: '.85rem', color: '#059669' }}>已支付 {b.paidAt && new Date(b.paidAt).toLocaleDateString('zh-CN')}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
