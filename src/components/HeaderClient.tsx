'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { SiteGlobalConfig } from '@/lib/siteConfig';

type User = { id: number; email: string; name: string; role: string } | null;

interface HeaderClientProps {
  config: SiteGlobalConfig['header'];
}

export default function HeaderClient({ config }: HeaderClientProps) {
  const router = useRouter();
  const [searchQ, setSearchQ] = useState('');
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => { setUser(d.user); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      fetch('/api/notifications?unread=true')
        .then(r => r.json())
        .then(d => { setUnreadCount(d.notifications?.length || 0); })
        .catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => setMenuOpen(false);
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQ.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQ.trim())}`);
      setMenuOpen(false);
      setSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const navItems = config.navItems || [];

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo */}
        <Link href="/" className="logo flex-shrink-0">
          <span className="logo-icon">🥩</span>
          <span className="hidden sm:inline">{config.logoText || 'MeatTech Pro'}</span>
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <nav className="nav-menu hidden md:flex">
          {navItems.map((item, i) => (
            <a
              key={i}
              href={item.href}
              style={item.href === '/community' ? { color: '#FCD34D', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 } : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop right section — hidden on mobile */}
        <div className="nav-right hidden md:flex">
          <form onSubmit={handleSearch} className="search-box">
            <input
              ref={searchRef}
              type="text"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder={config.searchPlaceholder || '请输入原料、添加剂、生产故障或设备型号...'}
            />
            <button type="submit" className="search-btn">{config.searchBtnText || '🔍 全局硬核搜索'}</button>
          </form>

          {!loading && (
            user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" style={{ position: 'relative', fontSize: '1.1rem', color: '#fff', textDecoration: 'none' }} title="通知">
                  🔔
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: -4, right: -8, background: '#ef4444', color: '#fff', fontSize: '.65rem', fontWeight: 700, borderRadius: 10, padding: '1px 5px', minWidth: 16, textAlign: 'center' }}>{unreadCount > 99 ? '99+' : unreadCount}</span>
                  )}
                </Link>
                <Link href="/dashboard" style={{ fontSize: '.88rem', color: '#fff', fontWeight: 500, textDecoration: 'none' }}>
                  👤 {user.name || user.email}
                </Link>
                <button onClick={handleLogout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', padding: '6px 14px', borderRadius: 8, fontSize: '.82rem', cursor: 'pointer', color: '#fff' }}>
                  退出
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link href="/login" className="btn-login">登录</Link>
                <Link href="/register" className="btn-login" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '6px 16px', borderRadius: 8 }}>注册</Link>
              </div>
            )
          )}

          <Link href="/community/ask" style={{ background: 'rgba(252,211,77,0.2)', color: '#FCD34D', padding: '6px 16px', borderRadius: 20, fontSize: '.85rem', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(252,211,77,0.4)', whiteSpace: 'nowrap' }}>{config.askBtnText || '✏️ 提问'}</Link>
          <Link href="/booking" className="btn-book">{config.bookBtnText || '预约中试线🔥'}</Link>
        </div>

        {/* Mobile right section — visible only on mobile */}
        <div className="flex items-center gap-2 md:hidden ml-auto">
          {/* Mobile notification bell — only when logged in */}
          {!loading && user && (
            <Link href="/dashboard" className="p-2 text-white relative" aria-label="通知">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: 0, right: 0, background: '#ef4444', color: '#fff', fontSize: '.6rem', fontWeight: 700, borderRadius: 10, padding: '1px 4px', minWidth: 14, textAlign: 'center' }}>{unreadCount > 99 ? '99+' : unreadCount}</span>
              )}
            </Link>
          )}
          {/* Mobile search toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="搜索"
            className="p-2 text-white"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Hamburger button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="菜单"
            className="p-2 text-white"
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar — slides down when searchOpen */}
      {searchOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#1E3A8A] px-4 py-3">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              ref={searchRef}
              type="text"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder={config.searchPlaceholder || '搜索原料、添加剂、故障...'}
              className="flex-1 bg-white/10 text-white placeholder-white/50 rounded-lg px-4 py-2 text-sm outline-none border border-white/20"
            />
            <button type="submit" className="bg-orange-500 text-white rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap">
              🔍 搜索
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu — full screen overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-[999] bg-[#1E3A8A] overflow-y-auto">
          {/* Nav items */}
          <nav className="flex flex-col px-4 py-2">
            {navItems.map((item, i) => (
              <a
                key={i}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="py-3 px-2 text-white text-base font-medium border-b border-white/10 hover:bg-white/5 transition-colors"
                style={item.href === '/community' ? { color: '#FCD34D', fontWeight: 700 } : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Auth section */}
          <div className="px-4 py-4 border-b border-white/10">
            {!loading && (
              user ? (
                <div className="flex flex-col gap-3">
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-white text-base font-medium py-2">
                    👤 {user.name || user.email}
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="text-left text-white/80 text-base py-2"
                  >
                    退出登录
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center py-3 rounded-lg border border-white/30 text-white text-base font-medium"
                  >
                    登录
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center py-3 rounded-lg bg-white/15 text-white text-base font-medium"
                  >
                    注册
                  </Link>
                </div>
              )
            )}
          </div>

          {/* CTA buttons */}
          <div className="px-4 py-4 flex flex-col gap-3">
            <Link
              href="/community/ask"
              onClick={() => setMenuOpen(false)}
              className="text-center py-3 rounded-full text-base font-semibold"
              style={{ background: 'rgba(252,211,77,0.2)', color: '#FCD34D', border: '1px solid rgba(252,211,77,0.4)' }}
            >
              {config.askBtnText || '✏️ 提问'}
            </Link>
            <Link
              href="/booking"
              onClick={() => setMenuOpen(false)}
              className="btn-book text-center py-3 text-base"
            >
              {config.bookBtnText || '预约中试线🔥'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
