import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'Tetap Aktif - Latihan Senior',
  description: 'Program latihan harian ringan dan aman untuk lansia.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning className="font-sans min-h-screen bg-brand-cream text-brand-brown">
        {children}
      </body>
    </html>
  );
}
