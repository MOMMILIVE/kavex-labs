import LoopVideo from './LoopVideo';

export type RingFilm = { title: string; detail: string; src?: string };

export default function RingArchive({ films }: { films: RingFilm[] }) {
  return <section id="ring-archive" aria-labelledby="archive-title" className="border-t border-[#333333] px-6 py-28 md:px-16 md:py-44">
    <div className="mx-auto max-w-7xl">
      <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div><p className="eyebrow">04 / The archive</p><h2 id="archive-title" className="mt-6 font-display text-5xl md:text-7xl">The Ring Archive.</h2></div>
        <p className="max-w-xs text-sm leading-7 text-[#C0C0C0]">Finished commissions.<br />Precision in every detail.</p>
      </div>
      <div className="grid gap-x-6 gap-y-14 md:grid-cols-3">
        {films.map((film, index) => <figure key={film.title} className={index === 1 ? 'md:pt-16' : ''}>
          <div className="relative aspect-[4/5] overflow-hidden border border-[#333333] bg-[#0A0A0A]">
            {film.src ? <LoopVideo src={film.src} label={film.title + ' factory film'} className="h-full w-full object-cover" /> : <div className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center"><span className="h-16 w-px bg-[#333333]" aria-hidden="true" /><p className="font-display text-3xl text-[#C0C0C0]">{film.title}</p><p className="text-[9px] uppercase tracking-[0.2em] text-[#999999]">Factory film forthcoming.</p></div>}
          </div>
          <figcaption className="mt-6 flex justify-between gap-4"><span className="font-display text-2xl">{film.title}</span><span className="self-center text-[9px] uppercase tracking-[0.2em] text-[#999999]">{film.detail}</span></figcaption>
        </figure>)}
      </div>
    </div>
  </section>;
}
