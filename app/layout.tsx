import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart Bookmark Manager',
  description: 'Manage your bookmarks with real-time synchronization',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
        {children}
      </body>
    </html>
  );
}
