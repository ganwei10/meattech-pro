'use client';

import { useState, useEffect } from 'react';

interface Customer {
  phone: string;
  name: string;
  email: string;
  company: string;
  firstBooking: string;
  lastBooking: string;
  totalBookings: number;
  confirmedBookings: number;
}

interface Booking {
  id: number;
  lineId: number;
  contactName: string;
  contactPhone: string;
  company: string;
  status: string;
  createdAt: string;
  line: { id: number; name: string };
}

interface Bill {
  id: number;
  bookingId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  line: { id: number; name: string };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(20);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [customerDetail, setCustomerDetail] = useState<{
    phone: string;
    bookings: Booking[];
    bills: Bill[];
    stats: { totalBookings: number; confirmedBookings: number; totalBills: number; totalSpent: number };
  } | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.set('keyword', keyword);
      params.set('page', String(page));

      const res = await fetch(`/api/admin/customers?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
        setTotal(data.total || 0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    loadCustomers();
  };

  const loadCustomerDetail = async (phone: string) => {
    setDetailLoading(true);
    setSelectedCustomer(phone);
    try {
      const res = await fetch(`/api/admin/customers/${encodeURIComponent(phone)}`);
      if (res.ok) {
        const data = await res.json();
        setCustomerDetail(data);
      }
    } finally {
      setDetailLoading(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      PENDING: { label: '待处理', color: '#F59E0B' },
      CONFIRMED: { label: '已确认', color: '#059669' },
      IN_PROGRESS: { label: '执行中', color: '#3B82F6' },
      COMPLETED: { label: '已完成', color: '#6B7280' },
      CANCELLED: { label: '已取消', color: '#DC2626' },
    };
    const s = map[status] || { label: status, color: '#6B7280' };
    return (
      <span style={{ fontSize: '.75rem', padding: '2px 6px', borderRadius: 4, background: s.color + '20', color: s.color }}>
        {s.label}
      </span>
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E3A8A', marginBottom: 24 }}>👥 客户管理</h1>

      {/* 搜索栏 */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
        <input
          type="text"
          placeholder="搜索客户姓名/电话/公司..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          style={{ flex: 1, padding: '10px 16px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: '.9rem', outline: 'none', boxSizing: 'border-box' }}
        />
        <button onClick={handleSearch} style={{ padding: '10px 24px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          搜索
        </button>
      </div>

      {/* 客户列表 */}
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.04)', marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>联系人</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>电话</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>公司</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>预约次数</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>最近预约</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#9CA3AF' }}>加载中...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#9CA3AF' }}>暂无客户数据</td></tr>
            ) : (
              customers.map(c => (
                <tr key={c.phone} style={{ borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }} onClick={() => loadCustomerDetail(c.phone)}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1E3A8A' }}>{c.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '.9rem' }}>{c.phone}</td>
                  <td style={{ padding: '12px 16px', fontSize: '.85rem', color: '#6B7280' }}>{c.company || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontWeight: 600 }}>{c.totalBookings}</span>
                    <span style={{ fontSize: '.78rem', color: '#9CA3AF', marginLeft: 4 }}>({c.confirmedBookings} 已确认)</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '.85rem', color: '#6B7280' }}>
                    {c.lastBooking ? new Date(c.lastBooking).toLocaleDateString('zh-CN') : '-'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={e => { e.stopPropagation(); loadCustomerDetail(c.phone); }}
                      style={{ padding: '6px 12px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 6, fontSize: '.8rem', cursor: 'pointer' }}
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 分页 */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 16 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} style={{ padding: '6px 12px', background: page <= 1 ? '#F3F4F6' : '#1E3A8A', color: page <= 1 ? '#9CA3AF' : '#fff', border: 'none', borderRadius: 6, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>上一页</button>
            <span style={{ padding: '6px 12px', fontSize: '.85rem', color: '#6B7280' }}>{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ padding: '6px 12px', background: page >= totalPages ? '#F3F4F6' : '#1E3A8A', color: page >= totalPages ? '#9CA3AF' : '#fff', border: 'none', borderRadius: 6, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}>下一页</button>
          </div>
        )}
      </div>

      {/* 客户详情弹窗 */}
      {selectedCustomer && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => { setSelectedCustomer(null); setCustomerDetail(null); }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 800, width: '90%', maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>客户详情</h2>
              <button onClick={() => { setSelectedCustomer(null); setCustomerDetail(null); }} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6B7280' }}>×</button>
            </div>

            {detailLoading ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#9CA3AF' }}>加载中...</div>
            ) : customerDetail ? (
              <div>
                {/* 客户信息 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24, background: '#F9FAFB', padding: 16, borderRadius: 12 }}>
                  <div>
                    <div style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 4 }}>联系人</div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{customerDetail.phone ? customers.find(c => c.phone === selectedCustomer)?.name || '-' : '-'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 4 }}>联系电话</div>
                    <div style={{ fontWeight: 600 }}>{selectedCustomer}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 4 }}>总预约</div>
                    <div style={{ fontWeight: 600, color: '#1E3A8A' }}>{customerDetail.stats.totalBookings}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 4 }}>总消费</div>
                    <div style={{ fontWeight: 600, color: '#059669' }}>¥{customerDetail.stats.totalSpent.toFixed(2)}</div>
                  </div>
                </div>

                {/* 预约历史 */}
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: 12 }}>预约历史</h3>
                  <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                    {customerDetail.bookings.length === 0 ? (
                      <div style={{ padding: 16, color: '#9CA3AF', textAlign: 'center' }}>暂无预约记录</div>
                    ) : (
                      customerDetail.bookings.map(b => (
                        <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #F3F4F6' }}>
                          <div>
                            <div style={{ fontWeight: 500 }}>#{b.id} {b.line.name}</div>
                            <div style={{ fontSize: '.78rem', color: '#9CA3AF' }}>{new Date(b.createdAt).toLocaleDateString('zh-CN')}</div>
                          </div>
                          {getStatusBadge(b.status)}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 账单历史 */}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: 12 }}>账单历史</h3>
                  <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                    {customerDetail.bills.length === 0 ? (
                      <div style={{ padding: 16, color: '#9CA3AF', textAlign: 'center' }}>暂无账单记录</div>
                    ) : (
                      customerDetail.bills.map(b => (
                        <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #F3F4F6' }}>
                          <div>
                            <div style={{ fontWeight: 500 }}>#{b.id} {b.line.name}</div>
                            <div style={{ fontSize: '.78rem', color: '#9CA3AF' }}>{new Date(b.createdAt).toLocaleDateString('zh-CN')}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontWeight: 600 }}>¥{b.totalAmount.toFixed(2)}</span>
                            <span style={{ fontSize: '.75rem', padding: '2px 6px', borderRadius: 4, background: b.status === 'PAID' ? '#05966920' : b.status === 'PENDING' ? '#D9770620' : '#DC262620', color: b.status === 'PAID' ? '#059669' : b.status === 'PENDING' ? '#D97706' : '#DC2626' }}>
                              {b.status === 'PAID' ? '已支付' : b.status === 'PENDING' ? '待支付' : '已取消'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
