import type { Metadata } from 'next';
import { Cormorant_Garamond, Geist, Italianno } from 'next/font/google';
import './globals.css';

const editorial = Cormorant_Garamond({
  subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'],
  display: 'swap', variable: '--font-editorial',
});
const sans = Geist({ subsets: ['latin'], display: 'swap', variable: '--font-geometric' });
const script = Italianno({ subsets: ['latin'], weight: '400', display: 'swap', variable: '--font-handwriting' });

export const metadata: Metadata = {
  title: 'KAVEX Labs | The Bespoke Atelier',
  description: 'Begin your private ring commission. Explore diamond shapes, precious metals and a personal inscription with your Kavex jeweler.',
};
export default function Layout({children}: {children: React.ReactNode}) {
  return <html lang="en" className={`${editorial.variable} ${sans.variable} ${script.variable}`}><body>{children}</body></html>;
}
