export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h5 style={{ color: '#fff', fontSize: '.95rem', fontWeight: 700, marginBottom: '12px' }}>⚠️ 免责声明</h5>
            <p style={{ fontSize: '.85rem', lineHeight: 1.7 }}>本站所载工业基础配方及参数仅供研发实验参考。实际生产请结合特定原料肉质、工厂设备环境进行中试微调，并严格遵守当地食品安全法律法规。平台不对因直接套用配方参数而造成的任何生产损失承担责任。</p>
          </div>
          <div>
            <h5 style={{ color: '#fff', fontSize: '.95rem', fontWeight: 700, marginBottom: '12px' }}>🤝 资源合作与入驻</h5>
            <p style={{ fontSize: '.85rem', lineHeight: 1.7 }}>如果您有闲置的中试产线、先进的肉机技术或新型原辅料，欢迎接入平台，共同赋能中国肉业。我们提供产线托管、技术变现、品牌曝光等多元化合作模式。</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', background: 'rgba(255,255,255,0.12)', padding: '8px 18px', borderRadius: '20px', color: '#fff', fontSize: '.85rem', fontWeight: 600, cursor: 'pointer' }}>申请入驻成为服务商 →</span>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h5 style={{ color: '#fff', fontSize: '.95rem', fontWeight: 700, marginBottom: '20px' }}>📱 加入肉品工程师日常技术互助群（微信私域沉淀）</h5>
          <div className="qr-grid">
            <div style={{ textAlign: 'center' }}>
              <div className="qr-placeholder">🍖</div>
              <span style={{ fontSize: '.78rem', opacity: .7 }}>中式酱卤交流群</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="qr-placeholder">🥓</div>
              <span style={{ fontSize: '.78rem', opacity: .7 }}>西式低温技术群</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="qr-placeholder">🍱</div>
              <span style={{ fontSize: '.78rem', opacity: .7 }}>肉品预制菜研发群</span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '.8rem', opacity: .5, paddingTop: '24px' }}>
          <p>© 2026 MeatTech Pro · 工业化肉制品研发与智能中试平台 · 让每一公斤肉发挥最大价值</p>
        </div>
      </div>
    </footer>
  );
}
