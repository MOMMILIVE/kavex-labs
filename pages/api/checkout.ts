import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { createHash } from "node:crypto";

// Server-owned example tiers: update these together with the UI before taking live orders.
const BASE_NOK = { "1.0": 25000, "1.5": 32000, "2.0": 39500 } as const;
const CUT_NOK = { Round: 0, Oval: 0, Emerald: 1200, Radiant: 1500, Pear: 900 } as const;
const METAL_NOK = { "18K White Gold": 0, "18K Yellow Gold": 0, Platinum: 6000 } as const;
const PRICING_VERSION = "review-2026-10-01";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
type Build = {
  cut: keyof typeof CUT_NOK;
  carat: keyof typeof BASE_NOK;
  metal: keyof typeof METAL_NOK;
  ringSize: string;
  engraving: string;
  font: "Classic" | "Signature" | "Modern";
};
type Result = { url: string } | { error: string };

function owns(object: object, key: unknown): key is string {
  return typeof key === "string" && Object.prototype.hasOwnProperty.call(object, key);
}

function validate(value: unknown): Build | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const data = value as Record<string, unknown>;
  const fields = ["cut", "carat", "metal", "ringSize", "engraving", "font"];
  if (Object.keys(data).some(key => !fields.includes(key))) return null;
  if (!owns(CUT_NOK, data.cut) || !owns(BASE_NOK, data.carat) || !owns(METAL_NOK, data.metal)) return null;
  if (typeof data.ringSize !== "string" || !/^(confirm|4[4-9]|[56][0-9]|7[0-2])$/.test(data.ringSize)) return null;
  if (typeof data.engraving !== "string" || /[\u0000-\u001f\u007f]/.test(data.engraving)) return null;
  const engraving = data.engraving.normalize("NFC").trim();
  if (Array.from(engraving).length > 24) return null;
  if (data.font !== "Classic" && data.font !== "Signature" && data.font !== "Modern") return null;
  return {
    cut: data.cut as Build["cut"], carat: data.carat as Build["carat"], metal: data.metal as Build["metal"],
    ringSize: data.ringSize, engraving, font: data.font,
  };
}

export const config = { api: { bodyParser: { sizeLimit: "8kb" } } };

export default async function checkout(req: NextApiRequest, res: NextApiResponse<Result>) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST." });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY; // Never use NEXT_PUBLIC_ for this key.
  const configuredUrl = process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}` : process.env.APP_URL;
  if (!secretKey || !configuredUrl) return res.status(503).json({ error: "Checkout has not been configured." });
  let origin: string;
  try {
    const site = new URL(configuredUrl);
    if (site.protocol !== "https:" && !(site.protocol === "http:" && ["localhost", "127.0.0.1"].includes(site.hostname))) throw new Error();
    origin = site.origin;
  } catch {
    return res.status(503).json({ error: "Checkout has not been configured." });
  }
  // Do not use the incoming Host header to construct redirects.
  if (req.headers.origin !== origin) return res.status(403).json({ error: "Invalid request origin." });
  if (!req.headers["content-type"]?.startsWith("application/json")) return res.status(415).json({ error: "Send JSON." });
  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body) ||
      Object.keys(body).some(key => !["configuration", "requestId", "pricingVersion"].includes(key))) {
    return res.status(400).json({ error: "Invalid checkout request." });
  }
  if (body.pricingVersion !== PRICING_VERSION) return res.status(409).json({ error: "Prices were updated. Refresh your configuration." });
  const build = validate(body.configuration);
  if (!build || typeof body.requestId !== "string" || !UUID.test(body.requestId)) {
    return res.status(400).json({ error: "Invalid ring configuration. Custom carats require a concierge quote." });
  }
  // Review prices can be tested with sandbox keys. Explicitly approve them before live charges.
  if (secretKey.includes("_live_") && process.env.PRICING_APPROVED !== "true") {
    return res.status(503).json({ error: "Your jeweler is confirming the final price tiers. Please contact the concierge." });
  }

  // No amount, price, currency or premium is accepted from the browser.
  const totalNok = BASE_NOK[build.carat] + CUT_NOK[build.cut] + METAL_NOK[build.metal];
  const configurationHash = createHash("sha256").update(JSON.stringify({ version: PRICING_VERSION, ...build })).digest("hex");
  const idempotencyKey = `kavex:${body.requestId}:${configurationHash}`;
  const metadata = {
    configuration_id: configurationHash,
    pricing_version: PRICING_VERSION,
    cut: build.cut, carat: build.carat, metal: build.metal, ring_size: build.ringSize,
    engraving_font: build.font, engraving: build.engraving, quoted_total_nok: String(totalNok),
  };
  try {
    const stripe = new Stripe(secretKey, { maxNetworkRetries: 2, timeout: 20000 });
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["klarna", "card"],
      integration_identifier: "kavex_bespoke_mrqaxvje",
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["NO"] },
      phone_number_collection: { enabled: true },
      locale: "nb",
      client_reference_id: body.requestId,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "nok",
          unit_amount: totalNok * 100, // NOK -> øre; 32,000 NOK = 3,200,000.
          product_data: {
            name: `KAVEX bespoke ring — ${build.carat}ct ${build.cut}`,
            description: `${build.metal} · ${build.ringSize === "confirm" ? "Ring size to be confirmed" : `EU ${build.ringSize}`} · IGI certificate, engraving and presentation box included`,
            metadata,
          },
        },
      }],
      metadata,
      payment_intent_data: { metadata },
      success_url: `${origin}/bespoke?checkout=complete&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/bespoke?checkout=cancelled`,
      // Totals are assumed to include your approved tax/shipping costs; nothing is added silently.
    }, { idempotencyKey });
    if (!session.url || session.status !== "open") return res.status(409).json({ error: "This checkout has ended. Start a new build." });
    return res.status(200).json({ url: session.url });
  } catch {
    // Do not expose Stripe errors, secret keys, or customer data to the browser/logs.
    return res.status(502).json({ error: "Secure checkout is temporarily unavailable. Please retry." });
  }
}
