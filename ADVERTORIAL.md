# Kavex Labs advertorial

Ad destination: `/manifesto`. CTA destination: `/vault-allocation`. Arabic versions use `/ar/manifesto` and `/ar/vault-allocation`; Norwegian Bokmål versions use `/no/manifesto` and `/no/vault-allocation`.

The existing homepage and routes remain static. `advertorial-app/` is an isolated Next.js App Router app with a static export. The root build stages existing public files into `dist/`, then adds the six exported language/page combinations and their compiled assets under `/advertorial/_next/`. It checks that the staged homepage is byte-for-byte identical to the original. Vercel still handles the existing root `api/` functions separately.

## Copy and identity

`advertorial-app/content/03_Advertorial_Copy_and_Layout.md` is the supplied copy source. The server component reads the marked copy sections at build time; layout instructions are not displayed. The existing site provided the Kavex mark, Geist font family, #121212 background, white pill controls, and original CAD / gold-pour photographs. Geist and Noto Sans Arabic are self-hosted with their OFL licenses. The English headline and client proof target Scandinavia. A translated market-update banner below navigation highlights daily commodity price fluctuations and current direct-forge pricing. The article guarantee retains worldwide shipping and included import charges. Step 05 places the supplied 48-hour CAD quote price-lock disclaimer directly above the final action, in muted italic text. Quote issuance and the stated lock are handled by the concierge; the website does not issue quotes or run a pricing timer. The first guarantee combines shipping and included import charges, followed by conflict-free sourcing, independent IGI certification (03), and first-year resizing coverage (04). The tax wording follows the supplied promise that Kavex pays import duties and VAT.

The shared article/form navigation is sticky at the top, with a translucent dark background and an 18px backdrop blur (solid dark fallback). Its white CTA reads “Request Allocation” in English, with Norwegian and Arabic equivalents. Scroll offsets keep chapter anchors and the article contents rail below the sticky header. The bordered EN / AR / NO switcher uses flags, larger tap targets, and a white active-language pill. Its mobile row keeps the choices visible. It preserves the current page when changing language. Step 02 uses original inline SVG face-up diagrams for Oval, Round, Emerald, Radiant, and Pear, plus a compass for the recommendation choice. The drawings inherit the monochrome selection state, remain decorative for assistive technology, and share the existing radio labels. The shape grid uses three desktop columns, two tablet columns, and one mobile column. Both the article and all five quiz steps are translated through `advertorial-app/lib/i18n.ts`. Arabic uses right-to-left layout with left-to-right brand, prices, and telephone input. Dedicated root layouts set each exported document's language and direction. Canonical and language-alternate links cover all three versions. A language change navigates to the translated page and starts a fresh quiz; the selected language is included in the concierge draft. Review the translations with native speakers before publication.

The source's retail markup, rating/client count, testimonial, price comparison, worldwide shipping, tax/import guarantee, IGI grading/laser inscription and physical dossier, first-year resizing coverage, market-pricing urgency and the 48-hour quote lock, conflict-free, sustainability, and climate-neutral statements are user-supplied marketing claims. This implementation does not independently verify them. Confirm these claims before approving publication. Ad routes are `noindex, follow` by default and are not added to homepage navigation.

## Build

```sh
npm ci
npm ci --prefix advertorial-app
npm run build
npm run typecheck --prefix advertorial-app
```

Deploy with the repository root unchanged. `vercel.json` supplies the install/build commands and `dist` output directory. Source files, environment files, tests, node_modules, and the Next app itself are not staged publicly. Homepage, CSS, JavaScript, logo, original assets, and static subpages are copied unchanged.

## Private request

The five-step quiz asks for commission, diamond shape, carat weight, comfortable budget, and name/phone number. The phone label requests an iMessage/WhatsApp concierge contact; the existing WhatsApp draft handoff includes that preference and all five answers. Radio inputs, keyboard focus, inline validation, back navigation, consent, mobile layouts, and reduced-motion preferences are supported. It uses the site's existing concierge number `+47 489 00 083`.

Contact details stay in React state. The final action opens a WhatsApp draft containing the brief; the client must tap Send in WhatsApp. There is no backend lead storage or automatic outbound message. The UI explains this handoff explicitly. No phone number is added to a local URL or analytics payload.

## Review

Use a preview deployment first. Review the supplied claims and verify the current concierge recipient before merging/publishing. The code does not change homepage content, shared `style.css`, `main.js`, existing routes, or existing API handlers.

## Performance assets

The Arabic font uses a WOFF2 version of the existing Noto Sans Arabic font at its original normal width. All characters and variable weights remain; the unused condensed-width axis is removed. Regenerate it with `scripts/optimize-advertorial-font.py` and FontTools' WOFF extras. Original TTF and license remain as source material.

Responsive images in `advertorial-app/public/advertorial/media` are committed build inputs. Regenerate them with `node scripts/optimize-advertorial-media.mjs` after installing the locked app dependencies (Sharp is supplied by Next.js). The largest candidate preserves the original asset bytes; narrower candidates serve smaller viewports. Filenames contain content hashes and can safely be cached for a year. Original shared homepage images are untouched.

The form receives only its selected-language messages from the server component. Its browser bundle imports the lightweight route utilities and SVG Arrow directly, avoiding the full article/language dictionary. When adding form copy, include its translation key in `lib/quiz-messages.ts`.

On screens up to 700px wide, the header uses one 72px row and a native language disclosure showing the current flag and language code. Its absolutely positioned language list opens without increasing header height or adding client JavaScript. The desktop three-language selector remains in place. Mobile CTA and language control retain 44px tap heights.
