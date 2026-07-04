export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6' }}>
      <div style={{ fontSize: '4rem', marginBottom: 16 }}>🔍</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1E3A8A', marginBottom: 8 }}>404 — 页面未找到</h1>
      <p style={{ color: '#6B7280', marginBottom: 24 }}>您访问的页面不存在或已被移除</p>
      <a href="/" style={{ background: '#1E3A8A', color: '#fff', padding: '12px 28px', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
        ← 返回首页
      </a>
    </div>
  );
}
