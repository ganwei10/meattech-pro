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
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => { setUser(d.user); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQ.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQ.trim())}`);
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
        <Link href="/" className="logo">
          <span className="logo-icon">🥩</span>
          <span>{config.logoText || 'MeatTech Pro'}</span>
        </Link>
        <nav className="nav-menu">
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
        <div className="nav-right">
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Link href="/dashboard" style={{ fontSize: '.88rem', color: '#1E3A8A', fontWeight: 500, textDecoration: 'none' }}>
                  👤 {user.name || user.email}
                </Link>
                <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #E5E7EB', padding: '6px 14px', borderRadius: 8, fontSize: '.82rem', cursor: 'pointer', color: '#6B7280' }}>
                  退出
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Link href="/login" className="btn-login">登录</Link>
                <Link href="/register" className="btn-login" style={{ background: '#1E3A8A', color: '#fff' }}>注册</Link>
              </div>
            )
          )}

          <Link href="/community/ask" style={{ background: 'rgba(252,211,77,0.2)', color: '#FCD34D', padding: '6px 16px', borderRadius: 20, fontSize: '.85rem', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(252,211,77,0.4)', whiteSpace: 'nowrap' }}>{config.askBtnText || '✏️ 提问'}</Link>
          <Link href="/booking" className="btn-book">{config.bookBtnText || '预约中试线🔥'}</Link>
        </div>
      </div>
    </header>
  );
}
