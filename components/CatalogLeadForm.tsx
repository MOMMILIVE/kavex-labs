"use client";

import { useRef, useState, type FormEvent } from 'react';
import InteractiveShapeSelector from './InteractiveShapeSelector';
import { parseCatalogLead, type DiamondShape } from '@/lib/catalog';

export default function CatalogLeadForm() {
  const [shape, setShape] = useState<DiamondShape>('Oval');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const attempt = useRef<{ payload: string; key: string } | null>(null);
  const submitting = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const data = new FormData(event.currentTarget);
    const lead = parseCatalogLead({ name: data.get('name'), phone: data.get('phone'), shape });
    if (!lead) { setError('Enter your name and a valid phone number.'); return; }
    const payload = JSON.stringify(lead);
    if (attempt.current?.payload !== payload) attempt.current = { payload, key: crypto.randomUUID() };
    submitting.current = true;
    setPending(true); setError('');
    try {
      const response = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': attempt.current.key }, body: payload });
      const result = await response.json();
      if (!response.ok || result.ok !== true || typeof result.whatsappUrl !== 'string' || !result.whatsappUrl.startsWith('https://wa.me/')) throw new Error('Submission failed');
      setWhatsappUrl(result.whatsappUrl);
    } catch { setError('Your request could not be saved. Please try again.'); }
    finally { submitting.current = false; setPending(false); }
  }

  if (whatsappUrl) return <div role="status" className="border-t border-[#333333] py-10">
    <h3 className="font-display text-4xl">Request received.</h3>
    <p className="mt-4 text-sm leading-7 text-[#C0C0C0]">Continue with your concierge to receive the catalog.</p>
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-14 items-center border border-[#333333] bg-black px-8 text-sm text-[#F3F3F3] hover:border-[#C0C0C0]">Continue on WhatsApp <span aria-hidden="true" className="ml-8">↗</span></a>
  </div>;

  return <form onSubmit={submit} className="space-y-10" aria-label="Request the pricing catalog">
    <InteractiveShapeSelector value={shape} onChange={setShape} disabled={pending} />
    <div className="grid gap-8 sm:grid-cols-2">
      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C0C0C0]">Name
        <input name="name" autoComplete="name" required minLength={2} maxLength={100} disabled={pending} className="mt-3 block min-h-14 w-full border-0 border-b border-[#333333] bg-transparent text-base normal-case tracking-normal text-[#F3F3F3] outline-none focus:border-[#F3F3F3]" />
      </label>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C0C0C0]">Phone Number
        <input name="phone" type="tel" inputMode="tel" autoComplete="tel" required minLength={7} maxLength={32} disabled={pending} aria-describedby="phone-note" className="mt-3 block min-h-14 w-full border-0 border-b border-[#333333] bg-transparent text-base normal-case tracking-normal text-[#F3F3F3] outline-none focus:border-[#F3F3F3]" />
      </label>
    </div>
    <p id="phone-note" className="text-xs text-[#999999]">Include your country code.</p>
    {error ? <p role="alert" className="text-sm text-[#F3F3F3]">{error}</p> : null}
    <button disabled={pending} className="flex min-h-16 w-full items-center justify-between border border-[#333333] bg-black px-6 text-sm text-[#F3F3F3] transition-colors hover:border-[#C0C0C0] disabled:cursor-wait disabled:opacity-60">
      {pending ? 'Saving your request.' : 'Send Me The Catalog'}<span aria-hidden="true">↗</span>
    </button>
    <p className="text-[11px] leading-6 text-[#999999]">By requesting the catalog, you agree to be contacted about your request. <a href="/privacy" className="underline underline-offset-4">Privacy policy.</a></p>
  </form>;
}
