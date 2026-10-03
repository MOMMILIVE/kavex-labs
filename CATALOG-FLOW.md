# Kavex Labs catalog flow

The new Next.js `/catalog` route adds the five-section value ladder. The existing homepage, its visual design, and legacy pages remain intact. Existing concierge CTAs enter `/catalog`; `/bespoke` remains available. The homepage HTML is restored from `main` to retain the live site's existing pricing slider instead of the previous Next.js branch's replacement commissioning section. Based on `codex/bespoke-configurator` because `main` is still a static export.

## Copy direction

1. Engineered for the uncompromising. Bespoke diamonds. Direct lab access.
2. The Retail Markup. You pay for the storefront. The intermediaries. The name above the door.
3. Atomic perfection. Direct from the lab. Engineered diamonds. Precise specifications. Your commission.
4. The Ring Archive. Finished commissions. Precision in every detail.
5. Your next commission starts here. Select your cut. Request the catalog.

## Components

- `app/catalog/page.tsx`: five sections, in the requested order.
- `InteractiveShapeSelector.tsx`: Oval, Emerald, Radiant, Round and Pear. Native radio inputs, keyboard support, thin-line inline SVGs, selected stroke and restrained glow.
- `CatalogLeadForm.tsx`: Name, Phone Number and shape. POSTs to `/api/leads`. A confirmed save reveals the user-controlled WhatsApp link. No message is sent automatically.
- `StickyCatalogCTA.tsx`: mobile-only black CTA, smooth anchor scroll, safe-area padding.
- `RingArchive.tsx`: responsive film grid. Uses restrained placeholders when factory files are absent.
- `LoopVideo.tsx`: muted, looping, inline video with playback controls. Pauses off screen and on hidden tabs. Does not autoplay for reduced-motion visitors.

## Backend

No existing lead database was found. This implementation adds SQLite/libSQL storage, server-side validation and idempotent requests. Table: `catalog_leads`. Fields: `request_id`, `name`, `phone`, `shape`, `source`, `created_at`.

Development: `npm ci && npm run dev`. The first accepted submission creates `data/leads.db`, which is ignored by Git. No personal information is logged or included in repository files.

Production needs persistent storage. Configure `LEADS_DATABASE_URL` and, for hosted libSQL, `LEADS_DATABASE_AUTH_TOKEN`. On Vercel, use a hosted libSQL database URL. A local file on a serverless function is not durable. The endpoint returns 503 when production storage is missing, and the form does not claim success. For self-hosting, use a `file:///absolute/path/leads.db` URL on a persistent volume.

The catalog PDF and delivery service are not in the repository. The form saves the request and offers WhatsApp concierge continuation using the existing repository number. It does not claim to email, text or automatically deliver a PDF.

## Media

The catalog page echoes the original oversized KAVEX/LABS wordmark, floating menu, monochrome icon and dotted overlay. New editorial headings use the established Cormorant Garamond font.

The existing `assets/hero_bg.mp4` provides the full-width background, with an exact 60 percent black overlay. To replace it, pull a macro-lens diamond or abstract dark-glass `.mp4` loop from [Coverr](https://coverr.co/) or [Pexels](https://www.pexels.com/videos/). Download a suitable licensed clip and replace this file. No static image is used for the hero loop.

Add your actual finished-ring factory films:

- `assets/ring-archive/solitaire.mp4`
- `assets/ring-archive/setting.mp4`
- `assets/ring-archive/bands.mp4`

Rebuild after adding media. `prepare-public.mjs` copies these into `public/assets/ring-archive/`. No empty `.mp4` files or invented factory footage are included. Change film names and captions in `app/catalog/page.tsx` to match your actual archive.

## Verification

`npm test` covers existing checkout behavior plus lead validation, SQLite persistence, retry deduplication, payload conflicts and save failures. `npm run build` verifies the Next.js routes and TypeScript. Browser verification covers desktop/mobile overflow, CTA scrolling, radio selection and saved-lead success.
