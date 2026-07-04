'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Booking {
  id: number;
  contactName: string;
  contactPhone: string;
  company: string;
  requirement: string;
  preferredDate: string;
  status: string;
  line: { name: string; region: string; capacity: string; specs: string };
}

export default function ContractPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [contractNo] = useState(`HT-${new Date().getFullYear()}-${String(params.id).padStart(4, '0')}`);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const res = await fetch(`/api/admin/bookings/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setBooking(data);
        }
      } finally {
        setLoading(false);
      }
    };
    loadBooking();
  }, [params.id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div style={{ padding: 32, textAlign: 'center' }}>加载中...</div>;
  }

  if (!booking) {
    return <div style={{ padding: 32, textAlign: 'center' }}>预约不存在</div>;
  }

  const today = new Date().toLocaleDateString('zh-CN');

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32, fontSize: '14px', lineHeight: 1.8 }}>
      {/* 打印按钮 */}
      <div style={{ marginBottom: 24, textAlign: 'right' }} className="no-print">
        <button onClick={() => router.back()} style={{ marginRight: 12, padding: '8px 16px', background: '#F3F4F6', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          返回
        </button>
        <button onClick={handlePrint} style={{ padding: '8px 16px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          🖨️ 打印/导出 PDF
        </button>
      </div>

      {/* 合同内容 */}
      <div style={{ background: '#fff', padding: 48, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
        {/* 标题 */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E3A8A', marginBottom: 8 }}>中试服务合同</h1>
          <div style={{ fontSize: '.9rem', color: '#6B7280' }}>合同编号：{contractNo}</div>
        </div>

        {/* 双方信息 */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8, color: '#1E3A8A' }}>甲方（客户）</div>
              <div>单位名称：{booking.company || '-'}</div>
              <div>联系人：{booking.contactName}</div>
              <div>联系电话：{booking.contactPhone}</div>
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8, color: '#1E3A8A' }}>乙方（服务方）</div>
              <div>单位名称：MeatTech Pro 肉制品研发中试平台</div>
              <div>联系人：平台管理员</div>
              <div>联系电话：400-xxx-xxxx</div>
              <div>邮箱：admin@meattech.pro</div>
            </div>
          </div>
        </div>

        {/* 服务内容 */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1E3A8A', marginBottom: 16, borderBottom: '2px solid #1E3A8A', paddingBottom: 8 }}>一、服务内容</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px 12px', border: '1px solid #E5E7EB', background: '#F9FAFB', width: 120, fontWeight: 500 }}>服务产线</td>
                <td style={{ padding: '8px 12px', border: '1px solid #E5E7EB' }}>{booking.line.name}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 12px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontWeight: 500 }}>产线规格</td>
                <td style={{ padding: '8px 12px', border: '1px solid #E5E7EB' }}>{booking.line.region} | {booking.line.capacity}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 12px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontWeight: 500 }}>实验需求</td>
                <td style={{ padding: '8px 12px', border: '1px solid #E5E7EB' }}>{booking.requirement}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 12px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontWeight: 500 }}>期望日期</td>
                <td style={{ padding: '8px 12px', border: '1px solid #E5E7EB' }}>{booking.preferredDate || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 费用 */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1E3A8A', marginBottom: 16, borderBottom: '2px solid #1E3A8A', paddingBottom: 8 }}>二、服务费用</h2>
          <div style={{ background: '#F9FAFB', padding: 16, borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>产线使用费</span>
              <span>按实际使用情况结算</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>平台服务费</span>
              <span>产线费用的 15%（可调）</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.1rem', borderTop: '1px solid #E5E7EB', paddingTop: 8, marginTop: 8 }}>
              <span>预估总计</span>
              <span>以实际账单为准</span>
            </div>
          </div>
        </div>

        {/* 条款 */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1E3A8A', marginBottom: 16, borderBottom: '2px solid #1E3A8A', paddingBottom: 8 }}>三、条款与条件</h2>
          <div style={{ fontSize: '.9rem', lineHeight: 1.8, color: '#374151' }}>
            <p>1. 甲方应确保提供的实验需求真实、合法、有效。</p>
            <p>2. 乙方应按照约定提供中试服务，确保设备正常运行。</p>
            <p>3. 服务费用以实际使用时长和物料消耗结算，详见账单。</p>
            <p>4. 本合同自双方确认之日起生效。</p>
            <p>5. 如有争议，双方应友好协商解决。</p>
          </div>
        </div>

        {/* 签名区域 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 64, paddingTop: 32, borderTop: '1px solid #E5E7EB' }}>
          <div>
            <div style={{ marginBottom: 48 }}>甲方签字/盖章：</div>
            <div>日期：{today}</div>
          </div>
          <div>
            <div style={{ marginBottom: 48 }}>乙方签字/盖章：</div>
            <div>日期：{today}</div>
          </div>
        </div>
      </div>

      {/* 打印样式 */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          div[style*="box-shadow"] { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
