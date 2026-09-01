# E2E Test Infra: Precept QA Audit Suite

## Test Philosophy
- Opaque-box, requirement-driven automated verification.
- Methodology: Category-Partition + Boundary Value Analysis + Gesture Physics Verification + Responsive Matrix Testing.

## Feature Inventory
| # | Feature | Source (Requirement) | Tier 1 (Routes) | Tier 2 (Gestures) | Tier 3 (Responsive) | Tier 4 (Cleanliness & Errors) |
|---|---------|----------------------|:---------------:|:-----------------:|:-------------------:|:-----------------------------:|
| 1 | 29 Static Routes & HTTP Status | ORIGINAL_REQUEST §R1 | 29 tests | - | - | - |
| 2 | Zero Broken Internal Links | ORIGINAL_REQUEST §R1 | 29 link crawls | - | - | - |
| 3 | Navigation Drawer & Blur | ORIGINAL_REQUEST §R2 | - | 5 tests | 4 viewports | - |
| 4 | Capable Industries Drag Carousel | ORIGINAL_REQUEST §R2 | - | 5 tests | - | - |
| 5 | Testimonials 4-Quote Cycling | ORIGINAL_REQUEST §R2 | - | 5 tests | - | - |
| 6 | Newsroom Drag-vs-Click Suppression | ORIGINAL_REQUEST §R2 | - | 5 tests | - | - |
| 7 | Continuous 18s Logo Marquee | ORIGINAL_REQUEST §R2 | - | 3 tests | - | - |
| 8 | Process Orbit Sticky Scroll 500svh | ORIGINAL_REQUEST §R2 | - | 5 tests | - | - |
| 9 | Dynamic Adaptive Nav Theme | ORIGINAL_REQUEST §R2 | - | 5 tests | - | - |
| 10 | Dual DotReveal Canvases | ORIGINAL_REQUEST §R2 | - | 4 tests | - | - |
| 11 | Responsive Layouts (1920/1440/1024/390) | ORIGINAL_REQUEST §R3 | - | - | 116 matrix checks | - |
| 12 | Zero-Framer Cleanliness & Badges | ORIGINAL_REQUEST §R3 | - | - | - | 29 route scans |
| 13 | Zero Console Errors & Exceptions | ORIGINAL_REQUEST Acceptance | - | - | - | 116 matrix logs |

## Test Architecture
- **Test Runner**: Node.js in-process test runner using Playwright Chromium headless engine (`tests/run_all_tests.js`).
- **Test Suites**:
  - `tests/e2e_routes.spec.js`: 29 route availability + full internal link graph crawler.
  - `tests/e2e_interactive.spec.js`: Gestures, carousels, drag suppression, sticky scroll, luminance theme toggling, canvases, marquee.
  - `tests/e2e_responsive.spec.js`: 116-point matrix overflow check across 1920px, 1440px, 1024px, and 390px viewports.
  - `tests/e2e_cleanliness.spec.js`: Console error zero-tolerance, Framer script detection, CORS/CSP violation scanner.
- **Reporting & Artifacts**:
  - `test-results/audit-report.json`: Full JSON test log.
  - `test-results/AUDIT_REPORT.md`: Formatted Markdown audit scorecard.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Full Site Traversal & Route Navigation | All 29 routes, Nav Drawer links, Footer links, Breadcrumbs | High |
| 2 | Interactive Homepage User Flow | Hero Canvas, Marquee, Capable Industries drag, Process Orbit scroll, Theme Inversion, Testimonials, Footer Canvas | High |
| 3 | Newsroom Swipe vs Article Reading | Newsroom filter, carousel swipe, article click vs drag suppression | Medium |
| 4 | Mobile Viewport Experience (390px) | Drawer toggle, touch scroll, 404 page rendering, job application route navigation | High |

## Acceptance Criteria
- [ ] 100% of routes pass with HTTP 200 and zero broken links.
- [ ] 100% of interactive components behave according to specifications.
- [ ] 0px horizontal overflow across all 116 route × viewport combinations.
- [ ] 0 console errors and 0 uncaught exceptions across all pages.
- [ ] Detailed JSON and Markdown audit reports generated.
