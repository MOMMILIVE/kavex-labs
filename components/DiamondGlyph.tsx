import { useId } from 'react';

/** Distinct cut diagrams, rather than a simulated product or final CAD. */
export default function DiamondGlyph({ shape, scale = 1 }: { shape: string; scale?: number }) {
  const id = useId().replace(/:/g, '');
  const outline = shape === 'Round' ? 'M50 10a40 40 0 1 1-.01 0Z'
    : shape === 'Oval' ? 'M50 4a29 46 0 1 1-.01 0Z'
    : shape === 'Pear' ? 'M50 4C43 21 17 45 17 66C17 106 83 106 83 66C83 45 57 21 50 4Z'
    : shape === 'Emerald' ? 'M29 7H71L82 18V82L71 93H29L18 82V18Z'
    : 'M29 8H71L84 21V79L71 92H29L16 79V21Z';
  const vertices = Array.from({ length: 16 }, (_, i) => {
    const a = i * Math.PI / 8 - Math.PI / 2;
    return [50 + Math.cos(a) * (shape === 'Round' ? 40 : 33), 50 + Math.sin(a) * 46];
  });
  return <svg viewBox="0 0 100 100" aria-hidden="true" style={{ transform: `scale(${scale})` }}>
    <defs><linearGradient id={`${id}-light`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f0f4f5" /><stop offset=".45" stopColor="#7b858d" /><stop offset=".72" stopColor="#dde6eb" /><stop offset="1" stopColor="#434d56" /></linearGradient><clipPath id={`${id}-cut`}><path d={outline} /></clipPath></defs>
    <g clipPath={`url(#${id}-cut)`}>
      <path d={outline} fill={`url(#${id}-light)`} />
      {shape === 'Emerald' ? <g fill="none" stroke="#f2f7fa" strokeWidth=".7">
        {[0, 1, 2, 3].map(i => <path key={i} d={`M${29+i*3} ${7+i*7}H${71-i*3}L${82-i*6} ${18+i*6}V${82-i*6}L${71-i*3} ${93-i*7}H${29+i*3}L${18+i*6} ${82-i*6}V${18+i*6}Z`} />)}
        <path d="M29 7L41 28M71 7L59 28M82 18L64 36M82 82L64 64M71 93L59 72M29 93L41 72M18 82L36 64M18 18L36 36" />
      </g> : <g stroke="#d9e4eb" strokeWidth=".45">{vertices.map((v, i) => {
        const next = vertices[(i + 1) % 16];
        const mid = [50+(v[0]-50)*.46, 50+(v[1]-50)*.46];
        return <g key={i}><path d={`M${v}L${next}L${mid}Z`} fill={['#f4f8fa','#697680','#c4cfd7','#a2b0bb'][i%4]} /><path d={`M${v}L50 50L${mid}Z`} fill={i%2?'#b8c7d1':'#ecf1f5'} /></g>;
      })}<path d="M50 30L65 40V60L50 70L35 60V40Z" fill="#c2cdd4" /></g>}
    </g><path d={outline} fill="none" stroke="#edf5fa" strokeOpacity=".85" strokeWidth=".65" />
  </svg>;
}

