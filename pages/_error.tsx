import type { NextPageContext } from 'next';

function ErrorPage({ statusCode }: { statusCode: number }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif' }}>
      <div style={{ fontSize: '4rem', marginBottom: 16 }}>⚠️</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1E3A8A', marginBottom: 8 }}>
        {statusCode} — 服务器错误
      </h1>
      <p style={{ color: '#6B7280', marginBottom: 24 }}>
        {statusCode === 404 ? '您访问的页面不存在' : '页面加载时出现异常，请稍后重试'}
      </p>
      <a href="/" style={{ background: '#1E3A8A', color: '#fff', padding: '12px 28px', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
        ← 返回首页
      </a>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode ?? 500 : 404;
  return { statusCode };
};

export default ErrorPage;
