# Kavex Labs advertorial

Ad destination: `/manifesto`. CTA destination: `/vault-allocation`.

The existing homepage and routes remain static. `advertorial-app/` is an isolated Next.js App Router app with a static export. The root build stages existing public files into `dist/`, then adds only the two exported pages and their compiled assets under `/advertorial/_next/`. It checks that the staged homepage is byte-for-byte identical to the original. Vercel still handles the existing root `api/` functions separately.

## Copy and identity

`advertorial-app/content/03_Advertorial_Copy_and_Layout.md` is the supplied copy source. The server component reads the marked copy sections at build time; layout instructions are not displayed. The existing site provided the Kavex mark, Geist font family, #121212 background, white pill controls, and original CAD / gold-pour photographs. Geist is self-hosted with its OFL license.

The source's retail markup, rating/client count, testimonial, price comparison, tax/import guarantee, conflict-free, sustainability, and climate-neutral statements are user-supplied marketing claims. This implementation does not independently verify them. Confirm these claims before approving publication. Ad routes are `noindex, follow` by default and are not added to homepage navigation.

## Build

```sh
npm ci
npm ci --prefix advertorial-app
npm run build
npm run typecheck --prefix advertorial-app
```

Deploy with the repository root unchanged. `vercel.json` supplies the install/build commands and `dist` output directory. Source files, environment files, tests, node_modules, and the Next app itself are not staged publicly. Homepage, CSS, JavaScript, logo, original assets, and static subpages are copied unchanged.

## Private request

The five-step quiz asks for commission, diamond shape, carat weight, comfortable budget, and name/phone number. The phone label requests an iMessage/SMS concierge contact; the existing WhatsApp draft handoff includes that preference and all five answers. Radio inputs, keyboard focus, inline validation, back navigation, consent, mobile layouts, and reduced-motion preferences are supported. It uses the site's existing concierge number `+47 489 00 083`.

Contact details stay in React state. The final action opens a WhatsApp draft containing the brief; the client must tap Send in WhatsApp. There is no backend lead storage or automatic outbound message. The UI explains this handoff explicitly. No phone number is added to a local URL or analytics payload.

## Review

Use a preview deployment first. Review the supplied claims and verify the current concierge recipient before merging/publishing. The code does not change homepage content, shared `style.css`, `main.js`, existing routes, or existing API handlers.
