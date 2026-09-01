# Project: Precept QA Audit & Bug-Testing Suite

## Architecture
The Precept website (`/Users/mommilive/Desktop/precept-native`) is a 100% standalone native static site built with HTML5, CSS3, and modern ES6+ JavaScript.
- **Runtime Engines**:
  - `main.js`: Native interactive engine (500svh Process Orbit sticky scroll, real-time mouse/touch drag carousels, nav drawer controller, dynamic nav luminance detector, dual DotReveal particle canvases, logo marquee controller).
  - Smooth Scrolling & Animations: `@studio-freight/lenis` (inertial scroll), `gsap` & `ScrollTrigger`.
  - Global Design Tokens & Styles: `style.css` and scoped inline styles across 29 HTML pages.
- **Route Topology (29 Static Routes)**:
  - Homepage: `/` (`index.html`)
  - About: `/about` (`about/index.html`)
  - Capabilities (5 pages): `/capabilities`, `/capabilities/automated-inspection`, `/capabilities/precision-machining`, `/capabilities/robotic-assembly`, `/capabilities/system-integration`
  - Newsroom (6 pages): `/newsroom`, `/newsroom/filters/all`, `/newsroom/aerix-every-part-inspection`, `/newsroom/automation-should-fit-your-line`, `/newsroom/axlon-two-platforms-one-line`, `/newsroom/cargon-automated-floor-peak`
  - Careers (13 pages): `/careers` + 12 job postings (`automation-integration-engineer`, `cnc-machinist`, `controls-engineer`, `field-service-engineer`, `machine-vision-engineer`, `manufacturing-engineer`, `mechanical-design-engineer`, `quality-engineer`, `robotics-engineer`, `robotics-software-engineer`, `solutions-engineer`, `technical-writer`)
  - Contact & Legal: `/contact`, `/privacy`, `/404` (`404.html` and `404/index.html`)

## Code Layout
```
/Users/mommilive/Desktop/precept-native/
├── index.html
├── style.css
├── main.js
├── 404.html
├── about/index.html
├── capabilities/
│   ├── index.html
│   ├── automated-inspection/index.html
│   ├── precision-machining/index.html
│   ├── robotic-assembly/index.html
│   └── system-integration/index.html
├── newsroom/
│   ├── index.html
│   ├── filters/all/index.html
│   ├── aerix-every-part-inspection/index.html
│   ├── automation-should-fit-your-line/index.html
│   ├── axlon-two-platforms-one-line/index.html
│   └── cargon-automated-floor-peak/index.html
├── careers/
│   ├── index.html
│   └── [12 job postings]/index.html
├── contact/index.html
├── privacy/index.html
├── 404/index.html
├── tests/
│   ├── e2e_routes.spec.js
│   ├── e2e_interactive.spec.js
│   ├── e2e_responsive.spec.js
│   ├── e2e_cleanliness.spec.js
│   └── run_all_tests.js
└── .agents/
```

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | 29 Static Routes Resolution | All 29 routes load with HTTP status 200 without broken assets | M1 (Testing) / M2 (Fixes) | R1 |
| 2 | Zero Broken Internal Links | Every link across all 29 pages resolves to a valid destination with zero 404 errors | M1 (Testing) / M2 (Fixes) | R1 |
| 3 | Navigation Drawer System | Smooth 0.9s cubic-bezier grid expansion, backdrop blur, accordion, Escape key and click-outside dismissal | M1 (Testing) / M3 (Interactivity) | R2 |
| 4 | Capable Industries Drag Carousel | 5-slide carousel with real-time drag feedback, 40px drag threshold, button cycling | M1 (Testing) / M3 (Interactivity) | R2 |
| 5 | Testimonials Carousel | 4 unique quotes (Axlon, Aerix, Cargon, Voltan) cycling via Prev/Next buttons and drag | M1 (Testing) / M3 (Interactivity) | R2 |
| 6 | Newsroom Drag-vs-Click Physics | 4-card horizontal track; swiping/dragging (>6px move) suppresses anchor click navigation | M1 (Testing) / M3 (Interactivity) | R2 |
| 7 | Continuous 18s Logo Marquee | Uninterrupted 18s linear glide ticker without pause on hover | M1 (Testing) / M3 (Interactivity) | R2 |
| 8 | Process Orbit Sticky Scroll | 500svh sticky scroll with smooth 5-step progression, dynamic SVG arc/ticks, number translation | M1 (Testing) / M3 (Interactivity) | R2 |
| 9 | Dynamic Adaptive Nav Theme | Real-time luminance/collision detection toggling `.theme-light` across light sections | M1 (Testing) / M3 (Interactivity) | R2 |
| 10 | Dual DotReveal Glow Canvases | Mouse-following square dot glow in Hero and circular dot glow in Footer | M1 (Testing) / M3 (Interactivity) | R2 |
| 11 | Responsive Perfection (4 Viewports) | Zero horizontal overflow at 1920px, 1440px, 1024px, and 390px across all routes | M1 (Testing) / M4 (Responsive & Cleanliness) | R3 |
| 12 | Zero-Framer Cleanliness | 100% absence of Framer runtime scripts, telemetry, and visible badges | M1 (Testing) / M4 (Responsive & Cleanliness) | R3 |
| 13 | Zero Console Errors & Exceptions | 0 console errors, 0 font CORS blocks, 0 CSP framing violations, 0 uncaught exceptions | M1 (Testing) / M4 (Responsive & Cleanliness) | Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | E2E Test Suite Creation | Complete Playwright test suite (Tiers 1-4) covering all 29 routes, gestures, responsive layout, cleanliness, and publishing `TEST_READY.md` | Survey | PLANNED |
| M2 | Link & Route Defect Remediation | Fix link targets in `newsroom/index.html`, newsroom articles, relative paths, and mock card anchors | Survey | PLANNED |
| M3 | Cleanliness & Console Defect Remediation | Remove Chrome extension `@font-face` CORS URLs and Framer editor bar CSP scripts | Survey | PLANNED |
| M4 | Responsive Overflow Remediation | Fix mobile horizontal overflow (63px) on `/404` route at 390px viewport | Survey | PLANNED |
| M5 | Final E2E Test Verification & Hardening | Execute 100% E2E test suite, run adversarial challenger, and forensic integrity audit | M1, M2, M3, M4 | PLANNED |

## Interface Contracts
### Test Runner Interface
- Runner command: `node tests/run_all_tests.js` or `npx playwright test`
- Exit code 0 on all tests passing; non-zero on any failure
- Artifacts produced: `test-results/audit-report.json` and `test-results/AUDIT_REPORT.md`
