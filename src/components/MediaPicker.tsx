'use client';

import { useState } from 'react';

type MediaItem = {
  id: number;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl: string | null;
  mimeType: string;
  size: number;
  type: string;
  folder: string;
  alt: string;
  caption: string;
  createdAt: string;
};

type MediaPickerProps = {
  onSelect: (url: string) => void;
  onClose: () => void;
};

export default function MediaPicker({ onSelect, onClose }: MediaPickerProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 12;

  const fetchMedia = async (newPage?: number) => {
    setLoading(true);
    const p = newPage || page;
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (search) params.set('search', search);
    params.set('page', String(p));

    try {
      const res = await fetch(`/api/admin/media?${params.toString()}`);
      const data = await res.json();
      setMedia(data.media || []);
      setTotal(data.total || 0);
      setPage(p);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  if (loading && media.length === 0) {
    fetchMedia(1);
  }

  const handleSearch = () => {
    setPage(1);
    fetchMedia(1);
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
    setPage(1);
    // 重新加载
    const params = new URLSearchParams();
    if (newType) params.set('type', newType);
    fetchMedia(1);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '90%', maxWidth: 900, maxHeight: '85vh', overflow: 'auto', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>选择媒体</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        </div>

        {/* 筛选 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <select value={type} onChange={e => handleTypeChange(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.85rem' }}>
            <option value="">全部类型</option>
            <option value="IMAGE">图片</option>
            <option value="VIDEO">视频</option>
          </select>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            style={{ flex: 1, padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '.85rem' }}
            placeholder="搜索..."
          />
          <button onClick={handleSearch} style={{ padding: '6px 12px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 6, fontSize: '.85rem', cursor: 'pointer' }}>搜索</button>
        </div>

        {/* 媒体网格 */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#9CA3AF' }}>加载中...</div>
        ) : media.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#9CA3AF' }}>暂无媒体，请先上传</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12, marginBottom: 16 }}>
            {media.map(m => (
              <div
                key={m.id}
                onClick={() => { onSelect(m.url); onClose(); }}
                style={{ border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden', cursor: 'pointer' }}
              >
                <div style={{ width: '100%', height: 100, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {m.type === 'IMAGE' ? (
                    <img src={m.url} alt={m.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ fontSize: '2rem' }}>🎬</div>
                  )}
                </div>
                <div style={{ padding: '4px 8px', fontSize: '.72rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.originalName}</div>
              </div>
            ))}
          </div>
        )}

        {/* 分页 */}
        {total > pageSize && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <button onClick={() => { setPage(p => p - 1); fetchMedia(page - 1); }} disabled={page <= 1} style={{ padding: '6px 12px', background: '#F3F4F6', border: 'none', borderRadius: 6, cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1 }}>上一页</button>
            <span style={{ padding: '6px 12px', fontSize: '.85rem', color: '#6B7280' }}>{page} / {Math.ceil(total / pageSize)}</span>
            <button onClick={() => { setPage(p => p + 1); fetchMedia(page + 1); }} disabled={page >= Math.ceil(total / pageSize)} style={{ padding: '6px 12px', background: '#F3F4F6', border: 'none', borderRadius: 6, cursor: page >= Math.ceil(total / pageSize) ? 'not-allowed' : 'pointer', opacity: page >= Math.ceil(total / pageSize) ? 0.5 : 1 }}>下一页</button>
          </div>
        )}

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <a href="/admin/media" target="_blank" style={{ fontSize: '.85rem', color: '#1E3A8A', textDecoration: 'none' }}>打开媒体库上传新文件 →</a>
        </div>
      </div>
    </div>
  );
}
