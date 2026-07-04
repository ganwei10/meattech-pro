'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="zh-CN">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>⚠️</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#991B1B', marginBottom: 8 }}>500 — 服务器错误</h1>
          <p style={{ color: '#6B7280', marginBottom: 24 }}>页面加载时出现异常，请稍后重试</p>
          <button
            onClick={() => reset()}
            style={{ background: '#1E3A8A', color: '#fff', padding: '12px 28px', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '1rem' }}
          >
            重新加载
          </button>
        </div>
      </body>
    </html>
  );
}
