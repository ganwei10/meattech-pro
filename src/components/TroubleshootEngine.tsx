'use client';

import { useState, useEffect } from 'react';

type Node = {
  id: number;
  category: string;
  question: string;
  options: string;
  isLeaf: boolean;
  advice: string | null;
};

export default function TroubleshootEngine() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    fetch('/api/troubleshoot').then(r => r.json()).then(data => {
      setNodes(data);
      setLoading(false);
    });
  }, []);

  const categories = [...new Set(nodes.map(n => n.category))];

  const startCategory = (cat: string) => {
    setSelectedCategory(cat);
    const first = nodes.find(n => n.category === cat);
    setCurrentNode(first || null);
    setHistory([]);
  };

  const selectOption = (nextNodeId: number) => {
    if (!currentNode) return;
    setHistory([...history, currentNode.id]);
    const next = nodes.find(n => n.id === nextNodeId);
    setCurrentNode(next || null);
  };

  const goBack = () => {
    if (history.length === 0) return;
    const prevId = history[history.length - 1];
    const prev = nodes.find(n => n.id === prevId);
    setCurrentNode(prev || null);
    setHistory(history.slice(0, -1));
  };

  const reset = () => {
    setCurrentNode(null);
    setSelectedCategory('');
    setHistory([]);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF' }}>加载故障排查决策树...</div>;
  }

  if (!selectedCategory) {
    return (
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8, color: '#1E3A8A' }}>选择故障类别</h2>
        <p style={{ fontSize: '.88rem', color: '#6B7280', marginBottom: 24 }}>选择您遇到的问题类型，系统将引导您逐步排查</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {categories.map(cat => (
            <div key={cat} onClick={() => startCategory(cat)} style={{ padding: 24, borderRadius: 12, border: '2px solid #E5E7EB', cursor: 'pointer', transition: 'all .2s', background: '#fff' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#1E3A8A'; e.currentTarget.style.background = '#EFF6FF'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#fff'; }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>
                {cat.includes('出水') ? '💧' : cat.includes('出油') ? '🫧' : cat.includes('散') ? '🧩' : cat.includes('色') ? '🎨' : cat.includes('味') ? '👅' : '⚠️'}
              </div>
              <div style={{ fontWeight: 700, fontSize: '.95rem' }}>{cat}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!currentNode) return null;

  let options: { text: string; nextNodeId: number; advice?: string }[] = [];
  try {
    options = JSON.parse(currentNode.options);
  } catch { options = []; }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <span style={{ fontSize: '.75rem', background: '#FEE2E2', color: '#991B1B', padding: '2px 8px', borderRadius: 4 }}>{selectedCategory}</span>
          <span style={{ fontSize: '.82rem', color: '#9CA3AF', marginLeft: 12 }}>步骤 {history.length + 1}</span>
        </div>
        <button onClick={reset} style={{ background: 'none', border: '1px solid #E5E7EB', padding: '6px 14px', borderRadius: 6, fontSize: '.82rem', cursor: 'pointer', color: '#6B7280' }}>重新开始</button>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 24, color: '#1E3A8A' }}>{currentNode.question}</h3>

        {currentNode.isLeaf && currentNode.advice ? (
          <div style={{ padding: 24, borderRadius: 12, background: '#D1FAE5', border: '1px solid #6EE7B7' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>✅</div>
            <h4 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 12, color: '#065F46' }}>排查建议</h4>
            <div style={{ fontSize: '.9rem', lineHeight: 1.8, color: '#064E3B' }} dangerouslySetInnerHTML={{ __html: currentNode.advice }} />
            {history.length > 0 && (
              <button onClick={goBack} style={{ marginTop: 20, background: '#fff', border: '1px solid #6EE7B7', padding: '8px 16px', borderRadius: 8, fontSize: '.85rem', cursor: 'pointer', color: '#065F46' }}>← 返回上一步</button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {options.map((opt, i) => (
              <button key={i} onClick={() => selectOption(opt.nextNodeId)} style={{ textAlign: 'left', padding: '16px 20px', borderRadius: 10, border: '2px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: '.92rem', transition: 'all .2s', color: '#374151' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#1E3A8A'; e.currentTarget.style.background = '#EFF6FF'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#fff'; }}>
                <span style={{ display: 'inline-flex', width: 28, height: 28, borderRadius: '50%', background: '#F3F4F6', alignItems: 'center', justifyContent: 'center', fontSize: '.8rem', fontWeight: 700, marginRight: 12 }}>{String.fromCharCode(65 + i)}</span>
                {opt.text}
              </button>
            ))}
            {history.length > 0 && (
              <button onClick={goBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#9CA3AF', fontSize: '.82rem', cursor: 'pointer', marginTop: 8 }}>← 返回上一步</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
