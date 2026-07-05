'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  targetType: 'ARTICLE' | 'PILOT_LINE';
  targetId: number;
}

export default function FavoriteButton({ targetType, targetId }: FavoriteButtonProps) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          setUser(d.user);
          checkFavorited();
        } else {
          setCheckingAuth(false);
          setLoading(false);
        }
      })
      .catch(() => {
        setCheckingAuth(false);
        setLoading(false);
      });
  }, []);

  const checkFavorited = async () => {
    try {
      const res = await fetch('/api/favorites');
      if (!res.ok) return;
      const data = await res.json();
      const favorites = data.favorites || [];
      setFavorited(favorites.some((f: { targetType: string; targetId: number }) => f.targetType === targetType && f.targetId === targetId));
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setCheckingAuth(false);
    }
  };

  const handleClick = async () => {
    if (checkingAuth) return;
    if (!user) {
      router.push('/login');
      return;
    }
    setToggling(true);
    try {
      if (favorited) {
        await fetch('/api/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetType, targetId }),
        });
        setFavorited(false);
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetType, targetId }),
        });
        setFavorited(true);
      }
    } catch {
      // ignore toggle errors
    } finally {
      setToggling(false);
    }
  };

  const HeartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={favorited ? '#EF4444' : 'none'} stroke={favorited ? '#EF4444' : '#9CA3AF'} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );

  if (loading) {
    return (
      <button disabled style={{ background: 'none', border: 'none', cursor: 'not-allowed', padding: 4, opacity: 0.4 }}>
        <HeartIcon />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={toggling}
      style={{
        background: 'none',
        border: 'none',
        cursor: toggling ? 'not-allowed' : 'pointer',
        padding: 4,
        opacity: toggling ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      title={favorited ? '取消收藏' : '添加收藏'}
    >
      <HeartIcon />
    </button>
  );
}
