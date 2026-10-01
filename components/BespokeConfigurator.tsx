"use client";

import React, { useEffect, useId, useRef, useState } from "react";

type Cut = "Round" | "Oval" | "Emerald" | "Radiant" | "Pear";
type Carat = "1.0" | "1.5" | "2.0" | "Custom";
type Metal = "18K White Gold" | "18K Yellow Gold" | "Platinum";
type Font = "Classic" | "Signature" | "Modern";

const CUTS: Cut[] = ["Round", "Oval", "Emerald", "Radiant", "Pear"];
const CARATS: Carat[] = ["1.0", "1.5", "2.0", "Custom"];
const METALS: Metal[] = ["18K White Gold", "18K Yellow Gold", "Platinum"];
const FONTS: Record<Font, string> = {
  Classic: "Georgia, serif",
  Signature: "'Snell Roundhand', 'Brush Script MT', cursive",
  Modern: "Arial, sans-serif",
};

// Example, all-inclusive NOK tiers for review. Match the server matrix when editing.
const BASE_NOK = { "1.0": 25000, "1.5": 32000, "2.0": 39500 };
const CUT_NOK: Record<Cut, number> = { Round: 0, Oval: 0, Emerald: 1200, Radiant: 1500, Pear: 900 };
const METAL_NOK: Record<Metal, number> = { "18K White Gold": 0, "18K Yellow Gold": 0, Platinum: 6000 };
const PRICING_VERSION = "review-2026-10-01";
const nok = (amount: number) => new Intl.NumberFormat("nb-NO", {
  style: "currency", currency: "NOK", maximumFractionDigits: 0,
}).format(amount);

function Stone({ cut }: { cut: Cut }) {
  const outline = {
    Round: "M50 10 A40 40 0 1 1 49.99 10 Z",
    Oval: "M50 5 A30 45 0 1 1 49.99 5 Z",
    Emerald: "M30 8 H70 L82 20 V80 L70 92 H30 L18 80 V20 Z",
    Radiant: "M25 12 H75 L88 25 V75 L75 88 H25 L12 75 V25 Z",
    Pear: "M50 5 C40 24 16 42 16 63 A34 32 0 0 0 84 63 C84 42 60 24 50 5 Z",
  }[cut];
  return <svg viewBox="0 0 100 100" aria-hidden="true">
    <path d={outline} fill="currentColor" fillOpacity=".07" stroke="currentColor" strokeWidth="1.4" />
    <path d="M50 24 L70 50 50 77 30 50 Z M50 24 V77 M30 50 H70" fill="none" stroke="currentColor" strokeWidth=".8" />
  </svg>;
}

/** Supply your own licensed renders by cut/metal. No supplied image is represented as exact CAD. */
export default function BespokeConfigurator({
  images = {}, conciergeNumber = "4748900083", previewMode = false, renderPreview,
}: {
  images?: Partial<Record<`${Cut}:${Metal}`, string>>;
  conciergeNumber?: string;
  previewMode?: boolean;
  renderPreview?: (configuration: {cut: Cut; carat: Carat; metal: Metal}) => React.ReactNode;
}) {
  const [cut, setCut] = useState<Cut>("Oval");
  const [carat, setCarat] = useState<Carat>("1.5");
  const [metal, setMetal] = useState<Metal>("18K Yellow Gold");
  const [step, setStep] = useState(0);
  const [ringSize, setRingSize] = useState("confirm");
  const [engraving, setEngraving] = useState("");
  const [font, setFont] = useState<Font>("Signature");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const ids = useId();
  const attempt = useRef<{ signature: string; id: string; created: number } | null>(null);
  useEffect(() => {
    // Keep the build when a customer returns from a cancelled hosted checkout.
    try {
      const saved = JSON.parse(sessionStorage.getItem("kavex-checkout-build") || "null");
      if (!saved || saved.version !== PRICING_VERSION) return;
      if (CUTS.includes(saved.cut)) setCut(saved.cut);
      if (CARATS.includes(saved.carat)) setCarat(saved.carat);
      if (METALS.includes(saved.metal)) setMetal(saved.metal);
      if (typeof saved.ringSize === "string" && /^(confirm|4[4-9]|[56][0-9]|7[0-2])$/.test(saved.ringSize)) setRingSize(saved.ringSize);
      if (typeof saved.engraving === "string") setEngraving(Array.from(saved.engraving).slice(0, 24).join(""));
      if (Object.prototype.hasOwnProperty.call(FONTS, saved.font)) setFont(saved.font);
    } catch { /* Storage may be disabled; configuration still works. */ }
  }, []);
  const price = carat === "Custom" ? null : BASE_NOK[carat] + CUT_NOK[cut] + METAL_NOK[metal];
  const image = images[`${cut}:${metal}`];
  const message = `Hi KAVEX, I would like guidance on ${carat === "Custom" ? "a custom carat" : `${carat}ct`} ${cut}, ${metal}. Ring size: ${ringSize === "confirm" ? "please help me confirm" : `EU ${ringSize}`}.${engraving ? ` Engraving: ${engraving} (${font}).` : ""}`;
  const conciergeUrl = `https://wa.me/${conciergeNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

  async function checkout() {
    if (busy || price === null) return;
    if (previewMode) { setError("This is a UI preview. Stripe checkout is not connected yet."); return; }
    setBusy(true); setError("");
    try {
      const configuration = { cut, carat, metal, ringSize, engraving, font };
      try { sessionStorage.setItem("kavex-checkout-build", JSON.stringify({ version: PRICING_VERSION, ...configuration })); } catch { /* Optional persistence. */ }
      const signature = JSON.stringify(configuration);
      // Reuse the same attempt after a timeout; a changed build gets a new attempt.
      if (!attempt.current || attempt.current.signature !== signature || Date.now() - attempt.current.created > 20 * 60 * 60 * 1000) {
        attempt.current = { signature, id: crypto.randomUUID(), created: Date.now() };
      }
      const response = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ configuration, requestId: attempt.current.id, pricingVersion: PRICING_VERSION }),
        signal: AbortSignal.timeout(25000),
      });
      const result = await response.json();
      if (!response.ok || typeof result.url !== "string") throw new Error(result.error || "Checkout is unavailable. Please try again.");
      const url = new URL(result.url);
      if (url.protocol !== "https:" || url.hostname !== "checkout.stripe.com") throw new Error("Unexpected checkout destination.");
      window.location.assign(url.href);
    } catch (cause) {
      setError(cause instanceof Error && cause.name === "TimeoutError"
        ? "The connection timed out. Please retry your checkout."
        : cause instanceof Error ? cause.message : "Please try again.");
      setBusy(false);
    }
  }

  return <section className="kv" aria-label="KAVEX bespoke ring configurator">
    <header className="kv-header"><a href="/" className="kv-brand">KAVEX <span>LABS</span></a><a href={conciergeUrl} target="_blank" rel="noopener noreferrer">Private concierge ↗</a></header>
    <main className="kv-layout">
      <div className="kv-stage">
        <div className="kv-intro"><p className="kv-eyebrow">THE BESPOKE ATELIER / 01</p><h1>Made around <em>you.</em></h1><p>Choose the essentials. We refine the details.</p></div>
        <div className="kv-product" style={{ color: metal === "18K Yellow Gold" ? "#c9af79" : metal === "Platinum" ? "#dce2e7" : "#b8bdc4" }}>
          {renderPreview ? renderPreview({cut,carat,metal}) : image ? <img src={image} alt={`${carat}ct ${cut} ring design in ${metal}`} /> : <div className="kv-illustration"><div className="kv-band" /><div className="kv-center" style={{ width: `${carat === "2.0" ? 128 : carat === "1.0" ? 92 : 110}px` }}><Stone cut={cut} /></div></div>}
        </div>
        <div className="kv-caption"><span>{cut} solitaire · {carat === "Custom" ? "Custom scale" : `${carat} ct`} · {metal}</span><small>Design illustration. Final stone and CAD confirmed separately.</small></div>
      </div>
      <div className="kv-controls">
        <p className="kv-eyebrow">YOUR SPECIFICATION</p>
        <nav className="kv-steps" aria-label="Configuration steps">{["Cut", "Carat", "Metal"].map((name, index) => <button key={name} type="button" aria-current={step === index ? "step" : undefined} onClick={() => setStep(index)} disabled={busy}><span>0{index + 1}</span>{name}</button>)}</nav>
        <fieldset disabled={busy} className="kv-fieldset">
          <legend>{["The centerpiece", "The scale", "The foundation"][step]}</legend>
          <p className="kv-muted">{["A silhouette that feels like you.", "Choose your diamond’s presence.", "The precious metal that brings it together."][step]}</p>
          {step === 0 && <div className="kv-cut-grid">{CUTS.map(value => <button key={value} type="button" className="kv-option" aria-pressed={cut === value} onClick={() => setCut(value)}><Stone cut={value} /><span>{value}</span></button>)}</div>}
          {step === 1 && <div className="kv-options">{CARATS.map(value => <button key={value} type="button" className="kv-option kv-row" aria-pressed={carat === value} onClick={() => setCarat(value)}><span>{value === "Custom" ? "Custom carat" : `${value} ct`}</span><small>{value === "Custom" ? "Personally sourced" : value === "1.5" ? "Our signature scale" : "Lab-grown diamond"}</small></button>)}</div>}
          {step === 2 && <div className="kv-options">{METALS.map(value => <button key={value} type="button" className="kv-option kv-row" aria-pressed={metal === value} onClick={() => setMetal(value)}><span><i className="kv-swatch" style={{ background: value === "18K Yellow Gold" ? "linear-gradient(135deg,#e3cc91,#9f8147)" : value === "Platinum" ? "linear-gradient(135deg,#fafafa,#859198)" : "linear-gradient(135deg,#d5d7da,#777d88)" }} />{value}</span><small>{value === "Platinum" ? "PT950" : "750 fine gold"}</small></button>)}</div>}
        </fieldset>
        <div className="kv-navigation">{step > 0 && <button type="button" onClick={() => setStep(step - 1)} disabled={busy}>← Back</button>}{step < 2 && <button type="button" onClick={() => setStep(step + 1)} disabled={busy}>Continue →</button>}</div>
        <details className="kv-personal"><summary>Make it personal <span>Engraving included ＋</span></summary><fieldset disabled={busy} className="kv-fieldset">
          <label htmlFor={`${ids}-size`}>Ring size</label><select id={`${ids}-size`} value={ringSize} onChange={event => setRingSize(event.target.value)}><option value="confirm">Confirm with my jeweler</option>{Array.from({ length: 29 }, (_, index) => String(index + 44)).map(size => <option key={size} value={size}>EU {size}</option>)}</select>
          <label htmlFor={`${ids}-engraving`}>Your engraving</label><input id={`${ids}-engraving`} value={engraving} onChange={event => setEngraving(Array.from(event.target.value).slice(0, 24).join(""))} placeholder="Forever & Always" aria-describedby={`${ids}-engraving-note`} />
          <small id={`${ids}-engraving-note`}>{Array.from(engraving).length}/24 characters · workshop approval before engraving</small>
          <div className="kv-fonts" role="group" aria-label="Engraving font">{(Object.keys(FONTS) as Font[]).map(value => <button type="button" key={value} aria-pressed={font === value} onClick={() => setFont(value)} style={{ fontFamily: FONTS[value] }}>{value}</button>)}</div>
          <div className="kv-engraving-preview" data-font={font} style={{ fontFamily: FONTS[font] }}>{engraving || "Forever & Always"}</div>
        </fieldset></details>
        <p className="kv-included">IGI certification · Personal engraving · Presentation box</p>
        <p className="kv-payment"><strong>Klarna.</strong> Pay later options at checkout.<small>Subject to eligibility and approval.</small></p>
        <a className="kv-concierge" href={conciergeUrl} target="_blank" rel="noopener noreferrer">Discuss this build with your private jeweler ↗</a>
      </div>
    </main>
    <footer className="kv-summary"><div><small>YOUR PERSONAL QUOTE</small><strong aria-live="polite" aria-atomic="true">{price === null ? "Personally quoted" : nok(price)}</strong><span>{cut} · {carat === "Custom" ? "Custom" : `${carat} ct`} · {metal}</span></div><div className="kv-checkout">{error && <p role="alert">{error}</p>}{price === null ? <a className="kv-primary" href={conciergeUrl} target="_blank" rel="noopener noreferrer">Request a bespoke quote ↗</a> : <button type="button" className="kv-primary" disabled={busy} onClick={checkout}>{busy ? "Opening secure checkout…" : "Lock in build →"}</button>}<small>{price === null ? "Personally sourced by your jeweler" : "Secure Stripe checkout · Klarna & card"}</small></div></footer>
    <style>{`
      .kv{--gold:#ccb780;--ink:#0b0d0f;--line:#ffffff1c;background:var(--ink);color:#f1f1ed;font:14px/1.5 Arial,sans-serif;min-height:100vh}.kv *{box-sizing:border-box}.kv a{color:inherit;text-decoration:none}.kv button,.kv input,.kv select{font:inherit}.kv button{cursor:pointer}.kv button:disabled{cursor:wait;opacity:.65}.kv a:focus-visible,.kv button:focus-visible,.kv input:focus-visible,.kv select:focus-visible,.kv summary:focus-visible{outline:2px solid var(--gold);outline-offset:4px}.kv-header{display:flex;align-items:center;justify-content:space-between;padding:26px 4%;border-bottom:1px solid var(--line);font-size:12px}.kv-brand{font-size:21px;letter-spacing:.24em}.kv-brand span{font-size:11px;margin-left:8px;color:#9da1a6}.kv-layout{display:grid;grid-template-columns:minmax(0,1fr) 420px;max-width:1800px;margin:auto}.kv-stage{position:relative;min-height:650px;padding:44px 7%;display:flex;flex-direction:column;background:radial-gradient(ellipse at 50% 62%,#22272b 0%,#101315 43%,#0b0d0f 74%)}.kv-eyebrow{font-size:10px;letter-spacing:.2em;color:var(--gold);margin:0 0 16px}.kv-intro h1{font:56px/1.1 Georgia,serif;font-weight:400;letter-spacing:-.04em;margin:0}.kv-intro h1 em{font-weight:400;color:var(--gold)}.kv-intro>p:last-child{color:#9ea3a9;font-size:13px}.kv-product{flex:1;display:grid;place-items:center;min-height:340px}.kv-product>img{width:100%;max-height:470px;object-fit:contain}.kv-illustration{height:270px;width:270px;position:relative;transform:rotate(-14deg);filter:drop-shadow(0 30px 22px #000)}.kv-band{border:13px solid currentColor;border-radius:50%;height:170px;width:195px;position:absolute;left:38px;top:85px;box-shadow:inset 3px 0 5px #ffffff65,3px 0 3px #ffffff45}.kv-center{position:absolute;left:50%;top:7px;transform:translateX(-50%);background:#181d21}.kv-center svg{display:block;width:100%;height:140px;color:#dfeaf3;filter:drop-shadow(0 0 12px #ffffff30)}.kv-caption{display:grid;gap:9px;text-align:center;font-size:12px;color:#b7bdc2}.kv-caption small{font-size:10px;color:#70767e}.kv-controls{padding:40px 30px;border-left:1px solid var(--line);background:#111416}.kv-steps{display:flex;gap:20px;margin-bottom:28px;border-bottom:1px solid var(--line)}.kv-steps button{background:none;border:0;border-bottom:2px solid transparent;padding:0 0 15px;color:#717880;font-size:12px}.kv-steps button[aria-current=step]{color:#fff;border-bottom-color:var(--gold)}.kv-steps span{font-size:9px;margin-right:8px;color:var(--gold)}.kv-fieldset{border:0;padding:0;margin:0;min-width:0}.kv-fieldset legend{font:27px Georgia,serif;margin-bottom:6px}.kv-muted{color:#838b94;font-size:12px;margin:0 0 20px}.kv-cut-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.kv-option{background:#14181b;border:1px solid #ffffff20;color:#aab2ba;padding:12px;transition:background .18s,border-color .18s;min-height:60px}.kv-option:hover{border-color:#ffffff60}.kv-option[aria-pressed=true],.kv-fonts button[aria-pressed=true]{border-color:var(--gold);background:#ccb7800c;color:#f3e3bd}.kv-option svg{width:44px;height:54px;display:block;margin:0 auto 6px}.kv-option span{font-size:12px}.kv-options{display:grid;gap:10px}.kv-row{display:flex;align-items:center;justify-content:space-between;padding:20px 15px;text-align:left}.kv-row>span{display:flex;align-items:center;gap:12px}.kv-row small{color:#838b94;font-size:10px}.kv-swatch{display:inline-block;width:24px;height:24px;border-radius:50%;border:1px solid #ffffff40}.kv-navigation{display:flex;justify-content:flex-end;gap:22px;margin-top:22px}.kv-navigation button{color:#ddd;background:none;border:0;font-size:12px;padding:6px 0}.kv-personal{margin-top:28px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:19px 0}.kv-personal summary{cursor:pointer;font-size:12px;display:flex;justify-content:space-between;gap:10px}.kv-personal summary>span{color:#979eaa;font-size:10px}.kv-personal[open] .kv-fieldset{padding-top:20px}.kv-personal label{display:block;margin:14px 0 8px;font-size:11px;color:#b5bdc6}.kv-personal input,.kv-personal select{width:100%;padding:12px;background:#171c20;border:1px solid #ffffff26;color:#fff;border-radius:0}.kv-personal small{font-size:10px;color:#808b96;display:block;margin-top:7px}.kv-fonts{display:flex;gap:8px;margin-top:18px}.kv-fonts button{flex:1;min-height:40px;color:#b8c1c9;background:#171c20;border:1px solid #ffffff26}.kv-engraving-preview{min-height:75px;display:grid;place-items:center;padding:15px;overflow-wrap:anywhere;font-size:23px;color:var(--gold)}.kv-included{font-size:10px;color:#969fa8;margin:22px 0}.kv-payment{font-size:11px;color:#bdc4cb}.kv-payment strong{background:#f4bfd3;color:#151015;padding:5px 9px;margin-right:8px;font-size:13px}.kv-payment small{display:block;color:#7f8993;font-size:9px;margin:10px 0}.kv-concierge{font-size:11px;display:inline-block;border-bottom:1px solid #ffffff30;padding-bottom:5px;margin-top:14px}.kv-summary{position:sticky;bottom:0;z-index:10;display:flex;justify-content:space-between;align-items:center;gap:20px;padding:20px 4%;border-top:1px solid var(--line);background:#0c0f12f5;backdrop-filter:blur(20px)}.kv-summary>div:first-child{display:grid;gap:3px}.kv-summary small{font-size:9px;color:#88939f;letter-spacing:.08em}.kv-summary strong{font:28px Georgia,serif}.kv-summary span{color:#9da8b2;font-size:10px}.kv-checkout{display:grid;gap:7px;text-align:center;min-width:280px}.kv-primary{display:block;border:1px solid var(--gold);background:var(--gold);color:#111!important;padding:17px 25px;font-size:12px;font-weight:600;letter-spacing:.04em}.kv-checkout p{color:#ffbbba;font-size:12px;max-width:350px;margin:0}.kv-checkout small{letter-spacing:0}.kv-primary:disabled{opacity:.7}
      @media(max-width:850px){.kv-layout{grid-template-columns:1fr}.kv-stage{min-height:490px;padding:30px 6%}.kv-intro h1{font-size:42px}.kv-product{min-height:280px}.kv-illustration{transform:rotate(-14deg) scale(.85)}.kv-controls{border-left:0;border-top:1px solid var(--line);padding:28px 6%}.kv-cut-grid{grid-template-columns:repeat(5,1fr)}.kv-option{padding:10px 5px}.kv-option span{font-size:10px}.kv-option svg{width:34px}.kv-summary{padding:15px 6%;align-items:stretch}.kv-summary>div:first-child{min-width:0}.kv-summary strong{font-size:23px}.kv-summary span{display:none}.kv-checkout{min-width:0;max-width:60%}.kv-primary{padding:14px 15px;font-size:11px}.kv-checkout small{font-size:8px}.kv-header{padding:20px 6%}.kv-brand{font-size:17px}.kv-header>a:last-child{font-size:10px}}@media(prefers-reduced-motion:reduce){.kv-option{transition:none}}
    `}</style>
  </section>;
}
