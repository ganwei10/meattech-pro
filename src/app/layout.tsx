import type { Metadata } from 'next';
import './globals.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'MeatTech Pro — 工业化肉制品研发与智能中试平台',
  description: '让每一公斤肉发挥最大价值 —— 工业化肉制品研发与智能中试平台。商超爆款逆向研发、硬核肉品科学、共享中试产线在线预约。覆盖香肠制作、冷鲜工艺、保水技术、色泽发色、货架期防腐、包装技术、设备选型等全链路肉品工艺。',
  keywords: '肉制品,肉品研发,中试,配方,工艺,GB2760,添加剂,故障排查,预制菜,斩拌,烟熏,清洁标签,香肠制作,冷鲜工艺,保水技术,磷酸盐,亚硝酸盐,气调包装,货架期,滚揉,灌装',
  authors: [{ name: 'MeatTech Pro' }],
  openGraph: {
    title: 'MeatTech Pro — 工业化肉制品研发与智能中试平台',
    description: '让每一公斤肉发挥最大价值 —— 商超爆款逆向研发、硬核肉品科学、共享中试产线在线预约',
    type: 'website',
    locale: 'zh_CN',
    siteName: 'MeatTech Pro',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MeatTech Pro',
  alternateName: '肉制品研发与智能中试平台',
  url: 'https://meattech-pro.vercel.app',
  description: '工业化肉制品研发与智能中试平台，提供商超爆款逆向研发、硬核肉品科学、共享中试产线在线预约、工艺问答社区等服务',
  knowsAbout: ['肉制品研发', '中试产线', '肉品工艺', '食品添加剂', 'GB 2760', '香肠制作', '冷鲜工艺', '气调包装', '肉品保水', '货架期防腐'],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'MeatTech Pro',
  alternateName: '肉制品研发与智能中试平台',
  url: 'https://meattech-pro.vercel.app',
  description: '工业化肉制品研发与智能中试平台',
  inLanguage: 'zh-CN',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://meattech-pro.vercel.app/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </body>
    </html>
  );
}
