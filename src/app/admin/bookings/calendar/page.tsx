'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#F59E0B',
  CONFIRMED: '#059669',
  IN_PROGRESS: '#3B82F6',
  COMPLETED: '#6B7280',
  CANCELLED: '#DC2626',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: '待处理',
  CONFIRMED: '已确认',
  IN_PROGRESS: '执行中',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
};

export default function CalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 获取当月第一天和最后一天
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay(); // 0=周日, 1=周一...
  const daysInMonth = lastDay.getDate();

  // 加载预约数据
  const loadBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
      const res = await fetch(`/api/admin/bookings?startDate=${startDate}&endDate=${endDate}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || data || []);
      }
    } catch (e) {
      setError('加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [year, month]);

  // 切换月份
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  // 获取某天的预约
  const getBookingsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bookings.filter((b: any) => {
      const bookingDate = new Date(b.preferredDate || b.createdAt).toISOString().split('T')[0];
      return bookingDate === dateStr;
    });
  };

  // 月份名称
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

  // 选中日期的预约
  const selectedBookings = selectedDate
    ? bookings.filter((b: any) => {
        const d = new Date(b.preferredDate || b.createdAt).toISOString().split('T')[0];
        return d === selectedDate;
      })
    : [];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      {/* 顶部导航 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E3A8A' }}>📅 预约日历</h1>
        <Link href="/admin/bookings" style={{ color: '#1E3A8A', textDecoration: 'none', fontSize: '.9rem' }}>
          ← 返回列表视图
        </Link>
      </div>

      {error && (
        <div style={{ padding: 12, background: '#FEE2E2', color: '#991B1B', borderRadius: 8, marginBottom: 16 }}>
          ❌ {error}
        </div>
      )}

      {/* 月份切换 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.1)' }}>
        <button onClick={prevMonth} style={{ padding: '8px 16px', background: '#F3F4F6', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '.9rem' }}>
          ← 上月
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1E3A8A' }}>{year}年 {monthNames[month]}</div>
          <button onClick={goToday} style={{ marginTop: 4, padding: '4px 12px', background: '#EFF6FF', border: '1px solid #1E3A8A', borderRadius: 6, color: '#1E3A8A', cursor: 'pointer', fontSize: '.8rem' }}>
            今天
          </button>
        </div>
        <button onClick={nextMonth} style={{ padding: '8px 16px', background: '#F3F4F6', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '.9rem' }}>
          下月 →
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 20 }}>
        {/* 日历网格 */}
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.1)', padding: 16 }}>
          {/* 星期头 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 8 }}>
            {dayNames.map(d => (
              <div key={d} style={{ textAlign: 'center', padding: 8, fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>
                {d}
              </div>
            ))}
          </div>

          {/* 日期网格 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {/* 填充上月的空白 */}
            {Array.from({ length: startDay === 0 ? 6 : startDay - 1 }).map((_, i) => (
              <div key={`empty-${i}`} style={{ padding: 8, minHeight: 80 }} />
            ))}
            {/* 当月日期 */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayBookings = getBookingsForDate(day);
              const isToday = new Date().toISOString().split('T')[0] === dateStr;
              const isSelected = selectedDate === dateStr;
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  style={{
                    padding: 8,
                    minHeight: 80,
                    border: `2px solid ${isSelected ? '#1E3A8A' : isToday ? '#3B82F6' : '#E5E7EB'}`,
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: isSelected ? '#EFF6FF' : isToday ? '#F0F9FF' : 'white',
                    transition: 'all .2s',
                  }}
                >
                  <div style={{ fontSize: '.9rem', fontWeight: isToday ? 700 : 400, color: isToday ? '#3B82F6' : '#374151', marginBottom: 4 }}>
                    {day}
                  </div>
                  {/* 预约状态指示 */}
                  {dayBookings.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {dayBookings.slice(0, 3).map((b: any) => (
                        <div
                          key={b.id}
                          title={`${b.contactName} - ${STATUS_LABELS[b.status] || b.status}`}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: STATUS_COLORS[b.status] || '#9CA3AF',
                          }}
                        />
                      ))}
                      {dayBookings.length > 3 && (
                        <div style={{ fontSize: '.7rem', color: '#6B7280' }}>+{dayBookings.length - 3}</div>
                      )}
                    </div>
                  )}
                  {dayBookings.length > 0 && (
                    <div style={{ fontSize: '.7rem', color: '#6B7280', marginTop: 2 }}>
                      {dayBookings.length} 个预约
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 右侧详情面板 */}
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.1)', padding: 16, height: 'fit-content' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: 16 }}>
            {selectedDate ? `${selectedDate} 的预约` : '📋 预约详情'}
          </h3>
          {!selectedDate && (
            <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>
              点击日历上的日期查看预约
            </div>
          )}
          {selectedDate && selectedBookings.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>
              当天无预约
            </div>
          )}
          {selectedBookings.map((b: any) => (
            <div key={b.id} style={{ padding: 12, border: '1px solid #E5E7EB', borderRadius: 8, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontWeight: 600, color: '#1E3A8A' }}>#{b.id}</div>
                <div style={{ padding: '2px 8px', borderRadius: 12, fontSize: '.75rem', background: STATUS_COLORS[b.status] + '20', color: STATUS_COLORS[b.status] }}>
                  {STATUS_LABELS[b.status] || b.status}
                </div>
              </div>
              <div style={{ fontSize: '.85rem', color: '#374151', marginBottom: 4 }}>👤 {b.contactName}</div>
              <div style={{ fontSize: '.85rem', color: '#374151', marginBottom: 4 }}>🏭 {b.line?.name || '-'}</div>
              <div style={{ fontSize: '.85rem', color: '#374151', marginBottom: 4 }}>📞 {b.contactPhone}</div>
              <div style={{ fontSize: '.8rem', color: '#6B7280', marginTop: 8, lineHeight: 1.4 }}>
                {b.requirement?.slice(0, 50) || '-'}
              </div>
              <button
                onClick={() => router.push(`/admin/bookings?id=${b.id}`)}
                style={{ marginTop: 8, padding: '4px 12px', background: '#1E3A8A', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '.8rem', width: '100%' }}
              >
                查看详情
              </button>
            </div>
          ))}

          {/* 图例 */}
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: '.85rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>状态图例</div>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: STATUS_COLORS[key] }} />
                <span style={{ fontSize: '.8rem', color: '#6B7280' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
