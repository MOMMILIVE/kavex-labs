import type { Metadata } from 'next';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import CatalogLeadForm from '@/components/CatalogLeadForm';
import RingArchive, { type RingFilm } from '@/components/RingArchive';
import StickyCatalogCTA from '@/components/StickyCatalogCTA';
import LoopVideo from '@/components/LoopVideo';
import CatalogBrandHeader from '@/components/CatalogBrandHeader';

export const metadata: Metadata = {
  title: 'KAVEX Labs | 2026 Private Pricing Catalog',
  description: 'Engineered diamonds. Bespoke commissions. Request the Kavex Labs 2026 pricing catalog.',
};

const studies = [
  { title: 'The Solitaire', detail: 'Study 01', filename: 'solitaire.mp4' },
  { title: 'The Setting', detail: 'Study 02', filename: 'setting.mp4' },
  { title: 'The Bands', detail: 'Study 03', filename: 'bands.mp4' },
];

export default function Page() {
  const films: RingFilm[] = studies.map(({ filename, ...study }) => ({ ...study,
    src: existsSync(join(process.cwd(), 'assets', 'ring-archive', filename)) ? `/assets/ring-archive/${filename}` : undefined,
  }));
  return <div className="bg-black text-[#F3F3F3]">
    <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-black focus:p-4">Skip to content</a>
    <CatalogBrandHeader />
    <main id="main">
      <section aria-labelledby="hero-title" className="relative flex min-h-[90svh] items-center overflow-hidden px-6 pt-36 pb-24 md:min-h-screen md:px-16">
        <div className="absolute inset-0"><LoopVideo src="/assets/hero_bg.mp4" label="Kavex diamond background film" priority className="h-full w-full object-cover" /><div className="pointer-events-none absolute inset-0 bg-black/60" /><div className="catalog-dot-field pointer-events-none absolute inset-0" /></div>
        <div className="relative mx-auto w-full max-w-7xl">
          <div aria-label="KAVEX LABS" className="mb-8 text-[clamp(4.5rem,10vw,10rem)] font-medium leading-[0.82] tracking-[-0.07em]"><span className="block">KAVEX</span><span className="mt-3 block text-right">LABS</span></div>
          <p className="eyebrow">01 / Direct lab access</p>
          <h1 id="hero-title" className="mt-8 max-w-4xl font-display text-[clamp(2.5rem,4vw,4.5rem)] font-normal leading-[0.95] tracking-[-0.03em]">Engineered for the <em>uncompromising.</em></h1>
          <p className="mt-8 text-sm leading-7 text-[#C0C0C0]">Bespoke diamonds. Direct lab access.</p>
          <a href="#catalog" className="mt-12 inline-flex min-h-16 max-w-full items-center gap-6 border border-[#333333] bg-black px-6 py-4 text-xs text-[#F3F3F3] hover:border-[#C0C0C0] sm:gap-12 sm:px-8 sm:text-sm">Unlock the 2026 Pricing Catalog <span aria-hidden="true">↗</span></a>
        </div>
      </section>
      <section id="retail-markup" aria-labelledby="markup-title" className="border-t border-[#333333] px-6 py-28 md:px-16 md:py-44">
        <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-2 md:gap-28">
          <div><p className="eyebrow">02 / The retail model</p><h2 id="markup-title" className="mt-6 font-display text-5xl leading-none md:text-7xl">The Retail<br /><em>Markup.</em></h2></div>
          <div className="md:pt-12"><p className="font-display text-3xl leading-snug md:text-4xl">You pay for the storefront.<br />The intermediaries.<br />The name above the door.</p><p className="mt-10 max-w-sm text-sm leading-7 text-[#C0C0C0]">Traditional mined-diamond retail carries more than the stone. Know what your commission costs.</p></div>
        </div>
      </section>
      <section id="lab-authority" aria-labelledby="lab-title" className="border-t border-[#333333] bg-[#0A0A0A] px-6 py-28 md:px-16 md:py-44">
        <div className="mx-auto max-w-7xl"><p className="eyebrow">03 / Kavex Labs</p><h2 id="lab-title" className="mt-8 max-w-4xl font-display text-5xl leading-[1.05] md:text-8xl">Atomic perfection.<br /><em>Direct from the lab.</em></h2><div className="mt-16 grid gap-10 border-t border-[#333333] pt-10 md:grid-cols-3">{[
          ['Engineered diamonds.', 'Lab-grown. Crystalline carbon.'], ['Precise specifications.', 'Cut. Color. Clarity. Defined.'], ['Your commission.', 'Bespoke design. Uncompromising intent.'],
        ].map(([title, detail]) => <div key={title}><h3 className="font-display text-2xl">{title}</h3><p className="mt-4 text-xs leading-6 text-[#C0C0C0]">{detail}</p></div>)}</div></div>
      </section>
      <RingArchive films={films} />
      <section id="catalog" aria-labelledby="catalog-title" className="scroll-mt-8 border-t border-[#333333] bg-[#0A0A0A] px-6 pt-28 pb-40 md:px-16 md:py-44">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:gap-28">
          <div><p className="eyebrow">05 / Private pricing · 2026</p><h2 id="catalog-title" className="mt-6 font-display text-5xl leading-[1.05] md:text-7xl">Your next commission<br /><em>starts here.</em></h2><p className="mt-8 text-sm leading-7 text-[#C0C0C0]">Select your cut. Request the catalog.</p></div>
          <CatalogLeadForm />
        </div>
      </section>
    </main>
    <footer className="flex flex-wrap justify-between gap-6 border-t border-[#333333] px-6 pt-8 pb-32 text-[10px] uppercase tracking-[0.2em] text-[#999999] md:px-16 md:pb-8"><span>Kavex Labs © 2026</span><a href="/privacy">Privacy</a></footer>
    <StickyCatalogCTA />
  </div>;
}
