'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface PilotLine {
  id: number;
  name: string;
  region: string;
  status: string;
  specs: string;
  capacity: string;
  equipment: string;
  capabilities: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  pricePerDay: number;
  serviceFeePercent: number;
  description: string;
  images: string;
  createdAt: string;
  _count?: { bookings: number };
}

export default function PilotLinesAdminPage() {
  const [lines, setLines] = useState<PilotLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLine, setEditingLine] = useState<PilotLine | null>(null);
  const [form, setForm] = useState({
    name: '',
    region: '',
    status: 'AVAILABLE',
    specs: '',
    capacity: '',
    equipment: '',
    capabilities: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    pricePerDay: '',
    serviceFeePercent: '5',
    description: '',
    images: '',
  });
  const [filter, setFilter] = useState({ status: '', region: '', keyword: '' });
  const [message, setMessage] = useState('');

  const loadLines = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter.status) params.set('status', filter.status);
    if (filter.region) params.set('region', filter.region);
    if (filter.keyword) params.set('keyword', filter.keyword);

    const res = await fetch(`/api/admin/pilot-lines?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setLines(data.lines || []);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    loadLines();
  }, [loadLines]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const method = editingLine ? 'PUT' : 'POST';
    const url = editingLine
      ? `/api/admin/pilot-lines/${editingLine.id}`
      : '/api/admin/pilot-lines';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
      setMessage(`✅ 产线已${editingLine ? '更新' : '创建'}`);
      setShowModal(false);
      setEditingLine(null);
      resetForm();
      loadLines();
    } else {
      setMessage(`❌ ${data.error || '操作失败'}`);
    }
  };

  const handleEdit = (line: PilotLine) => {
    setEditingLine(line);
    setForm({
      name: line.name,
      region: line.region,
      status: line.status,
      specs: line.specs || '',
      capacity: line.capacity || '',
      equipment: line.equipment || '',
      capabilities: line.capabilities || '',
      contactPerson: line.contactPerson || '',
      contactPhone: line.contactPhone || '',
      contactEmail: line.contactEmail || '',
      pricePerDay: String(line.pricePerDay || ''),
      serviceFeePercent: String(line.serviceFeePercent || '5'),
      description: line.description || '',
      images: line.images || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`确定要删除产线「${name}」吗？`)) return;

    const res = await fetch(`/api/admin/pilot-lines/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      setMessage('✅ 产线已删除');
      loadLines();
    } else {
      setMessage(`❌ ${data.error || '删除失败'}`);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      region: '',
      status: 'AVAILABLE',
      specs: '',
      capacity: '',
      equipment: '',
      capabilities: '',
      contactPerson: '',
      contactPhone: '',
      contactEmail: '',
      pricePerDay: '',
      serviceFeePercent: '5',
      description: '',
      images: '',
    });
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      'AVAILABLE': { label: '可用', color: '#059669' },
      'IN_USE': { label: '使用中', color: '#D97706' },
      'MAINTENANCE': { label: '维护中', color: '#DC2626' },
    };
    const s = map[status] || { label: status, color: '#6B7280' };
    return <span style={{ background: s.color + '20', color: s.color, padding: '2px 8px', borderRadius: 4, fontSize: '.75rem' }}>{s.label}</span>;
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>🏭 产线管理</h1>

      {message && (
        <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 16, background: message.includes('✅') ? '#ECFDF5' : '#FEE2E2', color: message.includes('✅') ? '#059669' : '#DC2626' }}>
          {message}
        </div>
      )}

      {/* 筛选栏 */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #D1D5DB' }}>
          <option value="">全部状态</option>
          <option value="AVAILABLE">可用</option>
          <option value="IN_USE">使用中</option>
          <option value="MAINTENANCE">维护中</option>
        </select>
        <input
          placeholder="搜索产线名称..."
          value={filter.keyword}
          onChange={e => setFilter({ ...filter, keyword: e.target.value })}
          style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #D1D5DB', flex: 1, minWidth: 200 }}
        />
        <button onClick={() => { resetForm(); setEditingLine(null); setShowModal(true); }} style={{ padding: '8px 16px', background: '#1E3A8A', color: '#FFF', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          ＋ 新增产线
        </button>
      </div>

      {/* 产线列表 */}
      {loading ? <div>加载中...</div> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                <th style={{ padding: 12, textAlign: 'left' }}>ID</th>
                <th style={{ padding: 12, textAlign: 'left' }}>产线名称</th>
                <th style={{ padding: 12, textAlign: 'left' }}>地区</th>
                <th style={{ padding: 12, textAlign: 'left' }}>状态</th>
                <th style={{ padding: 12, textAlign: 'left' }}>收费标准</th>
                <th style={{ padding: 12, textAlign: 'left' }}>服务费%</th>
                <th style={{ padding: 12, textAlign: 'left' }}>预约数</th>
                <th style={{ padding: 12, textAlign: 'left' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {lines.map(line => (
                <tr key={line.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: 12 }}>{line.id}</td>
                  <td style={{ padding: 12, fontWeight: 500 }}>{line.name}</td>
                  <td style={{ padding: 12 }}>{line.region}</td>
                  <td style={{ padding: 12 }}>{getStatusBadge(line.status)}</td>
                  <td style={{ padding: 12 }}>{line.pricePerDay ? `¥${line.pricePerDay}/天` : '未设置'}</td>
                  <td style={{ padding: 12 }}>{line.serviceFeePercent}%</td>
                  <td style={{ padding: 12 }}>{line._count?.bookings || 0}</td>
                  <td style={{ padding: 12 }}>
                    <button onClick={() => handleEdit(line)} style={{ padding: '4px 8px', marginRight: 8, background: '#2563EB', color: '#FFF', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '.8rem' }}>编辑</button>
                    <button onClick={() => handleDelete(line.id, line.name)} style={{ padding: '4px 8px', background: '#DC2626', color: '#FFF', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '.8rem' }}>删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 新增/编辑弹窗 */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FFF', borderRadius: 12, padding: 24, maxWidth: 600, width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 16 }}>{editingLine ? '编辑产线' : '新增产线'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>产线名称 *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>地区 *</label>
                  <input required value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} placeholder="如：北京、上海" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>状态</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #D1D5DB', boxSizing: 'border-box' }}>
                    <option value="AVAILABLE">可用</option>
                    <option value="IN_USE">使用中</option>
                    <option value="MAINTENANCE">维护中</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>每日收费（元）</label>
                  <input type="number" value={form.pricePerDay} onChange={e => setForm({ ...form, pricePerDay: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>服务费百分比（%）</label>
                  <input type="number" value={form.serviceFeePercent} onChange={e => setForm({ ...form, serviceFeePercent: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>产能</label>
                  <input value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} placeholder="如：500kg/h" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>设备信息</label>
                <textarea value={form.equipment} onChange={e => setForm({ ...form, equipment: e.target.value })} placeholder="如：120L真空斩拌机、连续式烟熏炉" rows={2} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>技术能力</label>
                <textarea value={form.capabilities} onChange={e => setForm({ ...form, capabilities: e.target.value })} placeholder="如：低温肉制品加工、发酵肉制品研发" rows={2} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>联系人</label>
                  <input value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>联系电话</label>
                  <input value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>联系邮箱</label>
                  <input type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>产线描述</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button type="submit" style={{ flex: 1, padding: '10px 0', background: '#1E3A8A', color: '#FFF', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>{editingLine ? '更新' : '创建'}</button>
                <button type="button" onClick={() => { setShowModal(false); setEditingLine(null); }} style={{ flex: 1, padding: '10px 0', background: '#E5E7EB', color: '#374151', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>取消</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
