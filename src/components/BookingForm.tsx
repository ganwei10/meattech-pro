'use client';

import { useState } from 'react';

export default function BookingForm({ lines }: { lines: { id: number; name: string; region: string; status: string }[] }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ lineId: '', contactName: '', contactPhone: '', company: '', requirement: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', background: '#F3F4F6', borderRadius: '16px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>预约提交成功！</h2>
        <p style={{ color: '#6B7280' }}>平台专家将在24小时内与您联系，请保持手机畅通。</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '.9rem', fontWeight: 600, marginBottom: '8px' }}>选择中试产线 *</label>
        <select
          required
          value={form.lineId}
          onChange={e => setForm({ ...form, lineId: e.target.value })}
          style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '.95rem', outline: 'none' }}
        >
          <option value="">请选择产线...</option>
          {lines.map(l => (
            <option key={l.id} value={l.id} disabled={l.status !== 'AVAILABLE'}>
              {l.region} · {l.name} {l.status === 'AVAILABLE' ? '（有档期）' : '（需预约）'}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '.9rem', fontWeight: 600, marginBottom: '8px' }}>联系人姓名 *</label>
        <input required value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '.95rem', outline: 'none' }} placeholder="请输入您的姓名" />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '.9rem', fontWeight: 600, marginBottom: '8px' }}>联系电话 *</label>
        <input required type="tel" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '.95rem', outline: 'none' }} placeholder="请输入手机号" />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '.9rem', fontWeight: 600, marginBottom: '8px' }}>公司名称</label>
        <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '.95rem', outline: 'none' }} placeholder="选填" />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '.9rem', fontWeight: 600, marginBottom: '8px' }}>实验需求描述</label>
        <textarea value={form.requirement} onChange={e => setForm({ ...form, requirement: e.target.value })} rows={4} style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '.95rem', outline: 'none', resize: 'vertical' }} placeholder="请简述您的实验需求、原料类型、预期产量等..." />
      </div>
      <button type="submit" style={{ background: 'linear-gradient(135deg, #F97316, #DC2626)', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '24px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(249,115,22,0.4)' }}>提交预约需求</button>
    </form>
  );
}
