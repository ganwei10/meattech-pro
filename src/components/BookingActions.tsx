'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingActions({ id, currentStatus }: { id: number; currentStatus: string }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    setUpdating(false);
  };

  const btnStyle = (bg: string, color: string) => ({
    background: bg, color, border: 'none', padding: '4px 12px',
    borderRadius: 6, fontSize: '.78rem', fontWeight: 600, cursor: 'pointer', opacity: updating ? 0.5 : 1,
  });

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {currentStatus === 'PENDING' && (
        <>
          <button onClick={() => updateStatus('CONFIRMED')} style={btnStyle('#D1FAE5', '#065F46')} disabled={updating}>确认</button>
          <button onClick={() => updateStatus('CANCELLED')} style={btnStyle('#FEE2E2', '#991B1B')} disabled={updating}>拒绝</button>
        </>
      )}
      {currentStatus === 'CONFIRMED' && (
        <>
          <button onClick={() => updateStatus('IN_PROGRESS')} style={btnStyle('#DBEAFE', '#1E40AF')} disabled={updating}>开始执行</button>
          <button onClick={() => updateStatus('CANCELLED')} style={btnStyle('#FEE2E2', '#991B1B')} disabled={updating}>取消</button>
        </>
      )}
      {currentStatus === 'IN_PROGRESS' && (
        <button onClick={() => updateStatus('COMPLETED')} style={btnStyle('#D1FAE5', '#065F46')} disabled={updating}>完成</button>
      )}
      {(currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') && (
        <span style={{ fontSize: '.78rem', color: '#9CA3AF' }}>已结束</span>
      )}
    </div>
  );
}
