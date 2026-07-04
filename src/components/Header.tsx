'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type User = { id: number; email: string; name: string; role: string } | null;

export default function Header() {
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

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="logo">
          <span className="logo-icon">🥩</span>
          <span>MeatTech Pro</span>
        </Link>
        <nav className="nav-menu">
          <a href="/">首页</a>
          <a href="/#reverse">爆款逆向库</a>
          <a href="/#science">工艺配方智库</a>
          <a href="/#tools">数字工具箱</a>
          <a href="/#pilot">共享中试中心</a>
          <a href="/#industry">供应链选型</a>
        </nav>
        <div className="nav-right">
          <form onSubmit={handleSearch} className="search-box">
            <input
              ref={searchRef}
              type="text"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="请输入原料、添加剂、生产故障或设备型号..."
            />
            <button type="submit" className="search-btn">🔍 全局硬核搜索</button>
          </form>

          {!loading && (
            user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '.88rem', color: '#374151', fontWeight: 500 }}>
                  👤 {user.name || user.email}
                </span>
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

          <Link href="/booking" className="btn-book">预约中试线🔥</Link>
        </div>
      </div>
    </header>
  );
}
