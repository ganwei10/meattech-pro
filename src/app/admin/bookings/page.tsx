'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

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
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  // 筛选条件
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    lineId: '',
    search: '',
    page: 1,
  });
  const [pilotLines, setPilotLines] = useState<any[]>([]);
  const pageSize = 20;

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      // 加载中试产线
      const linesRes = await fetch('/api/pilot-lines');
      if (linesRes.ok) {
        const linesData = await linesRes.json();
        setPilotLines(linesData);
      }

      // 加载预约
      await loadBookings();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.page) params.append('page', String(filters.page));

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setBookings(data.bookings || []);
      applyFilters(data.bookings || [], false);
    } catch (err) {
      setError(String(err));
    }
  };

  const applyFilters = (data: Booking[], shouldSetLoading = true) => {
    let result = [...data];
    if (filters.lineId) result = result.filter(b => String(b.lineId) === filters.lineId);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(b =>
        b.contactName.toLowerCase().includes(s) ||
        b.company.toLowerCase().includes(s) ||
        b.contactPhone.includes(s)
      );
    }
    setFiltered(result);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters(bookings);
  }, [filters.lineId, filters.search]);

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
        await loadBookings();
        if (selectedBooking?.id === id) {
          const updated = bookings.find(b => b.id === id);
          setSelectedBooking(updated || null);
        }
      } else {
        setMessage(`❌ 操作失败: ${data.error}`);
      }
    } catch (err) {
      setMessage(`❌ 操作失败: ${String(err)}`);
    }
    setUpdating(false);
  };

  // 导出 Excel
  const exportToExcel = () => {
    const exportData = filtered.map(b => ({
      '预约编号': `#${b.id}`,
      '联系人': b.contactName,
      '电话': b.contactPhone,
      '邮箱': b.contactEmail,
      '单位': b.company,
      '中试产线': b.line.name,
      '状态': statusMap[b.status]?.label || b.status,
      '期望日期': b.preferredDate,
      '创建时间': new Date(b.createdAt).toLocaleString('zh-CN'),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '预约列表');
    XLSX.writeFile(wb, `预约列表_${new Date().toISOString().split('T')[0]}.xlsx`);
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

  const pagedData = filtered.slice((filters.page - 1) * pageSize, filters.page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>预约管理</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/admin/bookings/calendar" style={{ padding: '8px 16px', background: '#EFF6FF', color: '#1E3A8A', borderRadius: 8, textDecoration: 'none', fontSize: '.9rem' }}>
            📅 日历视图
          </Link>
          <button onClick={exportToExcel} style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '.9rem' }}>
            📊 导出 Excel
          </button>
        </div>
      </div>

      {message && (
        <div style={{ background: message.startsWith('✅') ? '#D1FAE5' : '#FEE2E2', border: `1px solid ${message.startsWith('✅') ? '#059669' : '#DC2626'}`, borderRadius: 12, padding: 16, marginBottom: 16, color: message.startsWith('✅') ? '#065F46' : '#991B1B' }}>
          {message}
        </div>
      )}

      {/* 统计卡片 */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {[
          { label: '全部', value: bookings.length, status: '' },
          { label: '待处理', value: bookings.filter(b => b.status === 'PENDING').length, status: 'PENDING' },
          { label: '已确认', value: bookings.filter(b => b.status === 'CONFIRMED').length, status: 'CONFIRMED' },
          { label: '执行中', value: bookings.filter(b => b.status === 'IN_PROGRESS').length, status: 'IN_PROGRESS' },
          { label: '已完成', value: bookings.filter(b => b.status === 'COMPLETED').length, status: 'COMPLETED' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', padding: '16px 24px', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer', flex: 1 }}
            onClick={() => setFilters({ ...filters, status: s.status, page: 1 })}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.status ? statusMap[s.status]?.color || '#1E3A8A' : '#1E3A8A' }}>{s.value}</div>
            <div style={{ fontSize: '.78rem', color: '#6B7280' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* 高级筛选 */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '.9rem', fontWeight: 600, color: '#374151', marginBottom: 12 }}>🔍 高级筛选</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          <div>
            <div style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 4 }}>搜索</div>
            <input
              type="text"
              placeholder="联系人/单位/电话"
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: '.85rem', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <div style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 4 }}>状态</div>
            <select
              value={filters.status}
              onChange={e => setFilters({ ...filters, status: e.target.value, page: 1 })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: '.85rem', boxSizing: 'border-box' }}
            >
              <option value="">全部状态</option>
              <option value="PENDING">待处理</option>
              <option value="CONFIRMED">已确认</option>
              <option value="IN_PROGRESS">执行中</option>
              <option value="COMPLETED">已完成</option>
              <option value="CANCELLED">已取消</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 4 }}>中试产线</div>
            <select
              value={filters.lineId}
              onChange={e => setFilters({ ...filters, lineId: e.target.value, page: 1 })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: '.85rem', boxSizing: 'border-box' }}
            >
              <option value="">全部中试产线</option>
              {pilotLines.map(pl => (
                <option key={pl.id} value={pl.id}>{pl.name}</option>
              ))}
            </select>
          </div>
          <div>
            <div style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 4 }}>开始日期</div>
            <input
              type="date"
              value={filters.startDate}
              onChange={e => setFilters({ ...filters, startDate: e.target.value, page: 1 })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: '.85rem', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <div style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 4 }}>结束日期</div>
            <input
              type="date"
              value={filters.endDate}
              onChange={e => setFilters({ ...filters, endDate: e.target.value, page: 1 })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: '.85rem', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => setFilters({ status: '', startDate: '', endDate: '', lineId: '', search: '', page: 1 })}
              style={{ padding: '8px 16px', background: '#F3F4F6', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '.85rem', width: '100%' }}
            >
              重置筛选
            </button>
          </div>
        </div>
      </div>

      {/* 预约表格 */}
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>编号</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>联系人</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>单位</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>中试产线</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>状态</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>日期</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {pagedData.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>暂无预约记录</td></tr>
            ) : pagedData.map(b => {
              const st = statusMap[b.status] || statusMap.PENDING;
              return (
                <tr key={b.id} style={{ borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }} onClick={() => { setSelectedBooking(b); setAdminNote(b.adminNote || ''); }}>
                  <td style={{ padding: '12px 16px', fontSize: '.85rem', fontWeight: 600, color: '#1E3A8A' }}>#{b.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: '.88rem', fontWeight: 500 }}>
                    {b.contactName}
                    <div style={{ fontSize: '.78rem', color: '#9CA3AF' }}>{b.contactPhone}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '.85rem' }}>{b.company}</td>
                  <td style={{ padding: '12px 16px', fontSize: '.85rem' }}>{b.line.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '.75rem', padding: '3px 8px', borderRadius: 4, background: st.bg, color: st.color, fontWeight: 600 }}>{st.label}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '.85rem' }}>{b.preferredDate || new Date(b.createdAt).toLocaleDateString('zh-CN')}</td>
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

        {/* 分页 */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 16 }}>
            <button onClick={() => setFilters({ ...filters, page: filters.page - 1 })} disabled={filters.page <= 1} style={{ padding: '6px 12px', background: filters.page <= 1 ? '#F3F4F6' : '#1E3A8A', color: filters.page <= 1 ? '#9CA3AF' : '#fff', border: 'none', borderRadius: 6, cursor: filters.page <= 1 ? 'not-allowed' : 'pointer' }}>上一页</button>
            <span style={{ padding: '6px 12px', fontSize: '.85rem', color: '#6B7280' }}>{filters.page} / {totalPages}</span>
            <button onClick={() => setFilters({ ...filters, page: filters.page + 1 })} disabled={filters.page >= totalPages} style={{ padding: '6px 12px', background: filters.page >= totalPages ? '#F3F4F6' : '#1E3A8A', color: filters.page >= totalPages ? '#9CA3AF' : '#fff', border: 'none', borderRadius: 6, cursor: filters.page >= totalPages ? 'not-allowed' : 'pointer' }}>下一页</button>
          </div>
        )}
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
                <div style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 4 }}>预约中试产线</div>
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
                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #D1D5DB', fontSize: '.9rem', minHeight: 80, resize: 'vertical', boxSizing: 'border-box' }}
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
              <a
                href={`/admin/documents/contract/${selectedBooking.id}`}
                target="_blank"
                style={{ padding: '10px 20px', background: '#F59E0B', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.9rem', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}
              >
                📄 生成合同
              </a>
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
