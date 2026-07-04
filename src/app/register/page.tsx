'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', company: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError(data.error || '注册失败');
    }
    setLoading(false);
  };

  const inputStyle = { width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.95rem', outline: 'none' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6', padding: 20 }}>
      <form onSubmit={handleSubmit} style={{ width: 400, background: '#fff', padding: 40, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🥩</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E3A8A' }}>注册 MeatTech Pro</h1>
          <p style={{ fontSize: '.85rem', color: '#9CA3AF', marginTop: 4 }}>加入肉品工程师社区</p>
        </div>
        {error && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px 14px', borderRadius: 8, fontSize: '.85rem', marginBottom: 16 }}>{error}</div>}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>姓名 *</label>
          <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="您的姓名" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>邮箱 *</label>
          <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} placeholder="your@email.com" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>密码 *</label>
          <input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={inputStyle} placeholder="至少6位" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>手机号</label>
          <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} placeholder="选填" />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>公司名称</label>
          <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} style={inputStyle} placeholder="选填" />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', background: '#1E3A8A', color: '#fff', border: 'none', padding: '14px', borderRadius: 8, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>{loading ? '注册中...' : '注册'}</button>
        <p style={{ fontSize: '.85rem', color: '#6B7280', marginTop: 20, textAlign: 'center' }}>
          已有账号？<Link href="/admin" style={{ color: '#1E3A8A', fontWeight: 600 }}>点此登录</Link>
        </p>
      </form>
    </div>
  );
}
