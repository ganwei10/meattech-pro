import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MeatTech Pro — 工业化肉制品研发与智能中试平台',
  description: '让每一公斤肉发挥最大价值 —— 工业化肉制品研发与智能中试平台',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
