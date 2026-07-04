'use client';

import { useState } from 'react';

type Additive = {
  id: number;
  name: string;
  alias: string;
  casNumber: string | null;
  functionClass: string;
  maxLimit: string;
  foodCategory: string;
  remarks: string;
};

export default function GB2760Calculator() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Additive[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Additive | null>(null);
  const [productWeight, setProductWeight] = useState('100');
  const [useAmount, setUseAmount] = useState('');

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/additives?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
    setSelected(null);
    setLoading(false);
  };

  const calcResult = () => {
    if (!selected || !productWeight || !useAmount) return null;
    const weight = parseFloat(productWeight);
    const amount = parseFloat(useAmount);
    if (isNaN(weight) || isNaN(amount)) return null;
    const limitMatch = selected.maxLimit.match(/([\d.]+)/);
    const limit = limitMatch ? parseFloat(limitMatch[1]) : 0;
    if (limit === 0) return null;
    const maxAmount = (limit * weight) / 1000;
    const isCompliant = amount <= maxAmount;
    const usagePercent = (amount / maxAmount) * 100;
    return { maxAmount, isCompliant, usagePercent };
  };

  const calc = calcResult();

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8, color: '#1E3A8A' }}>GB 2760 添加剂限量合规计算器</h2>
        <p style={{ fontSize: '.88rem', color: '#6B7280', marginBottom: 24 }}>输入添加剂名称或功能类别，查询最大使用量并计算合规性</p>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="如：亚硝酸钠、脱氢乙酸钠、防腐剂..."
            style={{ flex: 1, padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.95rem', outline: 'none' }}
          />
          <button onClick={search} disabled={loading} style={{ background: '#1E3A8A', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 8, fontSize: '.95rem', fontWeight: 700, cursor: 'pointer' }}>{loading ? '查询中...' : '查询'}</button>
        </div>
        {results.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.map(a => (
              <div key={a.id} onClick={() => setSelected(a)} style={{ padding: '14px 16px', borderRadius: 10, border: selected?.id === a.id ? '2px solid #1E3A8A' : '1px solid #E5E7EB', cursor: 'pointer', background: selected?.id === a.id ? '#EFF6FF' : '#fff', transition: 'all .2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '.95rem' }}>{a.name}</span>
                    {a.alias && <span style={{ fontSize: '.82rem', color: '#6B7280', marginLeft: 8 }}>({a.alias})</span>}
                  </div>
                  <span style={{ fontSize: '.75rem', padding: '2px 8px', borderRadius: 4, background: '#FEF3C7', color: '#92400E' }}>{a.functionClass}</span>
                </div>
                <div style={{ fontSize: '.82rem', color: '#6B7280', marginTop: 4 }}>最大使用量: <strong style={{ color: '#991B1B' }}>{a.maxLimit}</strong> | 适用: {a.foodCategory}</div>
              </div>
            ))}
          </div>
        )}
        {results.length === 0 && query && !loading && (
          <div style={{ textAlign: 'center', padding: 32, color: '#9CA3AF' }}>
            <p>未找到相关添加剂，请尝试其他关键词</p>
          </div>
        )}
      </div>

      {selected && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20 }}>{selected.name} — 合规计算</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>产品总量 (kg)</label>
              <input type="number" value={productWeight} onChange={e => setProductWeight(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.95rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>实际添加量 (g)</label>
              <input type="number" value={useAmount} onChange={e => setUseAmount(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.95rem', outline: 'none' }} />
            </div>
          </div>
          {calc && (
            <div style={{ padding: 20, borderRadius: 12, background: calc.isCompliant ? '#D1FAE5' : '#FEE2E2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: '1.5rem' }}>{calc.isCompliant ? '✅' : '⚠️'}</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: calc.isCompliant ? '#065F46' : '#991B1B' }}>
                  {calc.isCompliant ? '合规' : '超标！'}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '.9rem' }}>
                <div><span style={{ color: '#6B7280' }}>最大允许添加量:</span> <strong>{calc.maxAmount.toFixed(2)} g</strong></div>
                <div><span style={{ color: '#6B7280' }}>实际添加量:</span> <strong>{useAmount} g</strong></div>
                <div><span style={{ color: '#6B7280' }}>用量占比:</span> <strong style={{ color: calc.usagePercent > 80 ? '#D97706' : '#065F46' }}>{calc.usagePercent.toFixed(1)}%</strong></div>
                <div><span style={{ color: '#6B7280' }}>标准限量:</span> <strong>{selected.maxLimit}</strong></div>
              </div>
              {calc.usagePercent > 80 && calc.isCompliant && (
                <div style={{ marginTop: 12, padding: '8px 12px', background: '#FEF3C7', borderRadius: 8, fontSize: '.82rem', color: '#92400E' }}>⚠️ 用量已达限量的 {calc.usagePercent.toFixed(0)}%，建议复核工艺精度</div>
              )}
            </div>
          )}
          {selected.remarks && (
            <div style={{ marginTop: 16, padding: 14, background: '#F3F4F6', borderRadius: 8, fontSize: '.82rem', color: '#6B7280' }}>📋 {selected.remarks}</div>
          )}
        </div>
      )}
    </div>
  );
}
