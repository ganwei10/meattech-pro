'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AskConfig {
  backBtn: string;
  title: string;
  desc: string;
  titleLabel: string;
  titlePlaceholder: string;
  tagsLabel: string;
  tagsPlaceholder: string;
  tagSuggestions: string[];
  contentLabel: string;
  contentPlaceholder: string;
  contactTitle: string;
  authorLabel: string;
  authorPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  submitBtn: string;
  submittingBtn: string;
  cancelBtn: string;
  successIcon: string;
  successTitle: string;
  successDesc: string;
  errorTitleRequired: string;
  errorContentRequired: string;
  errorNetwork: string;
}

export default function AskQuestionClient({ config: c }: { config: AskConfig }) {
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
      setError(c.errorTitleRequired);
      return;
    }
    if (!form.content.trim()) {
      setError(c.errorContentRequired);
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
      setError(c.errorNetwork);
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6' }}>
        <div style={{ textAlign: 'center', background: '#fff', padding: 40, borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>{c.successIcon}</div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#065F46', marginBottom: 8 }}>{c.successTitle}</h2>
          <p style={{ fontSize: '.9rem', color: '#6B7280' }}>{c.successDesc}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6', padding: '40px 0' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ marginBottom: 24 }}>
          <Link href="/community" style={{ fontSize: '.85rem', color: '#6B7280', textDecoration: 'none' }}>{c.backBtn}</Link>
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E3A8A', marginBottom: 8 }}>{c.title}</h1>
        <p style={{ fontSize: '.9rem', color: '#6B7280', marginBottom: 32 }}>{c.desc}</p>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: '.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {/* Title */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '.9rem', fontWeight: 600, color: '#374151' }}>{c.titleLabel}</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder={c.titlePlaceholder}
              maxLength={120}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none', boxSizing: 'border-box' }}
            />
            <span style={{ fontSize: '.75rem', color: '#9CA3AF', marginTop: 4, display: 'block' }}>{form.title.length}/120</span>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '.9rem', fontWeight: 600, color: '#374151' }}>{c.tagsLabel}</label>
            <input
              type="text"
              value={form.tags}
              onChange={e => setForm({ ...form, tags: e.target.value })}
              placeholder={c.tagsPlaceholder}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
            />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {c.tagSuggestions.map(t => (
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
            <label style={{ display: 'block', marginBottom: 6, fontSize: '.9rem', fontWeight: 600, color: '#374151' }}>{c.contentLabel}</label>
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value, excerpt: e.target.value.slice(0, 200) })}
              placeholder={c.contentPlaceholder}
              rows={10}
              style={{ width: '100%', padding: '12px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6, resize: 'vertical' }}
            />
          </div>

          {/* Contact info */}
          <div style={{ marginBottom: 24, padding: 16, background: '#F9FAFB', borderRadius: 10 }}>
            <p style={{ fontSize: '.85rem', fontWeight: 600, color: '#374151', marginBottom: 12 }}>{c.contactTitle}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.8rem', color: '#6B7280' }}>{c.authorLabel}</label>
                <input type="text" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder={c.authorPlaceholder} style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.85rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.8rem', color: '#6B7280' }}>{c.phoneLabel}</label>
                <input type="tel" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} placeholder={c.phonePlaceholder} style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.85rem', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: '.8rem', color: '#6B7280' }}>{c.emailLabel}</label>
              <input type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} placeholder={c.emailPlaceholder} style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.85rem', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={submitting} style={{ flex: 1, padding: '12px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.95rem', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? c.submittingBtn : c.submitBtn}
            </button>
            <Link href="/community" style={{ padding: '12px 24px', background: '#F3F4F6', color: '#374151', borderRadius: 8, fontSize: '.95rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>{c.cancelBtn}</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
