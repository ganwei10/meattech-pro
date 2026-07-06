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

interface Favorite {
  id: number;
  targetType: string;
  targetId: number;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'bookings' | 'bills' | 'favorites'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
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
    const [bRes, blRes, fRes] = await Promise.all([
      fetch('/api/me/bookings'),
      fetch('/api/me/bills'),
      fetch('/api/favorites'),
    ]);
    if (bRes.ok) {
      const d = await bRes.json();
      setBookings(d.bookings || []);
    }
    if (blRes.ok) {
      const d = await blRes.json();
      setBills(d.bills || []);
    }
    if (fRes.ok) {
      const d = await fRes.json();
      setFavorites(d.favorites || []);
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
      <div className="bg-white border-b border-[#E5E7EB] py-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg md:text-xl font-extrabold text-[#1E3A8A] no-underline">🥩 MeatTech Pro</Link>
            <span className="text-[#D1D5DB]">|</span>
            <span className="text-sm md:text-base font-semibold text-[#374151]">用户中心</span>
          </div>
          <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-[#6B7280]">
            <span className="hidden sm:inline">{user?.name || user?.email}</span>
            <button onClick={() => { document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; router.push('/'); }} className="bg-none border-none text-[#EF4444] cursor-pointer text-xs md:text-sm">退出</button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm">
            <div className="text-xs md:text-sm text-[#6B7280] mb-1">我的预约</div>
            <div className="text-2xl md:text-3xl font-extrabold text-[#1E3A8A]">{bookings.length}</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm">
            <div className="text-xs md:text-sm text-[#6B7280] mb-1">我的账单</div>
            <div className="text-2xl md:text-3xl font-extrabold text-[#1E3A8A]">{bills.length}</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm">
            <div className="text-xs md:text-sm text-[#6B7280] mb-1">待支付</div>
            <div className="text-2xl md:text-3xl font-extrabold text-[#D97706]">{bills.filter(b => b.status === 'PENDING').length}</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm">
            <div className="text-xs md:text-sm text-[#6B7280] mb-1">我的收藏</div>
            <div className="text-2xl md:text-3xl font-extrabold text-[#1E3A8A]">{favorites.length}</div>
          </div>
        </div>

        {/* Tab 切换 — horizontal scroll on mobile */}
        <div className="flex gap-0 mb-6 border-b-2 border-[#E5E7EB] overflow-x-auto">
          <button onClick={() => setActiveTab('bookings')} className="px-6 py-3 bg-none border-none text-sm font-bold whitespace-nowrap cursor-pointer" style={{
            color: activeTab === 'bookings' ? '#1E3A8A' : '#6B7280',
            borderBottom: activeTab === 'bookings' ? '2px solid #1E3A8A' : '2px solid transparent',
            marginTop: -2, flexShrink: 0,
          }}>📅 我的预约</button>
          <button onClick={() => setActiveTab('bills')} className="px-6 py-3 bg-none border-none text-sm font-bold whitespace-nowrap cursor-pointer" style={{
            color: activeTab === 'bills' ? '#1E3A8A' : '#6B7280',
            borderBottom: activeTab === 'bills' ? '2px solid #1E3A8A' : '2px solid transparent',
            marginTop: -2, flexShrink: 0,
          }}>📄 我的账单</button>
          <button onClick={() => setActiveTab('favorites')} className="px-6 py-3 bg-none border-none text-sm font-bold whitespace-nowrap cursor-pointer" style={{
            color: activeTab === 'favorites' ? '#1E3A8A' : '#6B7280',
            borderBottom: activeTab === 'favorites' ? '2px solid #1E3A8A' : '2px solid transparent',
            marginTop: -2, flexShrink: 0,
          }}>❤️ 我的收藏</button>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2 text-sm text-[#374151] mb-3">
                          <div><span className="text-[#9CA3AF]">预约人：</span>{b.contactName}</div>
                          <div><span className="text-[#9CA3AF]">公司：</span>{b.company}</div>
                          <div><span className="text-[#9CA3AF]">期望日期：</span>{b.preferredDate || '待协商'}</div>
                          <div><span className="text-[#9CA3AF]">预约时间：</span>{new Date(b.createdAt).toLocaleDateString('zh-CN')}</div>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2 text-sm text-[#374151] mb-4">
                          <div><span className="text-[#9CA3AF]">客户：</span>{b.customerName}</div>
                          <div><span className="text-[#9CA3AF]">公司：</span>{b.company}</div>
                          <div><span className="text-[#9CA3AF]">产线费用：</span>¥{b.amount.toFixed(2)}</div>
                          <div><span className="text-[#9CA3AF]">服务费：</span>¥{b.serviceFee.toFixed(2)}</div>
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
            {/* 收藏列表 */}
            {activeTab === 'favorites' && (
              <div>
                {favorites.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 60, background: '#FFF', borderRadius: 12, color: '#9CA3AF' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>❤️</div>
                    <p>暂无收藏内容</p>
                    <p style={{ fontSize: '.85rem', marginTop: 8 }}>浏览<a href="/article" style={{ color: '#1E3A8A', fontWeight: 600 }}>技术文章</a>或<a href="/tool/pilot-map" style={{ color: '#1E3A8A', fontWeight: 600 }}>中试产线</a>，点击心形图标即可收藏</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {favorites.map(f => {
                      const isArticle = f.targetType === 'ARTICLE';
                      const isPilot = f.targetType === 'PILOT_LINE';
                      return (
                        <div key={f.id} style={{ background: '#FFF', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{
                              padding: '4px 10px', borderRadius: 8, fontSize: '.75rem', fontWeight: 600,
                              background: isArticle ? '#DBEAFE' : '#D1FAE5',
                              color: isArticle ? '#1E40AF' : '#065F46',
                            }}>
                              {isArticle ? '文章' : isPilot ? '产线' : f.targetType}
                            </span>
                            <span style={{ fontSize: '.9rem', color: '#374151' }}>
                              {isArticle ? `文章收藏 (ID: ${f.targetId})` : isPilot ? `产线收藏 (ID: ${f.targetId})` : `${f.targetType} #${f.targetId}`}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: '.78rem', color: '#9CA3AF' }}>{new Date(f.createdAt).toLocaleDateString('zh-CN')}</span>
                            {isPilot && (
                              <Link href={`/booking/${f.targetId}`} style={{
                                color: '#1E3A8A', fontWeight: 600, fontSize: '.85rem', textDecoration: 'none',
                                padding: '4px 14px', borderRadius: 6, background: '#EFF6FF',
                              }}>查看详情</Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
