'use client';

import { useState } from 'react';

export default function BookingForm({ lines }: { lines: { id: number; name: string; region: string; status: string; specs: string; capacity: string }[] }) {
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    lineId: '', contactName: '', contactPhone: '', contactEmail: '',
    company: '', experimentType: '', requirement: '', preferredDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setBookingId(data.id);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', background: '#F3F4F6', borderRadius: '16px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>预约提交成功！</h2>
        <p style={{ color: '#6B7280', marginBottom: 8 }}>预约编号: <strong>#{bookingId}</strong></p>
        <p style={{ color: '#6B7280' }}>平台专家将在24小时内与您联系，请保持手机畅通。</p>
        {bookingId && (
          <a href={`/booking/${bookingId}`} style={{ display: 'inline-block', marginTop: 20, color: '#1E3A8A', fontWeight: 600, fontSize: '.9rem' }}>
            查看预约详情 →
          </a>
        )}
      </div>
    );
  }

  const inputStyle = { width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '.95rem', outline: 'none' };
  const labelStyle = { display: 'block', fontSize: '.9rem', fontWeight: 600, marginBottom: '8px' };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <label style={labelStyle}>选择中试产线 *</label>
        <select required value={form.lineId} onChange={e => setForm({ ...form, lineId: e.target.value })} style={inputStyle}>
          <option value="">请选择产线...</option>
          {lines.map(l => (
            <option key={l.id} value={l.id} disabled={l.status !== 'AVAILABLE'}>
              {l.region} · {l.name} {l.status === 'AVAILABLE' ? '（有档期）' : '（需预约）'}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={labelStyle}>联系人姓名 *</label>
          <input required value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} style={inputStyle} placeholder="请输入您的姓名" />
        </div>
        <div>
          <label style={labelStyle}>联系电话 *</label>
          <input required type="tel" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} style={inputStyle} placeholder="请输入手机号" />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={labelStyle}>邮箱</label>
          <input type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} style={inputStyle} placeholder="选填" />
        </div>
        <div>
          <label style={labelStyle}>公司名称</label>
          <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} style={inputStyle} placeholder="选填" />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={labelStyle}>实验类型</label>
          <input value={form.experimentType} onChange={e => setForm({ ...form, experimentType: e.target.value })} style={inputStyle} placeholder="如：斩拌工艺优化" />
        </div>
        <div>
          <label style={labelStyle}>期望日期</label>
          <input type="date" value={form.preferredDate} onChange={e => setForm({ ...form, preferredDate: e.target.value })} style={inputStyle} />
        </div>
      </div>
      <div>
        <label style={labelStyle}>实验需求描述</label>
        <textarea value={form.requirement} onChange={e => setForm({ ...form, requirement: e.target.value })} rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder="请简述您的实验需求、原料类型、预期产量等..." />
      </div>
      <button type="submit" style={{ background: 'linear-gradient(135deg, #F97316, #DC2626)', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '24px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(249,115,22,0.4)' }}>提交预约需求</button>
    </form>
  );
}
