import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Stripe from 'stripe';
import checkout from '../pages/api/checkout';
import Configurator from '../components/KavexBespoke';
import { makeConciergeLink } from '../lib/design-brief';

process.env.STRIPE_SECRET_KEY = 'sk_test_SYNTHETIC_NO_NETWORK';
process.env.APP_URL = 'http://localhost:3000';
const calls: { data: any; options: any }[] = [];
const mockSender = () => ({
  _request(_method: string, _host: string, _path: string, data: any, _auth: any, options: any, _usage: any, callback: any) {
    calls.push({ data, options });
    callback(null, { status: 'open', url: 'https://checkout.stripe.com/c/pay/test' });
  },
});
(Stripe as any)._requestSenderFactory = mockSender;
// The SDK's CJS entry point wraps the actual class.
(Object.getPrototypeOf(Stripe) as any)._requestSenderFactory = mockSender;
const base = { cut: 'Oval', carat: '1.5', metal: '18K Yellow Gold', ringSize: 'confirm', engraving: '', font: 'Signature' };
const payload = (configuration = base) => ({ configuration, requestId: '12345678-1234-4234-8234-123456789abc', pricingVersion: 'review-2026-10-01' });
async function request(body: any = payload(), overrides: any = {}) {
  const result: any = { code: 0, body: null, headers: {} };
  const res: any = { setHeader: (key: string, value: string) => { result.headers[key] = value; }, status: (code: number) => { result.code = code; return res; }, json: (body: any) => { result.body = body; return res; } };
  await checkout({ method: 'POST', headers: { origin: 'http://localhost:3000', 'content-type': 'application/json' }, body, ...overrides } as any, res);
  return result;
}

test('the public flow begins with shape selection, no prices and no contact gate', () => {
  const html = renderToStaticMarkup(<Configurator />);
  assert.match(html, /Which shape/);
  assert.match(html, /Diamond shape/);
  assert.match(html, /atelier-hero/);
  assert.doesNotMatch(html, /NOK|32[^0-9]000|Klarna|type="tel"|type="password"|checkout|canvas/);
});
test('the concierge draft preserves the complete brief, including Unicode and guidance choices', () => {
  const url = new URL(makeConciergeLink({shape:'Pear',carat:'Custom',metal:'Platinum',engraving:'For alltid ♥ & oss',font:'Classic',ringSize:'EU 57',name:' Review Customer ',phone:'+47 00000000'}));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/4748900083');
  const message = url.searchParams.get('text')!;
  assert.match(message, /Name: Review Customer\nWhatsApp: \+47 00000000/);
  assert.match(message, /Diamond shape: Pear\nScale: Custom\nMetal: Platinum\nRing size: EU 57/);
  assert.match(message, /For alltid ♥ & oss \(Classic\)/);
  assert.doesNotMatch(message, /NOK|paid|confirmed|price/i);
});
test('server charges the default quote in øre, with the requested NOK/Klarna/card settings', async () => {
  assert.equal((await request()).code, 200);
  const { data } = calls.at(-1)!;
  assert.equal(data.line_items[0].price_data.unit_amount, 3200000);
  assert.equal(data.line_items[0].price_data.currency, 'nok');
  assert.deepEqual(data.payment_method_types, ['klarna', 'card']);
  assert.deepEqual(data.shipping_address_collection.allowed_countries, ['NO']);
  assert.equal(data.metadata.ring_size, 'confirm');
  assert.equal(data.success_url, 'http://localhost:3000/bespoke?checkout=complete&session_id={CHECKOUT_SESSION_ID}');
});
test('2ct Pear Platinum uses the protected tier and preserves the engraving', async () => {
  await request(payload({ ...base, cut: 'Pear', carat: '2.0', metal: 'Platinum', ringSize: '57', engraving: 'For alltid ♥', font: 'Classic' }));
  assert.equal(calls.at(-1)!.data.line_items[0].price_data.unit_amount, 4640000);
  assert.equal(calls.at(-1)!.data.payment_intent_data.metadata.engraving, 'For alltid ♥');
});
test('retries send identical parameters and the same idempotency key', async () => {
  await request(); const first = calls.at(-1)!;
  await request(); const second = calls.at(-1)!;
  assert.deepEqual(first.data, second.data);
  assert.equal(first.options.headers['Idempotency-Key'], second.options.headers['Idempotency-Key']);
  assert.ok(first.options.headers['Idempotency-Key']);
});
test('amount injection, invalid enum, prototype keys, invalid size, and custom carats are rejected without contacting Stripe', async () => {
  const before = calls.length;
  const bad = [
    { ...payload(), amount: 1 },
    payload({ ...base, price: 1 } as any),
    payload({ ...base, metal: '__proto__' }),
    payload({ ...base, carat: 'Custom' }),
    payload({ ...base, ringSize: '99' }),
    payload({ ...base, engraving: 'x'.repeat(25) }),
    payload({ ...base, font: 'unknown' }),
  ];
  for (const body of bad) assert.equal((await request(body)).code, 400);
  assert.equal(calls.length, before);
});
test('method, origin, content type and stale price version guards work', async () => {
  assert.equal((await request(payload(), { method: 'GET' })).code, 405);
  assert.equal((await request(payload(), { headers: { origin: 'https://other.test' } })).code, 403);
  assert.equal((await request(payload(), { headers: { origin: 'http://localhost:3000', 'content-type': 'text/plain' } })).code, 415);
  assert.equal((await request({ ...payload(), pricingVersion: 'stale' })).code, 409);
});
test('review tiers cannot accidentally charge live keys before approval', async () => {
  process.env.STRIPE_SECRET_KEY = 'sk_live_SYNTHETIC_NO_NETWORK';
  delete process.env.PRICING_APPROVED;
  const before = calls.length;
  assert.equal((await request()).code, 503);
  assert.equal(calls.length, before);
});
