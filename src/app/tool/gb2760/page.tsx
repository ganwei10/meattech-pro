import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GB2760Calculator from '@/components/GB2760Calculator';

export const dynamic = 'force-dynamic';

export default function GB2760Page() {
  return (
    <>
      <Header />
      <div className="container" style={{ paddingTop: 100, paddingBottom: 60, minHeight: '80vh' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1E3A8A', marginBottom: 8 }}>📊 GB 2760 添加剂限量计算器</h1>
          <p style={{ color: '#6B7280', fontSize: '.95rem' }}>输入添加剂名称查询最大使用量，并计算实际用量合规性</p>
        </div>
        <GB2760Calculator />
        <div style={{ marginTop: 40, padding: 20, background: '#FEF3C7', borderRadius: 12, fontSize: '.82rem', color: '#92400E', lineHeight: 1.6 }}>
          ⚠️ 本计算器数据基于 GB 2760-2014《食品安全国家标准 食品添加剂使用标准》，仅供参考。实际生产请以最新国标原文为准，并结合产品具体类别确认适用限量。
        </div>
      </div>
      <Footer />
    </>
  );
}
