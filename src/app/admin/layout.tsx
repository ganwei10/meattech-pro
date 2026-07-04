'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({ email: 'admin@meattech.pro', password: 'admin123' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.user && d.user.role === 'ADMIN') {
          setLoggedIn(true);
          setIsAdmin(true);
        } else if (d.user) {
          setIsAdmin(false);
        }
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user?.role !== 'ADMIN') {
        setError('非管理员账号，无权访问后台');
        return;
      }
      setLoggedIn(true);
      setIsAdmin(true);
    } else {
      setError('邮箱或密码错误');
    }
  };

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6' }}>
        <div style={{ color: '#9CA3AF', fontSize: '.95rem' }}>检查登录状态...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6' }}>
        <form onSubmit={handleLogin} style={{ width: 360, background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E3A8A', marginBottom: 4 }}>MeatTech Pro 管理后台</h1>
          <p style={{ fontSize: '.85rem', color: '#9CA3AF', marginBottom: 24 }}>管理员登录</p>
          {error && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '8px 12px', borderRadius: 8, fontSize: '.85rem', marginBottom: 16 }}>{error}</div>}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>邮箱</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>密码</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" style={{ width: '100%', background: '#1E3A8A', color: '#fff', border: 'none', padding: '12px', borderRadius: 8, fontSize: '.95rem', fontWeight: 700, cursor: 'pointer' }}>登录</button>
          <p style={{ fontSize: '.78rem', color: '#9CA3AF', marginTop: 16, textAlign: 'center' }}>默认账号: admin@meattech.pro / admin123</p>
          <p style={{ fontSize: '.78rem', color: '#9CA3AF', marginTop: 8, textAlign: 'center' }}>普通用户请前往 <a href="/login" style={{ color: '#1E3A8A' }}>用户登录</a></p>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <aside style={{ width: 220, background: '#1E3A8A', color: '#fff', padding: '24px 16px', flexShrink: 0 }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 32, padding: '0 8px' }}>🥩 MeatTech Admin</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Link href="/admin" style={{ padding: '10px 12px', borderRadius: 8, fontSize: '.9rem', color: '#fff', opacity: .88, transition: 'all .2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'none'}>📊 仪表盘</Link>
          <Link href="/admin/posts" style={{ padding: '10px 12px', borderRadius: 8, fontSize: '.9rem', color: '#fff', opacity: .88 }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'none'}>📝 文章管理</Link>
          <Link href="/admin/posts/new" style={{ padding: '10px 12px', borderRadius: 8, fontSize: '.9rem', color: '#fff', opacity: .88 }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'none'}>➕ 发布文章</Link>
          <Link href="/admin/pilot-lines" style={{ padding: '10px 12px', borderRadius: 8, fontSize: '.9rem', color: '#fff', opacity: .88 }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'none'}>🏭 产线管理</Link>
          <Link href="/admin/bookings" style={{ padding: '10px 12px', borderRadius: 8, fontSize: '.9rem', color: '#fff', opacity: .88 }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'none'}>📅 预约管理</Link>
          <Link href="/admin/categories" style={{ padding: '10px 12px', borderRadius: 8, fontSize: '.9rem', color: '#fff', opacity: .88 }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'none'}>📁 分类管理</Link>
          <Link href="/" style={{ padding: '10px 12px', borderRadius: 8, fontSize: '.9rem', color: '#fff', opacity: .88, marginTop: 16 }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'none'}>🌐 返回前台</Link>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 32, background: '#F3F4F6', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
