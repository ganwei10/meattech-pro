'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PayPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [bill, setBill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('wechat');
  const [message, setMessage] = useState('');

  const loadBill = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bills/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setBill(data);
      } else {
        setMessage('❌ 账单不存在');
      }
    } catch (err) {
      setMessage(`❌ ${String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBill();
  }, [params.id]);

  const handlePay = async () => {
    setPaying(true);
    setMessage('');
    try {
      // 模拟支付（实际应调用微信支付/支付宝 API）
      const res = await fetch(`/api/bills/${params.id}/pay`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod,
          transactionId: `SIM_${Date.now()}`, // 模拟交易号
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ 支付成功！');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setMessage(`❌ 支付失败: ${data.error}`);
      }
    } catch (err) {
      setMessage(`❌ 支付失败: ${String(err)}`);
    }
    setPaying(false);
  };

  if (loading) {
    return <div style={{ padding: 32, textAlign: 'center', color: '#9CA3AF' }}>加载中...</div>;
  }

  if (!bill) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>❌</div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>账单不存在</h2>
        <p style={{ color: '#6B7280' }}>请检查链接是否正确</p>
      </div>
    );
  }

  if (bill.status === 'PAID') {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8, color: '#059669' }}>账单已支付</h2>
        <p style={{ color: '#6B7280', marginBottom: 24 }}>感谢您的支付！</p>
        <button onClick={() => router.push('/')} style={{ padding: '10px 24px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E3A8A', marginBottom: 24, textAlign: 'center' }}>账单支付</h1>

      {message && (
        <div style={{ background: message.startsWith('✅') ? '#D1FAE5' : '#FEE2E2', border: `1px solid ${message.startsWith('✅') ? '#059669' : '#DC2626'}`, borderRadius: 12, padding: 16, marginBottom: 16, color: message.startsWith('✅') ? '#065F46' : '#991B1B' }}>
          {message}
        </div>
      )}

      {/* 账单详情 */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,.04)', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16, color: '#374151' }}>账单详情</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: '.85rem', color: '#6B7280', marginBottom: 4 }}>账单编号</div>
            <div style={{ fontWeight: 600 }}>#{bill.id}</div>
          </div>
          <div>
            <div style={{ fontSize: '.85rem', color: '#6B7280', marginBottom: 4 }}>中试产线</div>
            <div style={{ fontWeight: 500 }}>{bill.line?.name || '-'}</div>
          </div>
          <div>
            <div style={{ fontSize: '.85rem', color: '#6B7280', marginBottom: 4 }}>客户</div>
            <div>{bill.customerName}</div>
          </div>
          <div>
            <div style={{ fontSize: '.85rem', color: '#6B7280', marginBottom: 4 }}>联系电话</div>
            <div>{bill.customerPhone}</div>
          </div>
        </div>

        <div style={{ background: '#F9FAFB', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>中试产线使用费用</span>
            <span>¥{bill.amount?.toFixed(2) || '0.00'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>平台服务费</span>
            <span>¥{bill.serviceFee?.toFixed(2) || '0.00'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.1rem', borderTop: '1px solid #E5E7EB', paddingTop: 8, marginTop: 8 }}>
            <span>总计</span>
            <span>¥{bill.totalAmount?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>

      {/* 支付方式 */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,.04)', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16, color: '#374151' }}>选择支付方式</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            onClick={() => setPaymentMethod('wechat')}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, border: `2px solid ${paymentMethod === 'wechat' ? '#07C160' : '#E5E7EB'}`, borderRadius: 8, cursor: 'pointer', background: paymentMethod === 'wechat' ? '#F0FFF4' : 'white' }}
          >
            <div style={{ width: 24, height: 24, background: '#07C160', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '.9rem', fontWeight: 700 }}>微</div>
            <div style={{ flex: 1, fontWeight: 500 }}>微信支付</div>
            {paymentMethod === 'wechat' && <div style={{ color: '#07C160', fontSize: '1.2rem' }}>✓</div>}
          </div>
          <div
            onClick={() => setPaymentMethod('alipay')}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, border: `2px solid ${paymentMethod === 'alipay' ? '#1677FF' : '#E5E7EB'}`, borderRadius: 8, cursor: 'pointer', background: paymentMethod === 'alipay' ? '#F0F6FF' : 'white' }}
          >
            <div style={{ width: 24, height: 24, background: '#1677FF', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '.9rem', fontWeight: 700 }}>支</div>
            <div style={{ flex: 1, fontWeight: 500 }}>支付宝</div>
            {paymentMethod === 'alipay' && <div style={{ color: '#1677FF', fontSize: '1.2rem' }}>✓</div>}
          </div>
          <div
            onClick={() => setPaymentMethod('bank')}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, border: `2px solid ${paymentMethod === 'bank' ? '#1E3A8A' : '#E5E7EB'}`, borderRadius: 8, cursor: 'pointer', background: paymentMethod === 'bank' ? '#F0F4FF' : 'white' }}
          >
            <div style={{ width: 24, height: 24, background: '#1E3A8A', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '.9rem', fontWeight: 700 }}>银</div>
            <div style={{ flex: 1, fontWeight: 500 }}>银行转账</div>
            {paymentMethod === 'bank' && <div style={{ color: '#1E3A8A', fontSize: '1.2rem' }}>✓</div>}
          </div>
        </div>
      </div>

      {/* 支付按钮 */}
      <button
        onClick={handlePay}
        disabled={paying}
        style={{ width: '100%', padding: 16, background: paying ? '#9CA3AF' : '#059669', color: '#fff', border: 'none', borderRadius: 12, fontSize: '1.1rem', fontWeight: 700, cursor: paying ? 'not-allowed' : 'pointer' }}
      >
        {paying ? '支付处理中...' : `确认支付 ¥${bill.totalAmount?.toFixed(2) || '0.00'}`}
      </button>

      <div style={{ marginTop: 16, fontSize: '.85rem', color: '#9CA3AF', textAlign: 'center' }}>
        💡 当前为模拟支付，实际部署时请接入微信支付/支付宝
      </div>
    </div>
  );
}
