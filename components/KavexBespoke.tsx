'use client';

import { useId, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import DiamondGlyph from './DiamondGlyph';
import { makeConciergeLink, type DesignBrief } from '../lib/design-brief';

const SHAPES = ['Round', 'Oval', 'Emerald', 'Radiant', 'Pear'] as const;
const SCALE = [
  { value: '1.0', label: 'Subtle presence', scale: 0.72 },
  { value: '1.5', label: 'An elegant balance', scale: 0.86 },
  { value: '2.0', label: 'A bolder statement', scale: 1 },
  { value: 'Custom', label: 'Explore another scale', scale: 1.08 },
];
const METALS = [
  { value: '18K Yellow Gold', label: 'Warm. Timeless.', tone: 'yellow' },
  { value: '18K White Gold', label: 'Cool. Understated.', tone: 'white' },
  { value: 'Platinum', label: 'Pure. Naturally white.', tone: 'platinum' },
];
const FONTS = ['Classic', 'Signature', 'Modern'] as const;
const CHAPTERS = ['Shape', 'Scale', 'Metal', 'Signature', 'Your brief'];
const COPY = [
  { title: 'Which shape\nspeaks to you?', intro: 'Start with instinct. We’ll help you refine the details.', first: 'The beginning of', second: 'something singular.' },
  { title: 'How much\npresence?', intro: 'Choose a starting point. Your jeweler will show you actual stones on video.', first: 'Small details.', second: 'Lasting presence.' },
  { title: 'Your preferred\nprecious metal.', intro: 'Choose the tone you’re drawn to. We’ll discuss the finish together.', first: 'Precious by nature.', second: 'Personal by design.' },
  { title: 'Something\nonly yours.', intro: 'Complimentary engraving. A name, a date, a promise. Entirely optional.', first: 'Only you know', second: 'its meaning.' },
  { title: 'Meet your\nprivate jeweler.', intro: 'Your ideas, personally selected stones, and a design made around you.', first: 'Your vision.', second: 'Our expertise.' },
];
const INITIAL: DesignBrief = {
  shape: '', carat: '', metal: '', engraving: '', font: 'Signature',
  ringSize: 'Confirm with my jeweler', name: '', phone: '',
};
const MICRO = 'text-[9px] font-normal uppercase tracking-[0.2em] text-white/50';
const FIELD = 'w-full border-0 border-b border-white/20 bg-transparent py-4 text-sm text-white outline-none transition-colors duration-500 placeholder:text-white/30 focus:border-white/80';

function Arrow({ back = false }: { back?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"
    className={'h-5 w-5 shrink-0 transition-transform duration-300 ease-out motion-reduce:transition-none ' +
      (back ? 'rotate-180' : 'group-hover:translate-x-2 group-disabled:translate-x-0')}>
    <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1" />
  </svg>;
}

function SelectionCard({ name, value, selected, onSelect, children, className = '' }: {
  name: string; value: string; selected: boolean;
  onSelect: () => void; children: ReactNode; className?: string;
}) {
  return <label className={[
    'group relative cursor-pointer border p-5 transition-all duration-500 ease-out',
    'has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-white',
    'motion-reduce:transition-none',
    selected ? 'border-white/80 bg-white/5 text-white backdrop-blur-md'
      : 'border-white/10 bg-transparent text-white/60 hover:border-white/40',
    className,
  ].join(' ')}>
    <input className="sr-only" type="radio" name={name} value={value}
      checked={selected} onChange={onSelect} />
    <span aria-hidden="true" className={'absolute right-3 top-3 grid h-3 w-3 place-items-center rounded-full border ' +
      (selected ? 'border-white/80' : 'border-white/30')}>
      <span className={'h-1 w-1 rounded-full bg-white transition-opacity duration-500 ' +
        (selected ? 'motion-safe:animate-selection-pulse opacity-100' : 'opacity-0')} />
    </span>
    {children}
  </label>;
}

export default function KavexBespoke() {
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [brief, setBrief] = useState<DesignBrief>(INITIAL);
  const heading = useRef<HTMLHeadingElement>(null);
  const id = useId();
  const copy = COPY[step];
  const field = (['shape', 'carat', 'metal'] as const)[step];
  const canContinue = step > 2 || Boolean(brief[field]);
  const bands = step === 2 || step === 3;
  const scaleLabel = brief.carat === 'Custom' || brief.carat === 'Guide me'
    ? brief.carat : brief.carat + ' ct';

  function update<K extends keyof DesignBrief>(key: K, value: DesignBrief[K]) {
    setBrief(previous => ({ ...previous, [key]: value }));
  }
  function go(next: number) {
    setStep(next);
    setFurthest(previous => Math.max(previous, next));
    requestAnimationFrame(() => heading.current?.focus());
  }

  return <div className="min-h-svh bg-ink font-sans text-white antialiased">
    <a href="#design-question" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4 focus:text-black">Skip to design choices</a>

    <header className="relative z-20 flex h-24 items-center justify-between px-6 md:px-12 xl:px-16">
      <a href="/" aria-label="Kavex Labs home" className="flex items-center gap-3">
        <Image src="/kavex_logo.svg" width={28} height={28} alt="" />
        <span className="text-sm font-normal tracking-[0.22em] md:text-base">KAVEX LABS</span>
      </a>
      <span className={MICRO + ' hidden lg:block'}>The bespoke atelier</span>
      <a href="https://wa.me/4748900083" target="_blank" rel="noopener noreferrer"
        className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.16em] text-white/60 transition-colors duration-500 hover:text-white">
        Private concierge <Arrow />
      </a>
    </header>

    <main className="relative isolate grid lg:min-h-[calc(100svh-144px)] lg:grid-cols-[58%_42%]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[440px] overflow-hidden md:h-[500px] lg:inset-y-0 lg:right-[30%] lg:h-auto">
        <div key={bands ? 'bands' : 'solitaire'} className="image-reveal absolute inset-0">
          <Image src={bands ? '/assets/editorial_bands.webp' : '/assets/bespoke/atelier-hero.png'}
            alt={bands ? 'Gold bands, an atelier design inspiration' : 'Oval diamond solitaire in yellow gold, an atelier design inspiration'}
            fill preload={step === 0} sizes="(min-width:1024px) 70vw, 100vw"
            className="translate-y-24 object-cover object-[50%_45%] lg:translate-y-32 lg:object-[44%_50%]" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#060606_0%,transparent_28%,transparent_60%,#060606_100%)]" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,transparent_45%,#060606_100%)] lg:block" />
      </div>

      <section aria-label="Design inspiration" className="relative flex min-h-[440px] flex-col justify-between px-6 py-10 md:min-h-[500px] md:px-12 lg:min-h-[720px] lg:p-12 xl:p-16">
        <div key={step} className="chapter-reveal">
          <p className={MICRO}>Kavex / Private commissions</p>
          <h1 className="mt-6 max-w-[690px] font-display text-[clamp(2.75rem,5.2vw,5.5rem)] font-normal leading-[0.98] tracking-[-0.035em]">
            {copy.first}<br /><em className="font-normal text-white/80">{copy.second}</em>
          </h1>
        </div>
        <div className="relative mt-56 space-y-5 lg:mt-80">
          <p className={MICRO + ' text-[8px]'}>Design inspiration / {bands ? 'Precious metals study' : 'Oval solitaire, yellow gold'}</p>
          <p aria-live="polite" className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.16em] text-white/70">
            {[brief.shape, brief.carat && scaleLabel, brief.metal].filter(Boolean).map((value, index) =>
              <span key={index}>{index > 0 && <span className="mr-4 text-white/25">/</span>}{value}</span>)}
          </p>
        </div>
      </section>

      <section id="design-question" className="relative z-10 flex flex-col px-6 pb-10 pt-6 md:px-12 lg:p-12 xl:px-16">
        <nav aria-label="Design chapters" className="flex items-center justify-between gap-3">
          {CHAPTERS.map((label, index) => <button key={label} type="button"
            aria-label={'Edit ' + label} aria-current={step === index ? 'step' : undefined}
            disabled={index > furthest} onClick={() => go(index)}
            className={'flex items-center gap-2 py-3 text-[9px] uppercase tracking-[0.2em] transition-colors duration-500 disabled:cursor-default disabled:text-white/20 ' +
              (step === index ? 'text-white' : 'text-white/50 hover:text-white')}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <span className="hidden 2xl:inline">{label}</span>
          </button>)}
        </nav>

        <div key={step} className="chapter-reveal mt-10 flex-1 lg:mt-12">
          <p className={MICRO}>{step === 4 ? 'A personal introduction' : 'Make it yours'} / {String(step + 1).padStart(2, '0')}</p>
          <h2 ref={heading} tabIndex={-1}
            className="mt-4 whitespace-pre-line font-display text-5xl font-normal leading-[1.02] tracking-[-0.025em] outline-none xl:text-[56px]">
            {copy.title}
          </h2>
          <p className="mt-5 max-w-sm text-xs leading-7 text-white/60">{copy.intro}</p>

          {step < 3 && <button type="button" aria-pressed={brief[field] === 'Guide me'}
            onClick={() => update(field, 'Guide me')}
            className={'group mt-6 flex w-full items-center justify-between gap-6 py-3 text-left text-[9px] uppercase tracking-[0.16em] transition-colors duration-500 ' +
              (brief[field] === 'Guide me' ? 'text-white' : 'text-white/50 hover:text-white')}>
            I’d like my jeweler’s guidance <Arrow />
          </button>}

          {step === 0 && <fieldset className="mt-6 grid grid-cols-3 gap-4">
            <legend className="sr-only">Diamond shape</legend>
            {SHAPES.map(shape => <SelectionCard key={shape} name="shape" value={shape}
              selected={brief.shape === shape} onSelect={() => update('shape', shape)}
              className="flex min-h-32 flex-col items-center justify-center gap-5 px-3 py-6">
              <span className="h-14 w-14 [&>svg]:h-full [&>svg]:w-full"><DiamondGlyph shape={shape} /></span>
              <span className="text-[9px] uppercase tracking-[0.2em]">{shape}</span>
            </SelectionCard>)}
          </fieldset>}

          {step === 1 && <fieldset className="mt-6 grid gap-4">
            <legend className="sr-only">Diamond carat</legend>
            {SCALE.map(option => <SelectionCard key={option.value} name="carat" value={option.value}
              selected={brief.carat === option.value} onSelect={() => update('carat', option.value)}
              className="flex items-center gap-8 p-6">
              <span className="h-12 w-12 shrink-0 [&>svg]:h-full [&>svg]:w-full"><DiamondGlyph shape={brief.shape === 'Guide me' ? 'Oval' : brief.shape || 'Oval'} scale={option.scale} /></span>
              <span><span className="block font-display text-3xl">{option.value}{option.value !== 'Custom' && <small className="ml-1 font-sans text-xs">ct</small>}</span><span className="mt-2 block text-[10px] text-white/50">{option.label}</span></span>
            </SelectionCard>)}
          </fieldset>}

          {step === 2 && <fieldset className="mt-6 grid gap-4">
            <legend className="sr-only">Precious metal</legend>
            {METALS.map(option => <SelectionCard key={option.value} name="metal" value={option.value}
              selected={brief.metal === option.value} onSelect={() => update('metal', option.value)}
              className="flex items-center gap-8 p-7">
              <span aria-hidden="true" className={'metal-swatch metal-' + option.tone} />
              <span><span className="block text-[10px] uppercase tracking-[0.16em]">{option.value}</span><span className="mt-3 block text-[10px] text-white/50">{option.label}</span></span>
            </SelectionCard>)}
          </fieldset>}

          {step === 3 && <div className="mt-8 space-y-8">
            <div className="engraving-study flex min-h-36 flex-col items-center justify-center gap-5 px-6 py-8">
              <span className="engraving-text break-all text-center text-white/85" data-font={brief.font}>{brief.engraving || 'Forever, in your words.'}</span>
              <span className={MICRO + ' text-[8px]'}>Your engraving / {brief.font}</span>
            </div>
            <div>
              <label htmlFor={id + '-engraving'} className={MICRO + ' flex justify-between gap-4'}>Your inscription <span>{Array.from(brief.engraving).length}/24</span></label>
              <input id={id + '-engraving'} className={FIELD} placeholder="A name, a date, a promise…"
                value={brief.engraving} onChange={event => update('engraving',
                  Array.from(event.target.value.replace(/[\u0000-\u001f\u007f]/g, '')).slice(0, 24).join(''))} />
              <div role="group" aria-label="Engraving font" className="mt-6 grid grid-cols-3 gap-3">
                {FONTS.map(font => <button key={font} type="button" data-font={font}
                  aria-pressed={brief.font === font} onClick={() => update('font', font)}
                  className={'font-choice border px-2 py-4 transition-all duration-500 ease-out ' +
                    (brief.font === font ? 'border-white/80 bg-white/5 text-white backdrop-blur-md' : 'border-white/10 text-white/60 hover:border-white/40')}>
                  {font}
                </button>)}
              </div>
            </div>
            <div>
              <label htmlFor={id + '-size'} className={MICRO + ' flex justify-between gap-4'}>Ring size <span>Optional</span></label>
              <select id={id + '-size'} className={FIELD} value={brief.ringSize} onChange={event => update('ringSize', event.target.value)}>
                <option>Confirm with my jeweler</option>
                {Array.from({ length: 29 }, (_, index) => 44 + index).map(size => <option key={size}>{'EU ' + size}</option>)}
              </select>
            </div>
          </div>}

          {step === 4 && <form id="concierge-brief" className="mt-8"
            onSubmit={event => { event.preventDefault(); window.location.assign(makeConciergeLink(brief)); }}>
            <dl className="space-y-5">
              {[['Shape', brief.shape, 0], ['Scale', scaleLabel, 1], ['Metal', brief.metal, 2],
                ['Inscription', brief.engraving ? brief.engraving + ' · ' + brief.font : 'Decide together', 3],
                ['Ring size', brief.ringSize, 3]].map(([label, value, chapter]) =>
                <div key={label} className="flex justify-between gap-8">
                  <dt className={MICRO}>{label}</dt>
                  <dd className="flex items-start gap-4 text-right text-xs text-white/80">
                    <span className="max-w-52 break-words">{value}</span>
                    <button type="button" aria-label={'Change ' + label} onClick={() => go(Number(chapter))}
                      className="text-white/40 transition-colors duration-500 hover:text-white">↗</button>
                  </dd>
                </div>)}
            </dl>
            <div className="mt-10 space-y-8">
              <div><label htmlFor={id + '-name'} className={MICRO}>Your name</label>
                <input id={id + '-name'} className={FIELD} autoComplete="name" required pattern={'.*\\S.*'}
                  maxLength={80} placeholder="First and last name" value={brief.name} onChange={event => update('name', event.target.value)} /></div>
              <div><label htmlFor={id + '-phone'} className={MICRO}>WhatsApp number</label>
                <input id={id + '-phone'} className={FIELD} type="tel" autoComplete="tel" required
                  pattern={'(?=(?:[^0-9]*[0-9]){8,15}[^0-9]*$)\\+?[0-9 \\(\\)\\-]+'}
                  maxLength={24} placeholder="+47" value={brief.phone} onChange={event => update('phone', event.target.value)} /></div>
            </div>
            <p className="mt-8 text-[11px] leading-6 text-white/50">Continue to WhatsApp to send your brief. Your jeweler will share stone videos and guide the final design. No payment required.</p>
          </form>}
        </div>

        <div className="mt-10 pt-4 lg:mt-12">
          <div className="flex items-center gap-4">
            {step > 0 && <button type="button" aria-label="Previous design chapter" onClick={() => go(step - 1)}
              className="group grid h-14 w-12 shrink-0 place-items-center text-white/50 transition-colors duration-500 hover:text-white"><Arrow back /></button>}
            <button type={step === 4 ? 'submit' : 'button'} form={step === 4 ? 'concierge-brief' : undefined}
              disabled={!canContinue} onClick={step < 4 ? () => go(step + 1) : undefined}
              className="group flex min-h-14 flex-1 items-center justify-between gap-6 bg-white px-8 py-4 text-left text-[10px] font-medium uppercase tracking-[0.22em] text-black transition-all duration-500 ease-out hover:bg-white/90 disabled:cursor-default disabled:opacity-25 motion-reduce:transition-none">
              {step === 4 ? 'Send brief on WhatsApp' : step === 3 ? 'Review your brief' : 'Continue'}<Arrow />
            </button>
          </div>
          <p className={MICRO + ' mt-5 text-center text-[8px]'}>Your ideas first. The details, together.</p>
        </div>
      </section>
    </main>

    <footer className="flex min-h-12 items-center justify-between gap-8 px-6 py-5 md:px-12 xl:px-16">
      <span className={MICRO + ' text-[8px]'}>Lab-grown diamonds / Private commissions</span>
      <span className={MICRO + ' hidden text-[8px] md:block'}>Personally sourced. Individually made.</span>
    </footer>
  </div>;
}
