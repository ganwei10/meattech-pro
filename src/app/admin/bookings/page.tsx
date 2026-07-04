'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

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
  line: {
    id: number;
    name: string;
    region: string;
    specs: string;
    capacity: string;
  };
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/bookings')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setBookings(data.bookings);
        setLoading(false);
      })
      .catch(err => {
        setError(String(err));
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdating(true);
    setMessage('');
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNote }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`✅ 预约 #${id} 已${newStatus === 'CONFIRMED' ? '确认' : newStatus === 'CANCELLED' ? '拒绝' : '更新'}`);
        // 刷新列表
        const refresh = await fetch('/api/admin/bookings');
        const refreshed = await refresh.json();
        setBookings(refreshed.bookings);
        if (selectedBooking?.id === id) {
          setSelectedBooking(refreshed.bookings.find((b: Booking) => b.id === id) || null);
        }
      } else {
        setMessage(`❌ 操作失败: ${data.error}`);
      }
    } catch (err) {
      setMessage(`❌ 操作失败: ${String(err)}`);
    }
    setUpdating(false);
  };

  if (loading) {
    return <div style={{ padding: 32, color: '#9CA3AF' }}>加载中...</div>;
  }

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: '待处理', color: '#92400E', bg: '#FEF3C7' },
    CONFIRMED: { label: '已确认', color: '#065F46', bg: '#D1FAE5' },
    IN_PROGRESS: { label: '执行中', color: '#1E40AF', bg: '#DBEAFE' },
    COMPLETED: { label: '已完成', color: '#065F46', bg: '#D1FAE5' },
    CANCELLED: { label: '已取消', color: '#991B1B', bg: '#FEE2E2' },
  };

  const statusActions: Record<string, { label: string; status: string; color: string }[]> = {
    PENDING: [
      { label: '✅ 接受预约', status: 'CONFIRMED', color: '#059669' },
      { label: '❌ 拒绝预约', status: 'CANCELLED', color: '#DC2626' },
    ],
    CONFIRMED: [
      { label: '▶️ 开始执行', status: 'IN_PROGRESS', color: '#2563EB' },
    ],
    IN_PROGRESS: [
      { label: '✅ 完成', status: 'COMPLETED', color: '#059669' },
    ],
    COMPLETED: [],
    CANCELLED: [
      { label: '🔄 重新开放', status: 'PENDING', color: '#D97706' },
    ],
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>预约管理</h1>

      {message && (
        <div style={{ background: message.startsWith('✅') ? '#D1FAE5' : '#FEE2E2', border: `1px solid ${message.startsWith('✅') ? '#059669' : '#DC2626'}`, borderRadius: 12, padding: 16, marginBottom: 16, color: message.startsWith('✅') ? '#065F46' : '#991B1B' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {[
          { label: '全部', value: bookings.length, status: '' },
          { label: '待处理', value: bookings.filter(b => b.status === 'PENDING').length, status: 'PENDING' },
          { label: '已确认', value: bookings.filter(b => b.status === 'CONFIRMED').length, status: 'CONFIRMED' },
          { label: '执行中', value: bookings.filter(b => b.status === 'IN_PROGRESS').length, status: 'IN_PROGRESS' },
          { label: '已完成', value: bookings.filter(b => b.status === 'COMPLETED').length, status: 'COMPLETED' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', padding: '16px 24px', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E3A8A' }}>{s.value}</div>
            <div style={{ fontSize: '.78rem', color: '#6B7280' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>编号</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>联系人</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>产线</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>状态</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>暂无预约记录</td></tr>
            ) : bookings.map(b => {
              const st = statusMap[b.status] || statusMap.PENDING;
              return (
                <tr key={b.id} style={{ borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }} onClick={() => { setSelectedBooking(b); setAdminNote(b.adminNote || ''); }}>
                  <td style={{ padding: '12px 16px', fontSize: '.85rem', fontWeight: 600, color: '#1E3A8A' }}>#{b.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: '.88rem', fontWeight: 500 }}>
                    {b.contactName}
                    <div style={{ fontSize: '.78rem', color: '#9CA3AF' }}>{b.contactPhone}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '.85rem' }}>{b.line.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '.75rem', padding: '3px 8px', borderRadius: 4, background: st.bg, color: st.color, fontWeight: 600 }}>{st.label}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedBooking(b); setAdminNote(b.adminNote || ''); }}
                      style={{ background: '#1E3A8A', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: '.8rem', cursor: 'pointer' }}
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 预约详情弹窗 */}
      {selectedBooking && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedBooking(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 600, width: '90%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>预约详情 #{selectedBooking.id}</h2>
              <button onClick={() => setSelectedBooking(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6B7280' }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 4 }}>联系人</div>
                <div style={{ fontWeight: 600 }}>{selectedBooking.contactName}</div>
              </div>
              <div>
                <div style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 4 }}>联系电话</div>
                <div style={{ fontWeight: 600 }}>{selectedBooking.contactPhone}</div>
              </div>
              <div>
                <div style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 4 }}>联系邮箱</div>
                <div style={{ fontWeight: 600 }}>{selectedBooking.contactEmail || '-'}</div>
              </div>
              <div>
                <div style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 4 }}>单位</div>
                <div style={{ fontWeight: 600 }}>{selectedBooking.company}</div>
              </div>
              <div>
                <div style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 4 }}>预约产线</div>
                <div style={{ fontWeight: 600 }}>{selectedBooking.line.name}</div>
                <div style={{ fontSize: '.75rem', color: '#9CA3AF' }}>{selectedBooking.line.region} | {selectedBooking.line.capacity}</div>
              </div>
              <div>
                <div style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 4 }}>实验类型</div>
                <div style={{ fontWeight: 600 }}>{selectedBooking.experimentType || '-'}</div>
              </div>
              <div>
                <div style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 4 }}>期望日期</div>
                <div style={{ fontWeight: 600 }}>{selectedBooking.preferredDate || '-'}</div>
              </div>
              <div>
                <div style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 4 }}>状态</div>
                <span style={{ fontSize: '.75rem', padding: '3px 8px', borderRadius: 4, background: statusMap[selectedBooking.status].bg, color: statusMap[selectedBooking.status].color, fontWeight: 600 }}>
                  {statusMap[selectedBooking.status].label}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 4 }}>实验需求</div>
              <div style={{ background: '#F9FAFB', borderRadius: 8, padding: 12, fontSize: '.9rem', lineHeight: 1.6 }}>{selectedBooking.requirement}</div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 4 }}>管理员备注</div>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="添加备注（会发送给预约人）"
                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #D1D5DB', fontSize: '.9rem', minHeight: 80, resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {statusActions[selectedBooking.status]?.map(action => (
                <button
                  key={action.status}
                  onClick={() => handleStatusChange(selectedBooking.id, action.status)}
                  disabled={updating}
                  style={{ background: action.color, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: '.9rem', fontWeight: 600, cursor: updating ? 'not-allowed' : 'pointer', opacity: updating ? 0.5 : 1 }}
                >
                  {updating ? '处理中...' : action.label}
                </button>
              ))}
              <button onClick={() => setSelectedBooking(null)} style={{ background: '#9CA3AF', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: '.9rem', cursor: 'pointer' }}>
                关闭
              </button>
            </div>

            <div style={{ marginTop: 16, fontSize: '.78rem', color: '#9CA3AF' }}>
              创建时间: {new Date(selectedBooking.createdAt).toLocaleString('zh-CN')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
