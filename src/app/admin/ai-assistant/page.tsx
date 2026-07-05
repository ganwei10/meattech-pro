'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RelevantPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  tags: string;
  views: number;
  score: number;
  url: string;
}

interface AIResult {
  question: string;
  relevantPosts: RelevantPost[];
  draftAnswer: string;
  totalMatched: number;
}

export default function AIAssistantPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [stats, setStats] = useState({ total: 0, unanswered: 0 });
  const [editMode, setEditMode] = useState(false);
  const [editedAnswer, setEditedAnswer] = useState('');
  const [publishTitle, setPublishTitle] = useState('');
  const [publishTags, setPublishTags] = useState('AI回答,自动生成');
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/ai-assistant')
      .then(r => r.json())
      .then(d => {
        setStats({ total: d.total || 0, unanswered: d.unanswered?.length || 0 });
      })
      .catch(() => {});
  }, []);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setResult(null);
    setEditMode(false);
    setMessage('');
    try {
      const res = await fetch('/api/admin/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, action: 'answer' }),
      });
      const data = await res.json();
      if (data.error) {
        setMessage(`❌ ${data.error}`);
      } else {
        setResult(data);
        setEditedAnswer(data.draftAnswer);
        setPublishTitle(data.question);
      }
    } catch {
      setMessage('❌ 请求失败');
    }
    setLoading(false);
  };

  const handlePublish = async () => {
    setPublishing(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish',
          title: publishTitle,
          content: editedAnswer,
          tags: publishTags,
          author: 'AI助手',
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setMessage(`✅ 已发布为新问答帖子：${data.slug}`);
        setResult(null);
        setQuestion('');
      } else {
        setMessage(`❌ ${data.error || '发布失败'}`);
      }
    } catch {
      setMessage('❌ 发布失败');
    }
    setPublishing(false);
  };

  const suggestedQuestions = [
    '香肠灌装后表面出现气泡怎么办？',
    '低温火腿保水性差怎么解决？',
    '肉制品色泽发暗是什么原因？',
    '滚揉真空度多少合适？',
    '气调包装货架期怎么延长？',
    '磷酸盐复配比例如何确定？',
    '斩拌温度怎么控制？',
    '香肠蒸煮后肠衣起皱怎么办？',
  ];

  const cardStyle = { background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' };
  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', boxSizing: 'border-box' as const };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>🤖 AI 工艺问答助手</h1>
      <p style={{ fontSize: '.9rem', color: '#6B7280', marginBottom: 24 }}>
        基于平台已有的 {stats.total} 个工艺问答知识库，智能匹配并生成回答。可编辑后一键发布为新的问答帖子。
      </p>

      {message && (
        <div style={{ padding: '10px 16px', borderRadius: 8, marginBottom: 20, background: message.startsWith('✅') ? '#D1FAE5' : '#FEE2E2', color: message.startsWith('✅') ? '#065F46' : '#991B1B', fontSize: '.9rem' }}>
          {message}
        </div>
      )}

      {/* Question input */}
      <div style={cardStyle}>
        <form onSubmit={handleAsk}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: '.9rem', fontWeight: 600 }}>输入工艺问题：</label>
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            rows={3}
            placeholder="例如：香肠灌装后表面出现气泡怎么办？"
            style={{ ...inputStyle, resize: 'vertical' }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="submit" disabled={loading || !question.trim()} style={{ padding: '10px 28px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '.9rem', opacity: loading || !question.trim() ? 0.5 : 1 }}>
              {loading ? '🔍 智能匹配中...' : '🤖 生成AI回答'}
            </button>
          </div>
        </form>

        {/* Suggested questions */}
        {!result && !loading && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
            <p style={{ fontSize: '.82rem', color: '#9CA3AF', marginBottom: 8 }}>💡 试试这些问题：</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {suggestedQuestions.map((q, i) => (
                <button key={i} onClick={() => setQuestion(q)} style={{ padding: '6px 14px', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 16, fontSize: '.82rem', cursor: 'pointer', color: '#374151' }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🤖</div>
          <p>正在搜索 {stats.total} 个工艺问答知识库...</p>
        </div>
      )}

      {/* AI Result */}
      {result && !loading && (
        <>
          {/* Relevant posts */}
          {result.relevantPosts.length > 0 && (
            <div style={cardStyle}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>
                📚 匹配到 {result.totalMatched} 条相关问答（显示前 {result.relevantPosts.length} 条）
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.relevantPosts.map((post, i) => (
                  <Link key={post.id} href={post.url} target="_blank" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: i === 0 ? '#FEF3C7' : '#F9FAFB', borderRadius: 8, textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '.9rem', fontWeight: 600, color: '#1F2937', marginBottom: 4 }}>
                        {i === 0 && '⭐ '}{post.title}
                      </div>
                      <div style={{ fontSize: '.78rem', color: '#9CA3AF' }}>
                        👁️ {post.views} 阅读 · 🏷️ {post.tags.split(',').slice(0, 3).join(', ')}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                      <span style={{ fontSize: '.72rem', padding: '2px 8px', borderRadius: 4, background: '#1E3A8A', color: '#fff', fontWeight: 600 }}>
                        匹配度 {post.score}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Draft answer */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>✍️ AI生成的回答草稿</h3>
              <button onClick={() => setEditMode(!editMode)} style={{ padding: '4px 12px', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 6, cursor: 'pointer', fontSize: '.82rem' }}>
                {editMode ? '👁️ 预览' : '✏️ 编辑'}
              </button>
            </div>

            {editMode ? (
              <textarea
                value={editedAnswer}
                onChange={e => setEditedAnswer(e.target.value)}
                rows={12}
                style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '.85rem', resize: 'vertical' }}
                placeholder="编辑回答内容（支持HTML格式）"
              />
            ) : (
              <div className="article-content" dangerouslySetInnerHTML={{ __html: editedAnswer }} style={{ fontSize: '.9rem', lineHeight: 1.8, color: '#374151' }} />
            )}

            {/* Publish controls */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.82rem', fontWeight: 500 }}>发布标题</label>
                  <input type="text" value={publishTitle} onChange={e => setPublishTitle(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '.82rem', fontWeight: 500 }}>标签（逗号分隔）</label>
                  <input type="text" value={publishTags} onChange={e => setPublishTags(e.target.value)} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handlePublish} disabled={publishing} style={{ padding: '10px 28px', background: '#059669', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '.9rem' }}>
                  {publishing ? '发布中...' : '📤 发布为问答帖子'}
                </button>
                <button onClick={() => { setResult(null); setQuestion(''); }} style={{ padding: '10px 20px', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 8, cursor: 'pointer', fontSize: '.9rem' }}>
                  新问题
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Stats footer */}
      <div style={{ marginTop: 24, padding: 16, background: '#DBEAFE', borderRadius: 8, fontSize: '.85rem', color: '#1E3A8A' }}>
        📊 知识库统计：共 {stats.total} 个问答帖子 · {stats.unanswered} 个待回答问题
        {stats.unanswered > 0 && (
          <Link href="/admin/posts?category=community-qa" style={{ marginLeft: 8, color: '#1E40AF', fontWeight: 600 }}>去处理 →</Link>
        )}
      </div>
    </div>
  );
}
