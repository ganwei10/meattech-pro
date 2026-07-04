'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Setting {
  key: string;
  value: string;
}

interface ArticleSource {
  name: string;
  url: string;
  type: 'rss' | 'html';
  category: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // 通知设置
  const [email, setEmail] = useState('gwei10@qq.com');
  const [phone, setPhone] = useState('+8618688889823');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpFrom, setSmtpFrom] = useState('noreply@meattech.pro');
  const [smsWebhook, setSmsWebhook] = useState('');

  // 文章来源
  const [sources, setSources] = useState<ArticleSource[]>([
    { name: '食品伙伴网', url: 'https://www.foodmate.net/rss.xml', type: 'rss', category: '中式酱卤肉制品' },
    { name: 'Food Navigator', url: 'https://www.foodnavigator.com/RSS', type: 'rss', category: '西式低温熏煮肉制品' },
    { name: 'Meat Science', url: 'https://www.sciencedirect.com/journal/meat-science/rss', type: 'rss', category: '发酵与肉干制品' },
  ]);
  const [newSource, setNewSource] = useState<ArticleSource>({ name: '', url: '', type: 'rss', category: '中式酱卤肉制品' });
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'notify' | 'sources' | 'fetch'>('notify');
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.user?.role === 'ADMIN') {
          setIsAdmin(true);
          loadSettings();
        }
        setChecking(false);
      });
  }, []);

  const loadSettings = async () => {
    const res = await fetch('/api/admin/settings');
    if (res.ok) {
      const data = await res.json();
      setEmail(data.notify_email || 'gwei10@qq.com');
      setPhone(data.notify_phone || '+8618688889823');
      setSmtpHost(data.smtp_host || '');
      setSmtpPort(data.smtp_port || '587');
      setSmtpUser(data.smtp_user || '');
      setSmtpPass(data.smtp_pass || '');
      setSmtpFrom(data.smtp_from || 'noreply@meattech.pro');
      setSmsWebhook(data.sms_webhook || '');
      if (data.article_sources) {
        try { setSources(JSON.parse(data.article_sources)); } catch {}
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const settings = {
      notify_email: email,
      notify_phone: phone,
      smtp_host: smtpHost,
      smtp_port: smtpPort,
      smtp_user: smtpUser,
      smtp_pass: smtpPass,
      smtp_from: smtpFrom,
      sms_webhook: smsWebhook,
      article_sources: JSON.stringify(sources),
    };

    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });

    if (res.ok) {
      setMessage('✅ 设置已保存');
    } else {
      setMessage('❌ 保存失败');
    }
    setSaving(false);
  };

  const handleFetchArticles = async () => {
    setFetching(true);
    setMessage('');
    const res = await fetch('/api/admin/fetch-articles');
    const data = await res.json();
    if (data.success) {
      setMessage(`✅ ${data.message}`);
    } else {
      setMessage(`❌ 爬取失败: ${data.error || '未知错误'}`);
    }
    setFetching(false);
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    setMessage('');
    const res = await fetch('/api/admin/test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmailAddress || email }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage(`✅ 测试邮件已发送到 ${testEmailAddress || email}`);
    } else {
      setMessage(`❌ 邮件发送失败: ${data.error || '未知错误'}`);
    }
    setTestingEmail(false);
  };

  const addSource = () => {
    if (newSource.name && newSource.url) {
      setSources([...sources, { ...newSource }]);
      setNewSource({ name: '', url: '', type: 'rss', category: '中式酱卤肉制品' });
    }
  };

  const removeSource = (index: number) => {
    setSources(sources.filter((_, i) => i !== index));
  };

  if (checking) return <div style={{ padding: 32, color: '#9CA3AF' }}>检查权限...</div>;
  if (!isAdmin) return <div style={{ padding: 32 }}>无权限访问</div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>系统设置</h1>

      {message && (
        <div style={{ background: message.startsWith('✅') ? '#D1FAE5' : '#FEE2E2', color: message.startsWith('✅') ? '#065F46' : '#991B1B', padding: '12px 16px', borderRadius: 10, marginBottom: 24, fontSize: '.9rem' }}>
          {message}
        </div>
      )}

      {/* Tab 切换 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #E5E7EB', paddingBottom: 12 }}>
        {(['notify', 'sources', 'fetch'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: activeTab === tab ? '#1E3A8A' : '#F3F4F6', color: activeTab === tab ? '#fff' : '#374151', cursor: 'pointer', fontSize: '.9rem', fontWeight: activeTab === tab ? 700 : 400 }}>
            {tab === 'notify' ? '📧 通知设置' : tab === 'sources' ? '📰 文章来源' : '🔄 手动爬取'}
          </button>
        ))}
      </div>

      {/* 通知设置 */}
      {activeTab === 'notify' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>邮件通知</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>通知邮箱</label>
                <input value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>SMTP 服务器</label>
                <input value={smtpHost} onChange={e => setSmtpHost(e.target.value)} placeholder="smtp.gmail.com" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>SMTP 端口</label>
                <input value={smtpPort} onChange={e => setSmtpPort(e.target.value)} placeholder="587" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>SMTP 用户名</label>
                <input value={smtpUser} onChange={e => setSmtpUser(e.target.value)} placeholder="your@email.com" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>SMTP 密码</label>
                <input type="password" value={smtpPass} onChange={e => setSmtpPass(e.target.value)} placeholder="邮箱授权码/密码" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>发件人</label>
                <input value={smtpFrom} onChange={e => setSmtpFrom(e.target.value)} placeholder="noreply@meattech.pro" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ marginTop: 16, fontSize: '.82rem', color: '#9CA3AF' }}>
              💡 如不配置 SMTP，系统将使用 Resend API（需设置 RESEND_API_KEY 环境变量）或控制台输出模式
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
              <input value={testEmailAddress} onChange={e => setTestEmailAddress(e.target.value)} placeholder="测试邮箱地址（留空则使用通知邮箱）" style={{ flex: 1, padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, boxSizing: 'border-box' }} />
              <button onClick={handleTestEmail} disabled={testingEmail} style={{ background: '#059669', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: '.9rem', fontWeight: 600, cursor: testingEmail ? 'not-allowed' : 'pointer', opacity: testingEmail ? 0.7 : 1 }}>
                {testingEmail ? '发送中...' : '📧 测试邮件'}
              </button>
            </div>
          </div>

          <div style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>短信通知</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>通知手机号</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+8618688889823" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>短信 Webhook URL</label>
                <input value={smsWebhook} onChange={e => setSmsWebhook(e.target.value)} placeholder="https://your-sms-service.com/send" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ marginTop: 16, fontSize: '.82rem', color: '#9CA3AF' }}>
              💡 配置 Webhook 后，新预约将自动发送短信。如未配置，短信将通过控制台输出（开发模式）
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} style={{ alignSelf: 'flex-start', background: '#1E3A8A', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: '.95rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? '保存中...' : '保存设置'}
          </button>
        </div>
      )}

      {/* 文章来源管理 */}
      {activeTab === 'sources' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>当前来源</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sources.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#F9FAFB', borderRadius: 8, fontSize: '.9rem' }}>
                  <span style={{ background: s.type === 'rss' ? '#DBEAFE' : '#D1FAE5', color: s.type === 'rss' ? '#1E3A8A' : '#065F46', padding: '2px 8px', borderRadius: 4, fontSize: '.78rem' }}>{s.type.toUpperCase()}</span>
                  <span style={{ fontWeight: 600, minWidth: 120 }}>{s.name}</span>
                  <span style={{ color: '#6B7280', flex: 1, fontSize: '.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.url}</span>
                  <span style={{ color: '#9CA3AF', fontSize: '.82rem' }}>{s.category}</span>
                  <button onClick={() => removeSource(i)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '.9rem' }}>删除</button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>添加来源</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 120px 160px', gap: 12, alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>名称</label>
                <input value={newSource.name} onChange={e => setNewSource({ ...newSource, name: e.target.value })} placeholder="网站名称" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>URL</label>
                <input value={newSource.url} onChange={e => setNewSource({ ...newSource, url: e.target.value })} placeholder="https://..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>类型</label>
                <select value={newSource.type} onChange={e => setNewSource({ ...newSource, type: e.target.value as 'rss' | 'html' })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, boxSizing: 'border-box' }}>
                  <option value="rss">RSS</option>
                  <option value="html">HTML</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>分类</label>
                <select value={newSource.category} onChange={e => setNewSource({ ...newSource, category: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, boxSizing: 'border-box' }}>
                  <option>中式酱卤肉制品</option>
                  <option>西式低温熏煮肉制品</option>
                  <option>速冻调制肉制品（预制菜）</option>
                  <option>发酵与肉干制品</option>
                </select>
              </div>
            </div>
            <button onClick={addSource} style={{ marginTop: 16, background: '#059669', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: '.9rem', fontWeight: 600, cursor: 'pointer' }}>添加来源</button>
          </div>

          <button onClick={handleSave} disabled={saving} style={{ alignSelf: 'flex-start', background: '#1E3A8A', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: '.95rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? '保存中...' : '保存来源配置'}
          </button>
        </div>
      )}

      {/* 手动爬取 */}
      {activeTab === 'fetch' && (
        <div style={{ background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔄</div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>手动触发文章爬取</h2>
          <p style={{ color: '#6B7280', fontSize: '.9rem', marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
            将从已配置的文章来源（{sources.length} 个）爬取最新文章，自动创建草稿等待审核发布。建议在配置完文章来源后手动触发一次测试。
          </p>
          <button onClick={handleFetchArticles} disabled={fetching} style={{ background: '#1E3A8A', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 10, fontSize: '1rem', fontWeight: 700, cursor: fetching ? 'not-allowed' : 'pointer', opacity: fetching ? 0.7 : 1 }}>
            {fetching ? '爬取中...' : '开始爬取文章'}
          </button>
          <p style={{ marginTop: 16, fontSize: '.82rem', color: '#9CA3AF' }}>
            💡 生产环境将每天自动执行（由 Vercel Cron 触发）
          </p>
        </div>
      )}
    </div>
  );
}
