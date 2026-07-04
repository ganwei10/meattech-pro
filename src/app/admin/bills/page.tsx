'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';

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
  invoiceRequested: boolean;
  invoiceInfo: string;
  paidAt: string | null;
  note: string;
  createdAt: string;
  updatedAt: string;
  line: { id: number; name: string };
  booking: { id: number; contactName: string; status: string };
}

export default function BillsAdminPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState<Bill | null>(null);
  const [filter, setFilter] = useState({ status: '', keyword: '', startDate: '', endDate: '' });
  const [message, setMessage] = useState('');

  const loadBills = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter.status) params.set('status', filter.status);
    if (filter.keyword) params.set('keyword', filter.keyword);
    if (filter.startDate) params.set('startDate', filter.startDate);
    if (filter.endDate) params.set('endDate', filter.endDate);

    const res = await fetch(`/api/admin/bills?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setBills(data.bills || []);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    loadBills();
  }, [loadBills]);

  const handleUpdateStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/admin/bills/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    if (data.success) {
      setMessage(`✅ 账单 #${id} 状态已更新为 ${status === 'PAID' ? '已支付' : status === 'CANCELLED' ? '已取消' : '待支付'}`);
      setShowDetail(null);
      loadBills();
    } else {
      setMessage(`❌ 更新失败: ${data.error}`);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      'PENDING': { label: '待支付', color: '#D97706' },
      'PAID': { label: '已支付', color: '#059669' },
      'CANCELLED': { label: '已取消', color: '#DC2626' },
    };
    const s = map[status] || { label: status, color: '#6B7280' };
    return <span style={{ background: s.color + '20', color: s.color, padding: '2px 8px', borderRadius: 4, fontSize: '.75rem' }}>{s.label}</span>;
  };

  // 导出 Excel
  const exportToExcel = () => {
    const exportData = bills.map(b => ({
      '账单编号': `#${b.id}`,
      '客户姓名': b.customerName,
      '电话': b.customerPhone,
      '邮箱': b.customerEmail,
      '公司': b.company,
      '中试产线': b.line.name,
      '金额': b.amount,
      '服务费': b.serviceFee,
      '总计': b.totalAmount,
      '状态': b.status === 'PAID' ? '已支付' : b.status === 'PENDING' ? '待支付' : '已取消',
      '创建时间': new Date(b.createdAt).toLocaleString('zh-CN'),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '账单列表');
    XLSX.writeFile(wb, `账单列表_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const totalRevenue = bills.filter(b => b.status === 'PAID').reduce((sum, b) => sum + b.totalAmount, 0);
  const pendingAmount = bills.filter(b => b.status === 'PENDING').reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>📄 账单管理</h1>
        <button onClick={exportToExcel} style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '.9rem' }}>
          📊 导出 Excel
        </button>
      </div>

      {message && (
        <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 16, background: message.includes('✅') ? '#ECFDF5' : '#FEE2E2', color: message.includes('✅') ? '#059669' : '#DC2626' }}>
          {message}
        </div>
      )}

      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#FFF', padding: 16, borderRadius: 12, border: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: '.85rem', color: '#6B7280', marginBottom: 4 }}>总营收（已支付）</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669' }}>¥{totalRevenue.toFixed(2)}</div>
        </div>
        <div style={{ background: '#FFF', padding: 16, borderRadius: 12, border: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: '.85rem', color: '#6B7280', marginBottom: 4 }}>待收款</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#D97706' }}>¥{pendingAmount.toFixed(2)}</div>
        </div>
        <div style={{ background: '#FFF', padding: 16, borderRadius: 12, border: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: '.85rem', color: '#6B7280', marginBottom: 4 }}>账单总数</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{bills.length}</div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #D1D5DB' }}>
          <option value="">全部状态</option>
          <option value="PENDING">待支付</option>
          <option value="PAID">已支付</option>
          <option value="CANCELLED">已取消</option>
        </select>
        <input
          type="date"
          value={filter.startDate}
          onChange={e => setFilter({ ...filter, startDate: e.target.value })}
          style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #D1D5DB' }}
        />
        <span style={{ alignSelf: 'center', color: '#6B7280' }}>至</span>
        <input
          type="date"
          value={filter.endDate}
          onChange={e => setFilter({ ...filter, endDate: e.target.value })}
          style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #D1D5DB' }}
        />
        <input
          placeholder="搜索客户、公司..."
          value={filter.keyword}
          onChange={e => setFilter({ ...filter, keyword: e.target.value })}
          style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #D1D5DB', flex: 1, minWidth: 200 }}
        />
      </div>

      {/* 账单列表 */}
      {loading ? <div>加载中...</div> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                <th style={{ padding: 12, textAlign: 'left' }}>账单编号</th>
                <th style={{ padding: 12, textAlign: 'left' }}>客户</th>
                <th style={{ padding: 12, textAlign: 'left' }}>公司</th>
                <th style={{ padding: 12, textAlign: 'left' }}>中试产线</th>
                <th style={{ padding: 12, textAlign: 'left' }}>金额</th>
                <th style={{ padding: 12, textAlign: 'left' }}>服务费</th>
                <th style={{ padding: 12, textAlign: 'left' }}>总计</th>
                <th style={{ padding: 12, textAlign: 'left' }}>状态</th>
                <th style={{ padding: 12, textAlign: 'left' }}>创建时间</th>
                <th style={{ padding: 12, textAlign: 'left' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(bill => (
                <tr key={bill.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: 12, fontWeight: 500 }}>#{bill.id}</td>
                  <td style={{ padding: 12 }}>{bill.customerName}</td>
                  <td style={{ padding: 12 }}>{bill.company}</td>
                  <td style={{ padding: 12 }}>{bill.line.name}</td>
                  <td style={{ padding: 12 }}>¥{bill.amount.toFixed(2)}</td>
                  <td style={{ padding: 12 }}>¥{bill.serviceFee.toFixed(2)}</td>
                  <td style={{ padding: 12, fontWeight: 600 }}>¥{bill.totalAmount.toFixed(2)}</td>
                  <td style={{ padding: 12 }}>{getStatusBadge(bill.status)}</td>
                  <td style={{ padding: 12, fontSize: '.85rem', color: '#6B7280' }}>{new Date(bill.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: 12 }}>
                    <button onClick={() => setShowDetail(bill)} style={{ padding: '4px 8px', marginRight: 8, background: '#2563EB', color: '#FFF', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '.8rem' }}>详情</button>
                    {bill.status === 'PENDING' && (
                      <button onClick={() => handleUpdateStatus(bill.id, 'PAID')} style={{ padding: '4px 8px', background: '#059669', color: '#FFF', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '.8rem' }}>标记已付</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 账单详情弹窗 */}
      {showDetail && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FFF', borderRadius: 12, padding: 24, maxWidth: 600, width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 16 }}>账单详情 #{showDetail.id}</h2>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: '.85rem', color: '#6B7280' }}>客户姓名</div>
                  <div style={{ fontWeight: 500 }}>{showDetail.customerName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '.85rem', color: '#6B7280' }}>联系电话</div>
                  <div>{showDetail.customerPhone}</div>
                </div>
                <div>
                  <div style={{ fontSize: '.85rem', color: '#6B7280' }}>邮箱</div>
                  <div>{showDetail.customerEmail}</div>
                </div>
                <div>
                  <div style={{ fontSize: '.85rem', color: '#6B7280' }}>公司</div>
                  <div>{showDetail.company}</div>
                </div>
              </div>

              <div style={{ background: '#F9FAFB', padding: 16, borderRadius: 8, marginBottom: 12 }}>
                <div style={{ fontSize: '.9rem', fontWeight: 600, marginBottom: 8 }}>费用明细</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>中试产线使用费用</span>
                  <span>¥{showDetail.amount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>平台服务费 ({((showDetail.serviceFee / showDetail.amount) * 100).toFixed(1)}%)</span>
                  <span>¥{showDetail.serviceFee.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.1rem', borderTop: '1px solid #E5E7EB', paddingTop: 8, marginTop: 8 }}>
                  <span>总计</span>
                  <span>¥{showDetail.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ fontSize: '.85rem', color: '#6B7280', marginBottom: 4 }}>状态</div>
              <div style={{ marginBottom: 16 }}>{getStatusBadge(showDetail.status)}</div>

              {showDetail.note && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: '.85rem', color: '#6B7280', marginBottom: 4 }}>备注</div>
                  <div style={{ background: '#F9FAFB', padding: 8, borderRadius: 4 }}>{showDetail.note}</div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              {showDetail.status === 'PENDING' && (
                <button onClick={() => handleUpdateStatus(showDetail.id, 'PAID')} style={{ flex: 1, padding: '10px 0', background: '#059669', color: '#FFF', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>标记已支付</button>
              )}
              {showDetail.status === 'PENDING' && (
                <button onClick={() => handleUpdateStatus(showDetail.id, 'CANCELLED')} style={{ flex: 1, padding: '10px 0', background: '#DC2626', color: '#FFF', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>取消账单</button>
              )}
              <button onClick={() => setShowDetail(null)} style={{ flex: 1, padding: '10px 0', background: '#E5E7EB', color: '#374151', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
