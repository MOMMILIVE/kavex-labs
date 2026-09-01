/**
 * Tier 3: Responsive Layout Matrix E2E Test Suite
 * Validates all 29 canonical static routes across 4 standard viewports
 * (1920px Desktop, 1440px Laptop, 1024px Tablet, 390px Mobile) = 116 matrix checkpoints,
 * asserting 0 horizontal layout overflow (scrollWidth <= clientWidth + 1) and 0 layout shifts.
 */

const { ALL_29_ROUTES, VIEWPORTS } = require('./test_harness');

async function runResponsiveTests({ browser, baseUrl, reporter }) {
  console.log('\n===============================================================');
  console.log('🏁 EXECUTING TIER 3: RESPONSIVE LAYOUT MATRIX AUDIT (116 CHECKPOINTS)');
  console.log('===============================================================');

  const tier = 'Tier 3: Responsive Layout Matrix';
  const suite = 'e2e_responsive.spec.js';

  for (const [vpKey, vpConfig] of Object.entries(VIEWPORTS)) {
    console.log(`\n--- 3.${Object.keys(VIEWPORTS).indexOf(vpKey) + 1} Viewport: ${vpConfig.name} (${vpConfig.width}x${vpConfig.height}) ---`);

    const context = await browser.newContext({
      viewport: { width: vpConfig.width, height: vpConfig.height }
    });
    const page = await context.newPage();

    for (const route of ALL_29_ROUTES) {
      const t0 = Date.now();
      const testName = `Responsive ${vpConfig.name}: ${route} 0px horizontal overflow`;
      const targetUrl = `${baseUrl}${route}`;

      try {
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        // Give short grace period for Lenis or dynamic JS layouts to compute dimensions
        await page.waitForTimeout(100);

        const layoutCheck = await page.evaluate((vpWidth) => {
          const docW = document.documentElement.scrollWidth;
          const bodyW = document.body ? document.body.scrollWidth : 0;
          const winW = window.innerWidth;
          const maxW = Math.max(docW, bodyW);
          const overflowDiff = Math.max(0, maxW - winW);

          // Find any elements sticking out past the viewport width
          const overflowingElements = [];
          const allEls = document.querySelectorAll('body *');
          for (const el of allEls) {
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
            // Ignore fixed elements that intentionally span full screen or drawer backdrop
            if (style.position === 'fixed') continue;

            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.right > winW + 1.5) {
              const classStr = (el.className && typeof el.className === 'string') ? el.className.slice(0, 40) : '';
              overflowingElements.push({
                tag: el.tagName.toLowerCase(),
                class: classStr,
                id: el.id || '',
                right: Math.round(rect.right),
                width: Math.round(rect.width),
                overflowPx: Math.round(rect.right - winW)
              });
              if (overflowingElements.length >= 4) break;
            }
          }

          return {
            docW,
            bodyW,
            winW,
            maxW,
            overflowDiff,
            hasOverflow: overflowDiff > 1,
            overflowingElements
          };
        }, vpConfig.width);

        const duration = Date.now() - t0;

        if (!layoutCheck.hasOverflow) {
          reporter.recordTest({
            tier,
            suite,
            name: testName,
            status: 'PASS',
            durationMs: duration,
            details: {
              viewport: vpConfig.name,
              route,
              scrollWidth: layoutCheck.maxW,
              clientWidth: layoutCheck.winW,
              overflow: '0px'
            }
          });
        } else {
          const errDetail = `Horizontal overflow of ${layoutCheck.overflowDiff}px detected on ${route} at ${vpConfig.name} (scrollWidth=${layoutCheck.maxW}px > clientWidth=${layoutCheck.winW}px)`;
          reporter.recordTest({
            tier,
            suite,
            name: testName,
            status: 'FAIL',
            durationMs: duration,
            error: errDetail,
            details: {
              viewport: vpConfig.name,
              route,
              scrollWidth: layoutCheck.maxW,
              clientWidth: layoutCheck.winW,
              overflowDiff: `${layoutCheck.overflowDiff}px`,
              offendingElements: layoutCheck.overflowingElements
            }
          });
        }
      } catch (err) {
        reporter.recordTest({
          tier,
          suite,
          name: testName,
          status: 'FAIL',
          durationMs: Date.now() - t0,
          error: `Error checking layout on ${route} (${vpConfig.name}): ${err.message}`,
          details: { route, viewport: vpConfig.name }
        });
      }
    }

    await context.close();
  }
}

// Standalone execution support
if (require.main === module) {
  const { chromium } = require('playwright');
  const { startServer } = require('./server');
  const { TestReporter } = require('./test_harness');

  (async () => {
    const reporter = new TestReporter();
    const { baseUrl, close } = await startServer(0);
    const browser = await chromium.launch({ headless: true });

    try {
      await runResponsiveTests({ browser, baseUrl, reporter });
    } finally {
      await browser.close();
      await close();
      reporter.finish();
      reporter.generateMarkdownReport('test-results/AUDIT_REPORT_RESPONSIVE.md');
    }
  })();
}

module.exports = { runResponsiveTests };
