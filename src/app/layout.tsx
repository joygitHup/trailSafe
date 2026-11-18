import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '径安 TrailSafe - 户外徒步资料包',
    template: '%s | 径安 TrailSafe',
  },
  description:
    '面向户外徒步用户的路径轨迹、下撤点清单、时间窗口与接驳信息的数字化资料包系统。让每一次徒步都有安全底线。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
