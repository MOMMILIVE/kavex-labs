'use client';

import { useId, useRef, useState } from 'react';
import Image from 'next/image';
import { makeConciergeLink, type DesignBrief } from '../lib/design-brief';

const shapes = ['Round', 'Oval', 'Emerald', 'Radiant', 'Pear'];
const chapters = ['Shape', 'Scale', 'Metal', 'Signature', 'Your brief'];
const stories = [
  ['The beginning of', 'something singular.', 'A ring made around you. Start with the silhouette.'],
  ['Small details.', 'Lasting presence.', 'Find the scale that feels like you.'],
  ['Precious by nature.', 'Personal by design.', 'The foundation of your everyday heirloom.'],
  ['Only you', 'know its meaning.', 'A name. A date. A promise. Make it yours.'],
  ['Your vision.', 'Our expertise.', 'From your first idea to the stone you fall for.'],
];

/** Distinct cut diagrams, rather than a simulated product or final CAD. */
function Diamond({ shape, scale = 1 }: { shape: string; scale?: number }) {
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

function Arrow({ back = false }: { back?: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" style={back ? { transform: 'rotate(180deg)' } : undefined}><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>;
}

export default function KavexBespoke() {
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [brief, setBrief] = useState<DesignBrief>({ shape: '', carat: '', metal: '', engraving: '', font: 'Signature', ringSize: 'Confirm with my jeweler', name: '', phone: '' });
  const heading = useRef<HTMLHeadingElement>(null);
  const formId = useId();
  const update = <K extends keyof DesignBrief>(key: K, value: DesignBrief[K]) => setBrief(b => ({ ...b, [key]: value }));
  const selected = [brief.shape, brief.carat, brief.metal, true, true][step];
  const needsGuidance = ['shape', 'carat', 'metal'][step] as 'shape' | 'carat' | 'metal';
  const mainVisual = step < 2 || step === 4 ? '/assets/bespoke/atelier-hero.png' : '/assets/editorial_bands.webp';
  const go = (next: number) => { setStep(next); setFurthest(value => Math.max(value,next)); requestAnimationFrame(() => heading.current?.focus({ preventScroll: true })); };

  return <div className="atelier">
    <a className="skip-content" href="#atelier-question">Skip to design choices</a>
    <header className="atelier-header">
      <a href="/" className="atelier-brand" aria-label="Kavex Labs home"><img src="/kavex_logo.svg" alt="" /><span>KAVEX LABS</span></a>
      <span className="atelier-header-label">THE BESPOKE ATELIER</span>
      <a href="https://wa.me/4748900083" target="_blank" rel="noopener noreferrer" className="atelier-concierge"><span className="concierge-dot" />Private concierge <Arrow /></a>
    </header>
    <main className="atelier-main">
      <section className="atelier-stage" aria-label="Design inspiration">
        <div className="atelier-image" key={mainVisual}><Image src={mainVisual} alt={step < 2 || step === 4 ? 'Oval diamond solitaire in yellow gold, an atelier design inspiration' : 'Polished gold bands photographed in the Kavex laboratory'} fill preload={step === 0} sizes="(max-width: 700px) 100vw, 65vw" /></div>
        <div className="atelier-story" key={step}><p className="eyebrow">KAVEX / PRIVATE COMMISSIONS</p><h1>{stories[step][0]}<br /><span>{stories[step][1]}</span></h1><p>{stories[step][2]}</p></div>
        <div className="atelier-caption"><span>DESIGN INSPIRATION</span><span>{step < 2 || step === 4 ? 'OVAL SOLITAIRE / YELLOW GOLD' : 'THE PRECIOUS METALS STUDY'}</span></div>
        <div className="atelier-selected" aria-live="polite">{[brief.shape, brief.carat && (brief.carat === 'Guide me' ? 'Scale to explore' : brief.carat === 'Custom' ? 'Custom scale' : `${brief.carat} ct`), brief.metal].filter(Boolean).map((v,i) => <span key={i}>{v}</span>)}</div>
      </section>
      <section className="atelier-panel" id="atelier-question">
        <nav className="atelier-progress" aria-label="Design chapters">{chapters.map((label, i) => <button key={label} type="button" aria-label={`Edit ${label}`} aria-current={step === i ? 'step' : undefined} disabled={i > furthest} onClick={() => go(i)}><span>{String(i+1).padStart(2,'0')}</span><span className="chapter-label">{label}</span></button>)}</nav>
        <div className="atelier-question" key={step}>
          <p className="eyebrow">{step < 4 ? 'MAKE IT YOURS' : 'A PERSONAL INTRODUCTION'} / {String(step+1).padStart(2,'0')}</p>
          <h2 ref={heading} tabIndex={-1}>{['Which shape\nspeaks to you?', 'How much\npresence?', 'Your preferred\nprecious metal.', 'Something\nonly yours.', 'Meet your\nprivate jeweler.'][step]}</h2>
          <p className="question-intro">{['Start with instinct. We’ll help you refine the details.', 'Choose a starting point. Your jeweler will show you actual stones on video.', 'Choose the tone you’re drawn to. We’ll discuss the finish together.', 'Complimentary engraving. The finishing touch is entirely optional.', 'Your ideas, brought to life with personally selected stones and a design made for you.'][step]}</p>
          {step < 3 && <button className="guide-choice" type="button" aria-pressed={brief[needsGuidance]==='Guide me'} onClick={()=>update(needsGuidance,'Guide me')}>I’d like my jeweler’s guidance <span>↗</span></button>}
          {step === 0 && <fieldset className="shape-options"><legend className="sr-only">Diamond shape</legend>{shapes.map(shape => <label key={shape} className="shape-option"><input type="radio" name="shape" value={shape} checked={brief.shape===shape} onChange={()=>update('shape',shape)} /><span className="shape-art"><Diamond shape={shape} /></span><span className="shape-name">{shape}</span><span className="choice-mark" aria-hidden="true" /></label>)}</fieldset>}
          {step === 1 && <fieldset className="scale-options"><legend className="sr-only">Diamond carat</legend>{[['1.0','Subtle presence',.72],['1.5','An elegant balance',.86],['2.0','A bolder statement',1],['Custom','Explore another scale',1.08]].map(([carat,label,scale]) => <label className="scale-option" key={carat}><input type="radio" name="carat" value={String(carat)} checked={brief.carat===carat} onChange={()=>update('carat',String(carat))} /><Diamond shape={brief.shape === 'Guide me' ? 'Oval' : brief.shape || 'Oval'} scale={Number(scale)} /><span><strong>{carat}{carat!=='Custom'&&<small> ct</small>}</strong><span>{label}</span></span><span className="choice-mark" aria-hidden="true" /></label>)}</fieldset>}
          {step === 2 && <fieldset className="metal-options"><legend className="sr-only">Precious metal</legend>{[['18K Yellow Gold','Warm. Timeless.','yellow'],['18K White Gold','Cool. Understated.','white'],['Platinum','Pure. Naturally white.','platinum']].map(([metal,desc,tone]) => <label className="metal-option" key={metal}><input type="radio" name="metal" value={metal} checked={brief.metal===metal} onChange={()=>update('metal',metal)} /><span className={`metal-swatch ${tone}`} /><span><strong>{metal}</strong><span>{desc}</span></span><span className="choice-mark" aria-hidden="true" /></label>)}</fieldset>}
          {step === 3 && <div className="signature-options">
            <div className="engraving-preview" data-font={brief.font}><span>{brief.engraving || 'Forever, in your words.'}</span><small>YOUR ENGRAVING / {brief.font.toUpperCase()}</small></div>
            <label className="input-label" htmlFor={`${formId}-engraving`}>Your inscription <span>{Array.from(brief.engraving).length}/24</span></label>
            <input id={`${formId}-engraving`} className="line-input" placeholder="A name, a date, a promise…" value={brief.engraving} onChange={e=>update('engraving',Array.from(e.target.value.replace(/[\u0000-\u001f\u007f]/g,'')).slice(0,24).join(''))} />
            <div className="font-options" role="group" aria-label="Engraving font">{['Classic','Signature','Modern'].map(font=><button type="button" key={font} data-font={font} aria-pressed={brief.font===font} onClick={()=>update('font',font)}>{font}</button>)}</div>
            <label className="input-label" htmlFor={`${formId}-size`}>Ring size <span>Optional</span></label>
            <select className="line-input" id={`${formId}-size`} value={brief.ringSize} onChange={e=>update('ringSize',e.target.value)}><option>Confirm with my jeweler</option>{Array.from({length:29},(_,i)=>44+i).map(size=><option key={size}>EU {size}</option>)}</select>
          </div>}
          {step === 4 && <form id="concierge-brief" onSubmit={e=>{e.preventDefault();window.location.assign(makeConciergeLink(brief));}}>
            <dl className="brief-summary">{[['Shape',brief.shape],['Scale',brief.carat === 'Custom' ? 'Custom' : brief.carat === 'Guide me' ? 'Guide me' : `${brief.carat} ct`],['Metal',brief.metal],['Inscription',brief.engraving ? `${brief.engraving} · ${brief.font}` : 'Decide together'],['Ring size',brief.ringSize]].map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}<button type="button" aria-label={`Change ${key}`} onClick={()=>go(key==='Shape'?0:key==='Scale'?1:key==='Metal'?2:3)}><span aria-hidden="true">↗</span></button></dd></div>)}</dl>
            <label className="input-label" htmlFor={`${formId}-name`}>Your name</label><input id={`${formId}-name`} className="line-input" autoComplete="name" required maxLength={80} value={brief.name} onChange={e=>update('name',e.target.value)} placeholder="First and last name" pattern=".*\S.*" />
            <label className="input-label" htmlFor={`${formId}-phone`}>WhatsApp number <span>Include country code</span></label><input id={`${formId}-phone`} className="line-input" type="tel" autoComplete="tel" required pattern={"\\+?[0-9 \\(\\)\\-]{8,24}"} maxLength={24} placeholder="+47" value={brief.phone} onChange={e=>update('phone',e.target.value)} />
            <p className="handoff-note">Continue to WhatsApp to send your brief. Your jeweler will share stone videos and guide the final design. No payment required.</p>
          </form>}
        </div>
        <div className="atelier-actions"><div className="step-actions">{step>0 && <button type="button" className="back-button" onClick={()=>go(step-1)} aria-label="Previous design chapter"><Arrow back /></button>}{step<4 ? <button type="button" className="continue-button" disabled={!selected} onClick={()=>go(step+1)}>{step===3?'Review your brief':'Continue'}<Arrow /></button> : <button type="submit" form="concierge-brief" className="continue-button">Send brief on WhatsApp<Arrow /></button>}</div><p className="atelier-reassurance">{step===4?'PERSONALLY SOURCED. INDIVIDUALLY MADE.':'YOUR IDEAS FIRST. THE DETAILS, TOGETHER.'}</p></div>
      </section>
    </main>
    <footer className="atelier-footer"><span>LAB-GROWN DIAMONDS. PRIVATE COMMISSIONS.</span><span>STONE SELECTION <i /> DESIGN APPROVAL <i /> CRAFTED FOR YOU</span></footer>
  </div>;
}
