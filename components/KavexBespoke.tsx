'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import BespokeConfigurator from './BespokeConfigurator';
const RingScene = dynamic(() => import('./RingScene'), {ssr: false, loading: () => <p className="render-status">Preparing your design…</p>});

export default function KavexBespoke() {
  const [view,setView] = useState('Studio');
  return <BespokeConfigurator renderPreview={({cut,carat,metal}) => <div className="kavex-product-display">
    {view === 'Studio' ? <RingScene config={{cut, carat:carat==='Custom'?'custom':carat,metal,bandWidth:'2.2',prongs:'white'}} angle="Perspective" />
      : <div className="archive-reference"><Image src={view==='Macro'?'/assets/bespoke/series.png':view==='Design study'?'/assets/bespoke/design-study.jpg':'/assets/bespoke/on-hand.jpg'} alt="Kavex catalogue design reference, separate from your configured ring" fill sizes="(max-width:850px) 90vw, 60vw" /><span>CATALOGUE REFERENCE / NOT YOUR FINAL CAD</span></div>}
    <div className="kavex-reference-tabs" aria-label="Product views">{['Studio','Macro','Design study','On hand'].map(value => <button key={value} type="button" onClick={()=>setView(value)} aria-pressed={view===value}>{value}</button>)}</div>
    {view==='Studio' && <small className="kavex-drag-hint">DRAG TO EXPLORE YOUR DESIGN</small>}
  </div>} />;
}
