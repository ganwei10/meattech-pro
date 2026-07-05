'use client';

import { useState, useEffect } from 'react';

interface ReviewUser {
  name: string;
  email: string;
}

interface Review {
  id: number;
  rating: number;
  content: string;
  reply: string | null;
  replyAt: string | null;
  createdAt: string;
  user: ReviewUser;
}

interface ReviewSectionProps {
  bookingId: number;
}

export default function ReviewSection({ bookingId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // check auth
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.user) setUser(d.user);
        setCheckingAuth(false);
      })
      .catch(() => setCheckingAuth(false));
  }, []);

  useEffect(() => {
    loadReviews();
  }, [bookingId]);

  const loadReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/reviews?bookingId=${bookingId}`);
      if (!res.ok) {
        setError('加载评价失败');
        return;
      }
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {
      setError('加载评价失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0 || !content.trim()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, rating, content: content.trim() }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setSubmitError(d.error || '提交失败，请稍后重试');
        return;
      }
      setSubmitSuccess(true);
      setRating(0);
      setContent('');
      loadReviews();
    } catch {
      setSubmitError('提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const Star = ({ filled, half }: { filled: boolean; half?: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? '#F59E0B' : 'none'} stroke={filled ? '#F59E0B' : '#D1D5DB'} strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );

  const starSelectStyle: React.CSSProperties = {
    background: 'none', border: 'none', cursor: 'pointer', padding: 2,
  };

  if (checkingAuth) return null;

  return (
    <div className="review-section" style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1F2937', marginBottom: 24 }}>
        用户评价
        {reviews.length > 0 && <span style={{ fontSize: '.9rem', fontWeight: 400, color: '#9CA3AF', marginLeft: 8 }}>({reviews.length})</span>}
      </h2>

      {/* Review form */}
      <div style={{ background: '#F9FAFB', borderRadius: 12, padding: 20, marginBottom: 24, border: '1px solid #E5E7EB' }}>
        {!user && (
          <div style={{ textAlign: 'center', padding: '16px 0', color: '#9CA3AF' }}>
            <p style={{ margin: 0, fontSize: '.9rem' }}>请先<a href="/login" style={{ color: '#1E3A8A', fontWeight: 600 }}>登录</a>后再评价</p>
          </div>
        )}
        {user && (
          <div>
            <div style={{ fontSize: '.9rem', fontWeight: 600, color: '#374151', marginBottom: 12 }}>发表评价</div>
            {/* Star rating selector */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 12, alignItems: 'center' }}>
              <span style={{ fontSize: '.85rem', color: '#6B7280', marginRight: 8 }}>评分：</span>
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={starSelectStyle}
                >
                  <Star filled={i <= (hoverRating || rating)} />
                </button>
              ))}
              {rating > 0 && <span style={{ fontSize: '.8rem', color: '#F59E0B', marginLeft: 8, fontWeight: 600 }}>{rating} 星</span>}
            </div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="分享您的中试体验..."
              rows={3}
              style={{
                width: '100%', padding: '12px 14px', border: '1px solid #E5E7EB', borderRadius: 8,
                fontSize: '.9rem', resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
            {submitError && <p style={{ fontSize: '.82rem', color: '#EF4444', margin: '8px 0 0 0' }}>{submitError}</p>}
            {submitSuccess && <p style={{ fontSize: '.82rem', color: '#059669', margin: '8px 0 0 0' }}>评价提交成功！</p>}
            <button
              onClick={handleSubmit}
              disabled={submitting || rating === 0 || !content.trim()}
              style={{
                marginTop: 12, padding: '8px 24px', borderRadius: 8, border: 'none',
                background: submitting || rating === 0 || !content.trim()
                  ? '#D1D5DB'
                  : 'linear-gradient(135deg, #F97316, #DC2626)',
                color: '#fff', fontSize: '.9rem', fontWeight: 600, cursor: submitting || rating === 0 || !content.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? '提交中...' : '提交评价'}
            </button>
          </div>
        )}
      </div>

      {/* Reviews list */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 24, color: '#9CA3AF', fontSize: '.9rem' }}>加载评价中...</div>
      )}
      {error && (
        <div style={{ textAlign: 'center', padding: 16, color: '#EF4444', fontSize: '.85rem' }}>{error}</div>
      )}
      {!loading && !error && reviews.length === 0 && (
        <div style={{ textAlign: 'center', padding: 24, color: '#9CA3AF', fontSize: '.9rem' }}>暂无评价</div>
      )}
      {!loading && reviews.map(review => (
        <div key={review.id} style={{ background: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 600, fontSize: '.9rem', color: '#1F2937' }}>{review.user?.name || review.user?.email || '匿名用户'}</span>
              <div style={{ display: 'flex', gap: 0 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} filled={i <= review.rating} />
                ))}
              </div>
            </div>
            <span style={{ fontSize: '.78rem', color: '#9CA3AF' }}>{new Date(review.createdAt).toLocaleDateString('zh-CN')}</span>
          </div>
          <p style={{ fontSize: '.88rem', color: '#374151', lineHeight: 1.6, margin: '0 0 0 0' }}>{review.content}</p>
          {review.reply && (
            <div style={{ marginTop: 12, padding: '12px 14px', background: '#F0F9FF', borderRadius: 8, border: '1px solid #BAE6FD' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '.78rem', fontWeight: 600, color: '#0369A1' }}>机构回复</span>
                {review.replyAt && <span style={{ fontSize: '.72rem', color: '#7DD3FC' }}>{new Date(review.replyAt).toLocaleDateString('zh-CN')}</span>}
              </div>
              <p style={{ fontSize: '.85rem', color: '#0369A1', lineHeight: 1.5, margin: 0 }}>{review.reply}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
