import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSiteGlobalConfig } from '@/lib/siteConfig';

// Footer is an async server component — fetches footer config from Setting table
export default async function Footer() {
  // Fetch footer community groups config
  let footerConfig: { title?: string; subtitle?: string; groups?: { icon: string; name: string; qrcode?: string }[] } = {};
  try {
    const setting = await prisma.setting.findUnique({ where: { key: 'homepage_footer' } });
    if (setting) {
      footerConfig = JSON.parse(setting.value);
    }
  } catch {
    // Fallback to defaults below
  }

  // Fetch global site config for footer text
  const globalConfig = await getSiteGlobalConfig();

  const title = footerConfig.title || '📱 加入肉品工程师日常技术互助群（微信私域沉淀）';
  const subtitle = footerConfig.subtitle || '';
  const groups = footerConfig.groups && footerConfig.groups.length > 0
    ? footerConfig.groups
    : [
        { icon: '🍖', name: '中式酱卤交流群', qrcode: '' },
        { icon: '🥓', name: '西式低温技术群', qrcode: '' },
        { icon: '🍱', name: '肉品预制菜研发群', qrcode: '' },
      ];

  const fc = globalConfig.footer;

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h5 style={{ color: '#fff', fontSize: '.95rem', fontWeight: 700, marginBottom: '12px' }}>{fc.disclaimerTitle}</h5>
            <p style={{ fontSize: '.85rem', lineHeight: 1.7 }}>{fc.disclaimerText}</p>
          </div>
          <div>
            <h5 style={{ color: '#fff', fontSize: '.95rem', fontWeight: 700, marginBottom: '12px' }}>{fc.cooperationTitle}</h5>
            <p style={{ fontSize: '.85rem', lineHeight: 1.7 }}>{fc.cooperationText}</p>
            <Link href="/partner" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', background: 'rgba(255,255,255,0.12)', padding: '8px 18px', borderRadius: '20px', color: '#fff', fontSize: '.85rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', transition: 'background .2s' }}>{fc.cooperationBtnText}</Link>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h5 style={{ color: '#fff', fontSize: '.95rem', fontWeight: 700, marginBottom: '8px' }}>{title}</h5>
          {subtitle && <p style={{ fontSize: '.8rem', opacity: .6, marginBottom: '20px' }}>{subtitle}</p>}
          <div className="qr-grid">
            {groups.map((group, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                {group.qrcode ? (
                  <img src={group.qrcode} alt={group.name} style={{ width: 100, height: 100, borderRadius: 12, background: '#fff', objectFit: 'cover' }} />
                ) : (
                  <div className="qr-placeholder">{group.icon || '🍖'}</div>
                )}
                <span style={{ fontSize: '.78rem', opacity: .7 }}>{group.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '.8rem', opacity: .5, paddingTop: '24px' }}>
          <p>{fc.copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}
