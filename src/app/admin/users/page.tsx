'use client';

import { useState, useEffect } from 'react';

export default function UsersAdminPage() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'EDITOR', phone: '', company: '' });
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [userBills, setUserBills] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.user && d.user.role === 'ADMIN') {
          setIsAdmin(true);
          loadUsers();
        }
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (isAdmin) loadUsers();
  }, [page, roleFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.set('keyword', keyword);
      if (roleFilter) params.set('role', roleFilter);
      params.set('page', String(page));
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
        setTotal(data.total);
      }
    } catch (e) {
      console.error('Failed to load users', e);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      if (editingUser) {
        const res = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setMessage('✅ 用户已更新');
          setShowModal(false);
          resetForm();
          loadUsers();
        } else {
          const d = await res.json();
          setMessage(`❌ ${d.error || '更新失败'}`);
        }
      } else {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setMessage('✅ 用户已创建');
          setShowModal(false);
          resetForm();
          setPage(1);
          loadUsers();
        } else {
          const d = await res.json();
          setMessage(`❌ ${d.error || '创建失败'}`);
        }
      }
    } catch (e) {
      setMessage('❌ 操作失败');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`确定要删除用户「${name}」吗？`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('✅ 用户已删除');
        loadUsers();
      }
    } catch (e) {
      setMessage('❌ 删除失败');
    }
  };

  const openDetail = async (user: any) => {
    setSelectedUser(user);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`);
      const data = await res.json();
      if (data.bookings) setUserBookings(data.bookings);
      if (data.bills) setUserBills(data.bills);
    } catch (e) {
      console.error('Failed to load user detail', e);
    }
  };

  const resetForm = () => {
    setForm({ email: '', password: '', name: '', role: 'EDITOR', phone: '', company: '' });
    setEditingUser(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (user: any) => {
    setForm({ email: user.email, password: '', name: user.name, role: user.role, phone: user.phone || '', company: user.company || '' });
    setEditingUser(user);
    setShowModal(true);
  };

  if (checking) return <div style={{ padding: 60, textAlign: 'center' }}>检查权限中...</div>;
  if (!isAdmin) return <div style={{ padding: 60, textAlign: 'center', color: '#EF4444' }}>无权访问</div>;

  const totalPages = Math.ceil(total / 20);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>👥 用户管理</h1>

      {message && (
        <div style={{
          padding: '10px 16px', borderRadius: 8, marginBottom: 20,
          background: message.startsWith('✅') ? '#D1FAE5' : '#FEE2E2',
          color: message.startsWith('✅') ? '#065F46' : '#991B1B',
          fontSize: '.9rem',
        }}>
          {message}
        </div>
      )}

      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: '总用户数', value: total, color: '#1E3A8A' },
          { label: '管理员', value: users.filter(u => u.role === 'ADMIN').length, color: '#7C3AED' },
          { label: '普通用户', value: users.filter(u => u.role === 'EDITOR').length, color: '#059669' },
          { label: '今日新增', value: users.filter(u => new Date(u.createdAt).toDateString() === new Date().toDateString()).length, color: '#D97706' },
        ].map((card, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '.85rem', color: '#6B7280', marginBottom: 8 }}>{card.label}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* 搜索和筛选 */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1 }}>
          <input
            type="text"
            placeholder="搜索姓名、邮箱、电话..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            style={{ flex: 1, padding: '8px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none' }}
          />
          <select
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none' }}
          >
            <option value="">全部角色</option>
            <option value="ADMIN">管理员</option>
            <option value="EDITOR">普通用户</option>
          </select>
          <button type="submit" style={{ padding: '8px 20px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '.9rem' }}>
            搜索
          </button>
        </form>
        <button onClick={openCreate} style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '.9rem', whiteSpace: 'nowrap' }}>
          ＋ 新增用户
        </button>
      </div>

      {/* 用户表格 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>加载中...</div>
      ) : (
        <>
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>姓名</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>邮箱</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>角色</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>电话</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>公司</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>注册时间</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>最后登录</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>预约数</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: '.85rem', fontWeight: 600, color: '#6B7280' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    <td style={{ padding: 12, fontWeight: 600, color: '#1E3A8A' }}>{u.name}</td>
                    <td style={{ padding: 12, fontSize: '.9rem' }}>{u.email}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: '.78rem', fontWeight: 600,
                        background: u.role === 'ADMIN' ? '#EDE9FE' : '#F3F4F6',
                        color: u.role === 'ADMIN' ? '#7C3AED' : '#374151',
                      }}>
                        {u.role === 'ADMIN' ? '管理员' : '普通用户'}
                      </span>
                    </td>
                    <td style={{ padding: 12, fontSize: '.9rem' }}>{u.phone || '-'}</td>
                    <td style={{ padding: 12, fontSize: '.9rem' }}>{u.company || '-'}</td>
                    <td style={{ padding: 12, fontSize: '.85rem', color: '#6B7280' }}>{new Date(u.createdAt).toISOString().slice(0, 10)}</td>
                    <td style={{ padding: 12, fontSize: '.85rem', color: '#6B7280' }}>{u.lastLogin ? new Date(u.lastLogin).toISOString().slice(0, 10) : '从未登录'}</td>
                    <td style={{ padding: 12, fontSize: '.9rem' }}>{u.bookingCount || 0}</td>
                    <td style={{ padding: 12 }}>
                      <button onClick={() => openDetail(u)} style={{ background: 'none', border: '1px solid #E5E7EB', padding: '4px 10px', borderRadius: 6, fontSize: '.82rem', cursor: 'pointer', marginRight: 6 }}>详情</button>
                      <button onClick={() => openEdit(u)} style={{ background: 'none', border: '1px solid #E5E7EB', padding: '4px 10px', borderRadius: 6, fontSize: '.82rem', cursor: 'pointer', marginRight: 6 }}>编辑</button>
                      <button onClick={() => handleDelete(u.id, u.name)} style={{ background: 'none', border: '1px solid #FECACA', padding: '4px 10px', borderRadius: 6, fontSize: '.82rem', cursor: 'pointer', color: '#EF4444' }}>删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>上一页</button>
              <span style={{ padding: '6px 14px', fontSize: '.9rem' }}>第 {page} 页 / 共 {totalPages} 页</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>下一页</button>
            </div>
          )}
        </>
      )}

      {/* 新增/编辑弹窗 */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 500, maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 20 }}>{editingUser ? '编辑用户' : '新增用户'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>邮箱 *</label>
                <input type="email" required disabled={!!editingUser}
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>密码 {editingUser ? '（留空不修改）' : '*'}</label>
                <input type="password" required={!editingUser}
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>姓名 *</label>
                <input type="text" required
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>角色</label>
                <select
                  value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="EDITOR">普通用户</option>
                  <option value="ADMIN">管理员</option>
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>电话</label>
                <input type="text"
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '.9rem', fontWeight: 500 }}>公司</label>
                <input type="text"
                  value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} style={{ padding: '8px 20px', background: '#F3F4F6', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '.9rem' }}>取消</button>
                <button type="submit" style={{ padding: '8px 20px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '.9rem' }}>{editingUser ? '保存' : '创建'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 用户详情弹窗 */}
      {selectedUser && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20,
        }}
          onClick={() => setSelectedUser(null)}
        >
          <div style={{
            background: '#fff', borderRadius: 16, padding: 32, width: 700, maxHeight: '80vh',
            overflowY: 'auto', position: 'relative',
          }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setSelectedUser(null)} style={{
              position: 'absolute', top: 16, right: 16, background: 'none', border: 'none',
              fontSize: '1.5rem', cursor: 'pointer', color: '#9CA3AF',
            }}>×</button>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E3A8A', marginBottom: 4 }}>{selectedUser.name}</h2>
            <div style={{ fontSize: '.85rem', color: '#6B7280', marginBottom: 20 }}>{selectedUser.email}</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              <div style={{ background: '#F9FAFB', padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: '.78rem', color: '#9CA3AF', marginBottom: 4 }}>注册时间</div>
                <div style={{ fontWeight: 600 }}>{new Date(selectedUser.createdAt).toISOString().slice(0, 10)}</div>
              </div>
              <div style={{ background: '#F9FAFB', padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: '.78rem', color: '#9CA3AF', marginBottom: 4 }}>最后登录</div>
                <div style={{ fontWeight: 600 }}>{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toISOString().slice(0, 10) : '从未登录'}</div>
              </div>
              <div style={{ background: '#F9FAFB', padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: '.78rem', color: '#9CA3AF', marginBottom: 4 }}>预约数</div>
                <div style={{ fontWeight: 600, color: '#1E3A8A' }}>{userBookings.length}</div>
              </div>
              <div style={{ background: '#F9FAFB', padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: '.78rem', color: '#9CA3AF', marginBottom: 4 }}>已支付账单</div>
                <div style={{ fontWeight: 600, color: '#059669' }}>{userBills.filter(b => b.status === 'PAID').length}</div>
              </div>
            </div>

            {selectedUser.phone && <div style={{ fontSize: '.9rem', marginBottom: 6 }}>📞 {selectedUser.phone}</div>}
            {selectedUser.company && <div style={{ fontSize: '.9rem', marginBottom: 6 }}>🏢 {selectedUser.company}</div>}

            {/* 预约历史 */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #E5E7EB' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>预约历史</h3>
              {userBookings.length === 0 ? (
                <div style={{ color: '#9CA3AF', fontSize: '.9rem' }}>暂无预约记录</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {userBookings.map(b => (
                    <div key={b.id} style={{ background: '#F9FAFB', padding: 12, borderRadius: 8, fontSize: '.9rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600 }}>#{b.id} - {b.line?.name || '未知产线'}</span>
                        <span style={{
                          padding: '2px 8px', borderRadius: 20, fontSize: '.78rem', fontWeight: 600,
                          background: b.status === 'CONFIRMED' ? '#D1FAE5' : b.status === 'COMPLETED' ? '#DBEAFE' : '#FEF3C7',
                          color: b.status === 'CONFIRMED' ? '#065F46' : b.status === 'COMPLETED' ? '#1E3A8A' : '#92400E',
                        }}>
                          {b.status === 'PENDING' ? '待确认' : b.status === 'CONFIRMED' ? '已确认' : b.status === 'COMPLETED' ? '已完成' : b.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '.85rem', color: '#6B7280', marginTop: 4 }}>{new Date(b.createdAt).toISOString().slice(0, 10)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 账单历史 */}
            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>账单历史</h3>
              {userBills.length === 0 ? (
                <div style={{ color: '#9CA3AF', fontSize: '.9rem' }}>暂无账单记录</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {userBills.map(b => (
                    <div key={b.id} style={{ background: '#F9FAFB', padding: 12, borderRadius: 8, fontSize: '.9rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600 }}>账单 #{b.id} - {b.line?.name || '未知产线'}</span>
                        <span style={{
                          padding: '2px 8px', borderRadius: 20, fontSize: '.78rem', fontWeight: 600,
                          background: b.status === 'PAID' ? '#D1FAE5' : '#FEE2E2',
                          color: b.status === 'PAID' ? '#065F46' : '#991B1B',
                        }}>
                          {b.status === 'PAID' ? '已支付' : '待支付'}
                        </span>
                      </div>
                      <div style={{ marginTop: 4, display: 'flex', gap: 16, fontSize: '.85rem', color: '#6B7280' }}>
                        <span>金额: ¥{b.totalAmount?.toFixed(2)}</span>
                        <span>{new Date(b.createdAt).toISOString().slice(0, 10)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
