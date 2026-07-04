'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AskQuestionPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    author: '',
    contactPhone: '',
    contactEmail: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('请输入问题标题');
      return;
    }
    if (!form.content.trim()) {
      setError('请输入问题描述');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/community/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/community'), 2000);
      } else {
        setError(data.error || '提交失败，请重试');
      }
    } catch {
      setError('网络错误，请重试');
    }
    setSubmitting(false);
  };

  const tagSuggestions = ['出水', '散肉', '色泽不均', '保质期', '风味', '质构', '灌装', '蒸煮', '包装', '添加剂', '减盐', '清洁标签'];

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6' }}>
        <div style={{ textAlign: 'center', background: '#fff', padding: 40, borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#065F46', marginBottom: 8 }}>提问成功！</h2>
          <p style={{ fontSize: '.9rem', color: '#6B7280' }}>正在跳转到社区列表...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6', padding: '40px 0' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ marginBottom: 24 }}>
          <Link href="/community" style={{ fontSize: '.85rem', color: '#6B7280', textDecoration: 'none' }}>← 返回社区</Link>
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E3A8A', marginBottom: 8 }}>✏️ 提出你的工艺问题</h1>
        <p style={{ fontSize: '.9rem', color: '#6B7280', marginBottom: 32 }}>描述越详细，越容易得到同行专家的解答。建议包含：产品类型、现象描述、已尝试方案、设备条件等。</p>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: '.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {/* Title */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '.9rem', fontWeight: 600, color: '#374151' }}>问题标题 *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="例：低温火腿蒸煮后出水严重，如何优化保水方案？"
              maxLength={120}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none', boxSizing: 'border-box' }}
            />
            <span style={{ fontSize: '.75rem', color: '#9CA3AF', marginTop: 4, display: 'block' }}>{form.title.length}/120</span>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '.9rem', fontWeight: 600, color: '#374151' }}>问题标签</label>
            <input
              type="text"
              value={form.tags}
              onChange={e => setForm({ ...form, tags: e.target.value })}
              placeholder="用逗号分隔，如：出水,保水,低温火腿"
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
            />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {tagSuggestions.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    const current = form.tags.split(',').map(s => s.trim()).filter(Boolean);
                    if (!current.includes(t)) {
                      setForm({ ...form, tags: [...current, t].join(',') });
                    }
                  }}
                  style={{ padding: '3px 10px', borderRadius: 12, fontSize: '.75rem', border: '1px solid #E5E7EB', background: '#F9FAFB', color: '#6B7280', cursor: 'pointer' }}
                >
                  + {t}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '.9rem', fontWeight: 600, color: '#374151' }}>问题描述 *</label>
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value, excerpt: e.target.value.slice(0, 200) })}
              placeholder={`请详细描述你的问题：\n\n1. 产品类型（如低温火腿、酱卤牛肉等）\n2. 现象描述（如蒸煮后出水率15%）\n3. 当前配方要点（如磷酸盐添加量0.3%）\n4. 工艺参数（如蒸煮温度80℃/时间40min）\n5. 已尝试的方案及效果`}
              rows={10}
              style={{ width: '100%', padding: '12px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6, resize: 'vertical' }}
            />
          </div>

          {/* Contact info */}
          <div style={{ marginBottom: 24, padding: 16, background: '#F9FAFB', borderRadius: 10 }}>
            <p style={{ fontSize: '.85rem', fontWeight: 600, color: '#374151', marginBottom: 12 }}>联系方式（可选，方便同行私信交流）</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.8rem', color: '#6B7280' }}>称呼</label>
                <input type="text" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="张工 / 李总监" style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.85rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.8rem', color: '#6B7280' }}>手机</label>
                <input type="tel" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} placeholder="138xxxx" style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.85rem', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: '.8rem', color: '#6B7280' }}>邮箱</label>
              <input type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} placeholder="engineer@company.com" style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.85rem', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={submitting} style={{ flex: 1, padding: '12px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.95rem', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? '提交中...' : '发布问题'}
            </button>
            <Link href="/community" style={{ padding: '12px 24px', background: '#F3F4F6', color: '#374151', borderRadius: 8, fontSize: '.95rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>取消</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
