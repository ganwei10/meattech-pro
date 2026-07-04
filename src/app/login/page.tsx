'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          if (d.user.role === 'ADMIN') {
            router.push('/admin');
          } else {
            router.push('/');
          }
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6' }}>
        <div style={{ color: '#9CA3AF', fontSize: '.95rem' }}>加载中...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.user?.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || '登录失败');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6' }}>
      <div style={{ width: 400, background: '#fff', padding: 40, borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: '2.5rem' }}>🥩</span>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E3A8A', margin: '12px 0 4px' }}>欢迎回来</h1>
          <p style={{ fontSize: '.9rem', color: '#9CA3AF' }}>登录 MeatTech Pro，获取更多专业内容</p>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px 14px', borderRadius: 10, fontSize: '.85rem', marginBottom: 20 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6, color: '#374151' }}>邮箱</label>
            <input
              type="email" required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: '.95rem', outline: 'none', boxSizing: 'border-box' }}
              placeholder="your@email.com"
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6, color: '#374151' }}>密码</label>
            <input
              type="password" required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: '.95rem', outline: 'none', boxSizing: 'border-box' }}
              placeholder="请输入密码"
            />
          </div>
          <button
            type="submit" disabled={loading}
            style={{ width: '100%', background: '#1E3A8A', color: '#fff', border: 'none', padding: '14px', borderRadius: 10, fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '.88rem', color: '#9CA3AF', marginTop: 24 }}>
          还没有账号？<Link href="/register" style={{ color: '#1E3A8A', fontWeight: 600 }}>立即注册 →</Link>
        </p>

        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #F3F4F6', textAlign: 'center' }}>
          <Link href="/admin" style={{ fontSize: '.82rem', color: '#9CA3AF' }}>管理员入口 →</Link>
        </div>
      </div>
    </div>
  );
}
