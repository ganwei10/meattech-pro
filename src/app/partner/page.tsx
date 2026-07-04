'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PartnerPage() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    serviceType: 'pilot_line',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Store as a booking with special type
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          lineId: 0,
          requirement: `[服务商入驻] ${form.description}`,
          type: 'PARTNER',
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  };

  return (
    <>
      <Header />
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1E3A8A', marginBottom: 12 }}>🤝 申请入驻成为服务商</h1>
          <p style={{ fontSize: '1rem', color: '#6B7280' }}>盘活闲置产能，技术变现，品牌曝光</p>
        </div>

        {submitted ? (
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12, padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#065F46', marginBottom: 8 }}>申请已提交！</h2>
            <p style={{ color: '#047857', fontSize: '.95rem' }}>我们将在 1-2 个工作日内与您联系，请保持手机畅通。</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '.9rem', fontWeight: 600, color: '#374151' }}>联系人姓名 *</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB', boxSizing: 'border-box' }} placeholder="请输入姓名" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '.9rem', fontWeight: 600, color: '#374151' }}>公司名称</label>
                <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB', boxSizing: 'border-box' }} placeholder="公司或机构名称" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '.9rem', fontWeight: 600, color: '#374151' }}>联系电话 *</label>
                <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB', boxSizing: 'border-box' }} placeholder="手机号码" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '.9rem', fontWeight: 600, color: '#374151' }}>电子邮箱</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB', boxSizing: 'border-box' }} placeholder="邮箱地址" />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '.9rem', fontWeight: 600, color: '#374151' }}>入驻类型 *</label>
              <select value={form.serviceType} onChange={e => setForm({ ...form, serviceType: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB', boxSizing: 'border-box' }}>
                <option value="pilot_line">中试产线托管（共享闲置产能）</option>
                <option value="equipment">设备供应商（肉机设备）</option>
                <option value="additive">原辅料供应商（添加剂/辅料）</option>
                <option value="packaging">包装材料供应商</option>
                <option value="consultant">技术顾问/专家</option>
              </select>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '.9rem', fontWeight: 600, color: '#374151' }}>资源描述 *</label>
              <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB', boxSizing: 'border-box' }} placeholder="请简要描述您的资源、设备型号、产能、服务能力等信息..." />
            </div>
            <button type="submit" style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg, #F97316, #DC2626)', color: '#fff', border: 'none', borderRadius: 10, fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
              提交申请
            </button>
          </form>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 32 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🏭</div>
            <h4 style={{ fontSize: '.95rem', fontWeight: 700, color: '#1E3A8A' }}>产线托管</h4>
            <p style={{ fontSize: '.82rem', color: '#6B7280', marginTop: 4 }}>闲置档期变现</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>💰</div>
            <h4 style={{ fontSize: '.95rem', fontWeight: 700, color: '#1E3A8A' }}>技术变现</h4>
            <p style={{ fontSize: '.82rem', color: '#6B7280', marginTop: 4 }}>配方/工艺变现</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>📢</div>
            <h4 style={{ fontSize: '.95rem', fontWeight: 700, color: '#1E3A8A' }}>品牌曝光</h4>
            <p style={{ fontSize: '.82rem', color: '#6B7280', marginTop: 4 }}>精准客户触达</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
