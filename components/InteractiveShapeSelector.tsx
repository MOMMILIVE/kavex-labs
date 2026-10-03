"use client";

import { diamondShapes, type DiamondShape } from '@/lib/catalog';

function ShapeIcon({ shape }: { shape: DiamondShape }) {
  return <svg viewBox="0 0 64 80" className="h-14 w-11" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
    {shape === 'Oval' ? <><ellipse cx="32" cy="40" rx="24" ry="34" /><ellipse cx="32" cy="40" rx="14" ry="23" /><path d="M32 6v11m0 46v11M8 40h10m28 0h10M15 16l8 9m18 30 8 9M49 16l-8 9M23 55l-8 9" /></> : null}
    {shape === 'Emerald' ? <><path d="M17 7h30l10 10v46L47 73H17L7 63V17Z" /><path d="M21 15h22l6 6v38l-6 6H21l-6-6V21Z M25 24h14l3 4v24l-3 4H25l-3-4V28Z M17 7l8 17M47 7l-8 17M57 17 42 28M57 63 42 52M47 73 39 56M17 73 25 56M7 63 22 52M7 17 22 28" /></> : null}
    {shape === 'Radiant' ? <><path d="M17 7h30l10 10v46L47 73H17L7 63V17Z M24 25h16l8 15-8 15H24l-8-15Z M17 7l7 18M47 7l-7 18M57 17 48 40M57 63 48 40M47 73 40 55M17 73 24 55M7 63 16 40M7 17 16 40M17 7 32 7 24 25M47 73 32 73 40 55" /></> : null}
    {shape === 'Round' ? <><circle cx="32" cy="40" r="28" /><path d="m32 12 20 8 8 20-8 20-20 8-20-8-8-20 8-20Z m0 13 11 5 5 10-5 10-11 5-11-5-5-10 5-10Z M32 12v13M52 20 43 30M60 40H48M52 60 43 50M32 68V55M12 60 21 50M4 40h12M12 20 21 30" /></> : null}
    {shape === 'Pear' ? <><path d="M32 5C27 22 7 39 7 53a25 25 0 0 0 50 0C57 39 37 22 32 5Z M32 22 18 46 22 61 32 68 42 61 46 46Z M32 5v17M7 53 18 46M57 53 46 46M15 70 22 61M49 70 42 61M32 78V68M16 33 18 46M48 33 46 46" /></> : null}
  </svg>;
}

export default function InteractiveShapeSelector({ value, onChange, disabled = false }: {
  value: DiamondShape; onChange: (shape: DiamondShape) => void; disabled?: boolean;
}) {
  return <fieldset disabled={disabled}>
    <legend className="mb-6 text-[10px] uppercase tracking-[0.25em] text-[#C0C0C0]">Diamond shape</legend>
    <div className="grid grid-cols-5 gap-1 sm:gap-3">
      {diamondShapes.map(shape => <label key={shape} className="relative block">
        <input className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" type="radio" name="shape" value={shape} checked={value === shape} onChange={() => onChange(shape)} />
        <span className="flex min-h-28 flex-col items-center justify-center gap-4 border border-transparent text-[#888888] transition-colors hover:text-[#F3F3F3] peer-checked:border-[#333333] peer-checked:text-[#F3F3F3] peer-focus-visible:outline peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[#F3F3F3] peer-disabled:opacity-50">
          <span className={value === shape ? 'drop-shadow-[0_0_6px_rgba(243,243,243,0.2)]' : ''}><ShapeIcon shape={shape} /></span>
          <span className="text-[9px] tracking-[0.06em] sm:text-[10px]">{shape}</span>
        </span>
      </label>)}
    </div>
  </fieldset>;
}
