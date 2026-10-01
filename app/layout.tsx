import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KAVEX Labs | The Bespoke Atelier',
  description: 'Begin your private ring commission. Explore diamond shapes, precious metals and a personal inscription with your Kavex jeweler.',
};
export default function Layout({children}: {children: React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
