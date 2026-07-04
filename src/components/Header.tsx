'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const [searchQ, setSearchQ] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQ.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQ.trim())}`);
    }
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
          <Link href="/register" className="btn-login">注册</Link>
          <Link href="/admin" className="btn-login">登录</Link>
          <Link href="/booking" className="btn-book">预约中试线🔥</Link>
        </div>
      </div>
    </header>
  );
}
