'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardData {
  stats: {
    postCount: number;
    productCount: number;
    lineCount: number;
    bookingCount: number;
    pendingBookings: number;
  };
  recentPosts: Array<{
    id: number;
    title: string;
    slug: string;
    createdAt: string;
    category: { name: string };
    views: number;
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(String(err));
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 32, color: '#9CA3AF' }}>
        加载中...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 32 }}>
        <div style={{ background: '#FEE2E2', border: '1px solid #EF4444', borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#991B1B', marginBottom: 8 }}>
            ⚠️ 加载失败
          </h2>
          <p style={{ color: '#991B1B', fontSize: '.9rem' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 16, background: '#1E3A8A', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: '.9rem', cursor: 'pointer' }}
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { label: '技术文章', value: data.stats.postCount, icon: '📝', color: '#DBEAFE', text: '#1E3A8A' },
    { label: '逆向产品', value: data.stats.productCount, icon: '🛒', color: '#D1FAE5', text: '#065F46' },
    { label: '中试产线', value: data.stats.lineCount, icon: '🏭', color: '#FEF3C7', text: '#92400E' },
    { label: '预约总数', value: data.stats.bookingCount, icon: '📅', color: '#FEE2E2', text: '#991B1B' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>仪表盘</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: s.color, color: s.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: 12 }}>{s.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{s.value}</div>
            <div style={{ fontSize: '.85rem', color: '#6B7280' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {data.stats.pendingBookings > 0 && (
        <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 12, padding: 16, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.2rem' }}>⏰</span>
          <span style={{ fontSize: '.9rem', color: '#92400E' }}>有 <strong>{data.stats.pendingBookings}</strong> 条待处理的预约请求，<a href="/admin/bookings" style={{ color: '#1E3A8A', fontWeight: 600 }}>点击查看 →</a></span>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>最近发布文章</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.recentPosts.map(post => (
            <div key={post.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
              <div>
                <span style={{ fontSize: '.78rem', background: '#DBEAFE', color: '#1E3A8A', padding: '2px 8px', borderRadius: 4, marginRight: 8 }}>{post.category.name}</span>
                <span style={{ fontSize: '.9rem', fontWeight: 500 }}>{post.title}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: '.8rem', color: '#9CA3AF' }}>
                <span>👁️ {post.views}</span>
                <span>{new Date(post.createdAt).toISOString().slice(0, 10)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
