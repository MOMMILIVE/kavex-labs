import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KAVEX Labs | Bespoke Ring Configurator',
  description: 'Configure your lab-grown diamond ring. Choose the cut, carat, precious metal and personal engraving.',
};
export default function Layout({children}: {children: React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
