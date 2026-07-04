'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error('Admin page error:', error);
  }, [error]);

  return (
    <div style={{ padding: 32, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ background: '#FEE2E2', border: '1px solid #EF4444', borderRadius: 12, padding: 24 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#991B1B', marginBottom: 12 }}>
          ⚠️ 页面加载出错
        </h2>
        <p style={{ color: '#991B1B', fontSize: '.9rem', marginBottom: 16 }}>
          管理员页面遇到错误，请尝试以下操作：
        </p>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <button
            onClick={reset}
            style={{ background: '#1E3A8A', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: '.9rem', fontWeight: 600, cursor: 'pointer' }}
          >
            重试
          </button>
          <Link
            href="/admin"
            style={{ background: '#F3F4F6', color: '#374151', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: '.9rem', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}
          >
            返回仪表盘
          </Link>
        </div>
        <details style={{ marginTop: 16 }}>
          <summary style={{ cursor: 'pointer', fontSize: '.85rem', color: '#6B7280' }}>
            查看错误详情
          </summary>
          <pre style={{ background: '#F3F4F6', padding: 12, borderRadius: 8, fontSize: '.8rem', overflow: 'auto', marginTop: 8 }}>
            {error.message}
            {'\n'}
            {error.digest && `Digest: ${error.digest}`}
          </pre>
        </details>
      </div>
    </div>
  );
}
