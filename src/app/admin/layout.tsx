'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({ email: 'admin@meattech.pro', password: 'admin123' });
  const [error, setError] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('pilot');
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    setPathname(window.location.pathname);
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

  // Auto-expand section based on current path
  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith('/admin/bookings') || pathname.startsWith('/admin/bills') || pathname.startsWith('/admin/customers') || pathname.startsWith('/admin/reports') || pathname.startsWith('/admin/pilot-lines')) {
      setExpandedSection('pilot');
    } else if (pathname.startsWith('/admin/posts') || pathname.startsWith('/admin/categories') || pathname.startsWith('/admin/media') || pathname.startsWith('/admin/products') || pathname.startsWith('/admin/homepage') || pathname.startsWith('/admin/community')) {
      setExpandedSection('content');
    }
  }, [pathname]);

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

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleNavClick = (href: string) => {
    setPathname(href);
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

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <aside style={{ width: 240, background: '#1E3A8A', color: '#fff', padding: '24px 12px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 32, padding: '0 8px' }}>🥩 MeatTech Admin</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflowY: 'auto' }}>
          {/* 仪表盘 */}
          <Link href="/admin" onClick={() => setPathname('/admin')} style={{
            padding: '10px 12px', borderRadius: 8, fontSize: '.9rem', color: '#fff',
            background: pathname === '/admin' ? 'rgba(255,255,255,0.15)' : 'transparent',
            textDecoration: 'none', display: 'block'
          }}>📊 仪表盘</Link>

          {/* 中试管理 - 可折叠 */}
          <div>
            <div
              onClick={() => toggleSection('pilot')}
              style={{
                padding: '10px 12px', borderRadius: 8, fontSize: '.9rem', color: '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontWeight: 600,
              }}
            >
              <span>🏭 中试管理</span>
              <span style={{ fontSize: '.7rem', opacity: 0.7 }}>{expandedSection === 'pilot' ? '▼' : '▶'}</span>
            </div>
            {expandedSection === 'pilot' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2, marginLeft: 12, borderLeft: '2px solid rgba(255,255,255,0.15)', paddingLeft: 8 }}>
                <Link href="/admin/pilot-lines" onClick={() => setPathname('/admin/pilot-lines')} style={{
                  padding: '8px 12px', borderRadius: 6, fontSize: '.85rem', color: '#fff', opacity: .88,
                  background: isActive('/admin/pilot-lines') ? 'rgba(255,255,255,0.12)' : 'transparent',
                  textDecoration: 'none', display: 'block'
                }}>🏭 中试产线</Link>
                <Link href="/admin/bookings" onClick={() => setPathname('/admin/bookings')} style={{
                  padding: '8px 12px', borderRadius: 6, fontSize: '.85rem', color: '#fff', opacity: .88,
                  background: isActive('/admin/bookings') ? 'rgba(255,255,255,0.12)' : 'transparent',
                  textDecoration: 'none', display: 'block'
                }}>📅 预约管理</Link>
                <Link href="/admin/bookings/calendar" onClick={() => setPathname('/admin/bookings/calendar')} style={{
                  padding: '8px 12px', borderRadius: 6, fontSize: '.85rem', color: '#fff', opacity: .88,
                  background: isActive('/admin/bookings/calendar') ? 'rgba(255,255,255,0.12)' : 'transparent',
                  textDecoration: 'none', display: 'block'
                }}>📆 预约日历</Link>
                <Link href="/admin/bills" onClick={() => setPathname('/admin/bills')} style={{
                  padding: '8px 12px', borderRadius: 6, fontSize: '.85rem', color: '#fff', opacity: .88,
                  background: isActive('/admin/bills') ? 'rgba(255,255,255,0.12)' : 'transparent',
                  textDecoration: 'none', display: 'block'
                }}>📄 账单管理</Link>
                <Link href="/admin/customers" onClick={() => setPathname('/admin/customers')} style={{
                  padding: '8px 12px', borderRadius: 6, fontSize: '.85rem', color: '#fff', opacity: .88,
                  background: isActive('/admin/customers') ? 'rgba(255,255,255,0.12)' : 'transparent',
                  textDecoration: 'none', display: 'block'
                }}>👥 客户管理</Link>
                <Link href="/admin/reports" onClick={() => setPathname('/admin/reports')} style={{
                  padding: '8px 12px', borderRadius: 6, fontSize: '.85rem', color: '#fff', opacity: .88,
                  background: isActive('/admin/reports') ? 'rgba(255,255,255,0.12)' : 'transparent',
                  textDecoration: 'none', display: 'block'
                }}>📈 报表统计</Link>
              </div>
            )}
          </div>

          {/* 用户管理 */}
          <Link href="/admin/users" onClick={() => setPathname('/admin/users')} style={{
            padding: '10px 12px', borderRadius: 8, fontSize: '.9rem', color: '#fff', opacity: .88,
            background: isActive('/admin/users') ? 'rgba(255,255,255,0.15)' : 'transparent',
            textDecoration: 'none', display: 'block', marginTop: 4,
          }}>👥 用户管理</Link>

          {/* 内容管理 - 可折叠 */}
          <div>
            <div
              onClick={() => toggleSection('content')}
              style={{
                padding: '10px 12px', borderRadius: 8, fontSize: '.9rem', color: '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontWeight: 600, marginTop: 4,
              }}
            >
              <span>📝 内容管理</span>
              <span style={{ fontSize: '.7rem', opacity: 0.7 }}>{expandedSection === 'content' ? '▼' : '▶'}</span>
            </div>
            {expandedSection === 'content' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2, marginLeft: 12, borderLeft: '2px solid rgba(255,255,255,0.15)', paddingLeft: 8 }}>
                <Link href="/admin/posts" onClick={() => setPathname('/admin/posts')} style={{
                  padding: '8px 12px', borderRadius: 6, fontSize: '.85rem', color: '#fff', opacity: .88,
                  background: isActive('/admin/posts') ? 'rgba(255,255,255,0.12)' : 'transparent',
                  textDecoration: 'none', display: 'block'
                }}>📝 文章管理</Link>
                <Link href="/admin/products" onClick={() => setPathname('/admin/products')} style={{
                  padding: '8px 12px', borderRadius: 6, fontSize: '.85rem', color: '#fff', opacity: .88,
                  background: isActive('/admin/products') ? 'rgba(255,255,255,0.12)' : 'transparent',
                  textDecoration: 'none', display: 'block'
                }}>📦 商超爆款</Link>
                <Link href="/admin/media" onClick={() => setPathname('/admin/media')} style={{
                  padding: '8px 12px', borderRadius: 6, fontSize: '.85rem', color: '#fff', opacity: .88,
                  background: isActive('/admin/media') ? 'rgba(255,255,255,0.12)' : 'transparent',
                  textDecoration: 'none', display: 'block'
                }}>📁 媒体库</Link>
                <Link href="/admin/categories" onClick={() => setPathname('/admin/categories')} style={{
                  padding: '8px 12px', borderRadius: 6, fontSize: '.85rem', color: '#fff', opacity: .88,
                  background: isActive('/admin/categories') ? 'rgba(255,255,255,0.12)' : 'transparent',
                  textDecoration: 'none', display: 'block'
                }}>📁 分类管理</Link>
                <Link href="/admin/homepage" onClick={() => setPathname('/admin/homepage')} style={{
                  padding: '8px 12px', borderRadius: 6, fontSize: '.85rem', color: '#fff', opacity: .88,
                  background: isActive('/admin/homepage') ? 'rgba(255,255,255,0.12)' : 'transparent',
                  textDecoration: 'none', display: 'block'
                }}>🏠 首页管理</Link>
                <Link href="/admin/posts?category=community-qa" onClick={() => setPathname('/admin/community')} style={{
                  padding: '8px 12px', borderRadius: 6, fontSize: '.85rem', color: '#fff', opacity: .88,
                  background: pathname.startsWith('/admin/community') ? 'rgba(255,255,255,0.12)' : 'transparent',
                  textDecoration: 'none', display: 'block'
                }}>💬 工艺问答</Link>
              </div>
            )}
          </div>

          {/* 系统设置 */}
          <Link href="/admin/settings" onClick={() => setPathname('/admin/settings')} style={{
            padding: '10px 12px', borderRadius: 8, fontSize: '.9rem', color: '#fff', opacity: .88,
            background: isActive('/admin/settings') ? 'rgba(255,255,255,0.15)' : 'transparent',
            textDecoration: 'none', display: 'block', marginTop: 4,
          }}>⚙️ 系统设置</Link>

          <Link href="/" style={{ padding: '10px 12px', borderRadius: 8, fontSize: '.9rem', color: '#fff', opacity: .88, marginTop: 'auto', textDecoration: 'none', display: 'block' }}>🌐 返回前台</Link>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 32, background: '#F3F4F6', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
