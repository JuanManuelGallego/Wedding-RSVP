import './globals.css';
import { getLocale } from '@/lib/locale';
import { site } from '@/lib/site';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: `${site.names} — June 6, 2027`,
  description: `You're invited. ${site.names} — June 6, 2027.`,
};

export const viewport: Viewport = {
  themeColor: '#f6f1e7',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;1,9..144,400;1,9..144,600&family=Great+Vibes&family=Newsreader:ital,wght@0,400;0,500;1,400&family=Playfair+Display:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&family=Lora:wght@400;500;600;700&family=Cinzel:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
