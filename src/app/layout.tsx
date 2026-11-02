// /layout.tsx
import DevOverlay from './components/DevOverlay';
import Footer from './components/Footer';
import Header from './components/Header';
import './globals.css';
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#04adbf',
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://my-blog-omega-pearl.vercel.app',
  ),
  applicationName: 'Diogenes Brain',
  title: 'davidboo',
  description: 'Personal Website',
  // Temporal: evitar que los buscadores indexen el sitio
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Header />
        {children}
        <DevOverlay />
        <Footer />
      </body>
    </html>
  );
}
