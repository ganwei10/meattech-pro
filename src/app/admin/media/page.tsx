'use client';

import { useState, useEffect, useRef } from 'react';

type MediaItem = {
  id: number;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl: string | null;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  duration: number | null;
  type: string;
  folder: string;
  alt: string;
  caption: string;
  createdAt: string;
};

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');
  const [folder, setFolder] = useState('');
  const [search, setSearch] = useState('');
  const [folders, setFolders] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadFolder, setUploadFolder] = useState('default');
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pageSize = 20;

  const fetchMedia = async (newPage?: number) => {
    setLoading(true);
    const p = newPage || page;
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (folder) params.set('folder', folder);
    if (search) params.set('search', search);
    params.set('page', String(p));

    try {
      const res = await fetch(`/api/admin/media?${params.toString()}`);
      const data = await res.json();
      setMedia(data.media || []);
      setTotal(data.total || 0);
      setFolders(data.folders || []);
      setPage(p);
    } catch (err) {
      setMessage('加载失败: ' + String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia(1);
  }, [type, folder, search]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', uploadFolder);
    formData.append('alt', uploadAlt);
    formData.append('caption', uploadCaption);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setMessage('✅ 上传成功');
        setUploadAlt('');
        setUploadCaption('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchMedia(1);
        setShowUpload(false);
      } else {
        const data = await res.json();
        setMessage('上传失败: ' + (data.error || '未知错误'));
      }
    } catch (err) {
      setMessage('上传失败: ' + String(err));
    } finally {
      setUploading(false);
    }
  };

  const handleUrlUpload = async () => {
    if (!uploadUrl) return;
    setUploading(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: uploadUrl,
          folder: uploadFolder,
          alt: uploadAlt,
          caption: uploadCaption,
        }),
      });
      if (res.ok) {
        setMessage('✅ 添加成功');
        setUploadUrl('');
        setUploadAlt('');
        setUploadCaption('');
        fetchMedia(1);
        setShowUpload(false);
      } else {
        const data = await res.json();
        setMessage('添加失败: ' + (data.error || '未知错误'));
      }
    } catch (err) {
      setMessage('添加失败: ' + String(err));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number, url: string) => {
    if (!confirm('确定要删除此媒体吗？')) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('✅ 删除成功');
        fetchMedia();
      }
    } catch (err) {
      setMessage('删除失败: ' + String(err));
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>📁 媒体库</h1>
        <button
          onClick={() => setShowUpload(!showUpload)}
          style={{ padding: '8px 20px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.9rem', fontWeight: 600, cursor: 'pointer' }}
        >
          ＋ 上传媒体
        </button>
      </div>

      {message && (
        <div style={{ background: message.includes('失败') ? '#FEE2E2' : '#D1FAE5', color: message.includes('失败') ? '#991B1B' : '#065F46', padding: '8px 12px', borderRadius: 8, fontSize: '.85rem', marginBottom: 16 }}>
          {message}
        </div>
      )}

      {/* 上传面板 */}
      {showUpload && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16 }}>上传新媒体</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>文件夹</label>
              <input value={uploadFolder} onChange={e => setUploadFolder(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem' }} placeholder="default" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>Alt 描述</label>
              <input value={uploadAlt} onChange={e => setUploadAlt(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem' }} placeholder="图片描述（可选）" />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, marginBottom: 6 }}>说明/标题</label>
            <input value={uploadCaption} onChange={e => setUploadCaption(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem' }} placeholder="图片说明（可选）" />
          </div>

          {/* 文件上传 */}
          <div style={{ marginBottom: 16, padding: 16, background: '#F9FAFB', borderRadius: 8 }}>
            <div style={{ fontSize: '.9rem', fontWeight: 600, marginBottom: 8 }}>方式一：本地上传</div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              disabled={uploading}
              style={{ fontSize: '.9rem' }}
            />
          </div>

          {/* URL 输入 */}
          <div style={{ padding: 16, background: '#F9FAFB', borderRadius: 8 }}>
            <div style={{ fontSize: '.9rem', fontWeight: 600, marginBottom: 8 }}>方式二：输入 URL</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={uploadUrl}
                onChange={e => setUploadUrl(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem' }}
                placeholder="https://example.com/image.jpg"
              />
              <button
                onClick={handleUrlUpload}
                disabled={uploading || !uploadUrl}
                style={{ padding: '8px 16px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 8, cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading || !uploadUrl ? 0.6 : 1 }}
              >
                {uploading ? '处理中...' : '添加'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 筛选栏 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <select value={type} onChange={e => setType(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem' }}>
          <option value="">全部类型</option>
          <option value="IMAGE">图片</option>
          <option value="VIDEO">视频</option>
        </select>
        <select value={folder} onChange={e => setFolder(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem' }}>
          <option value="">全部文件夹</option>
          {folders.map(f => (
            <option key={f.name} value={f.name}>{f.name} ({f.count})</option>
          ))}
        </select>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', flex: 1, maxWidth: 300 }}
          placeholder="搜索文件名、描述..."
        />
      </div>

      {/* 媒体网格 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#9CA3AF' }}>加载中...</div>
      ) : media.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#9CA3AF' }}>暂无媒体文件</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {media.map(m => (
            <div key={m.id} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'relative' }}>
              <div
                style={{ width: '100%', height: 140, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {m.type === 'IMAGE' ? (
                  <img src={m.url} alt={m.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ fontSize: '3rem' }}>🎬</div>
                )}
              </div>
              <div style={{ padding: 8 }}>
                <div style={{ fontSize: '.78rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>{m.originalName}</div>
                <div style={{ fontSize: '.72rem', color: '#9CA3AF', marginBottom: 4 }}>{formatSize(m.size)} | {m.type === 'VIDEO' ? `视频 ${formatDuration(m.duration)}` : `${m.width}x${m.height}`}</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.origin + m.url);
                      setMessage('✅ URL 已复制');
                    }}
                    style={{ flex: 1, padding: '4px 8px', background: '#F3F4F6', border: 'none', borderRadius: 4, fontSize: '.75rem', cursor: 'pointer', color: '#1E3A8A' }}
                  >
                    复制URL
                  </button>
                  <button
                    onClick={() => handleDelete(m.id, m.url)}
                    style={{ padding: '4px 8px', background: '#FEE2E2', border: 'none', borderRadius: 4, fontSize: '.75rem', cursor: 'pointer', color: '#991B1B' }}
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 分页 */}
      {total > pageSize && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button onClick={() => fetchMedia(page - 1)} disabled={page <= 1} style={{ padding: '8px 16px', background: '#F3F4F6', border: 'none', borderRadius: 8, cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1 }}>上一页</button>
          <span style={{ padding: '8px 16px', fontSize: '.9rem', color: '#6B7280' }}>{page} / {Math.ceil(total / pageSize)}</span>
          <button onClick={() => fetchMedia(page + 1)} disabled={page >= Math.ceil(total / pageSize)} style={{ padding: '8px 16px', background: '#F3F4F6', border: 'none', borderRadius: 8, cursor: page >= Math.ceil(total / pageSize) ? 'not-allowed' : 'pointer', opacity: page >= Math.ceil(total / pageSize) ? 0.5 : 1 }}>下一页</button>
        </div>
      )}
    </div>
  );
}
