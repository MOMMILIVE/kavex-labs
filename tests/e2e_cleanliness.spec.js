/**
 * Tier 4: Cleanliness & Zero Console Errors E2E Test Suite
 * Validates zero console errors, zero uncaught exceptions, zero CORS/CSP violations,
 * zero Framer runtime scripts/telemetry calls, and zero visible Buy Template badges across all 29 routes.
 */

const { ALL_29_ROUTES } = require('./test_harness');

async function runCleanlinessTests({ browser, baseUrl, reporter }) {
  console.log('\n===============================================================');
  console.log('🏁 EXECUTING TIER 4: CLEANLINESS & ZERO CONSOLE ERRORS AUDIT');
  console.log('===============================================================');

  const tier = 'Tier 4: Cleanliness & Zero Console Errors';
  const suite = 'e2e_cleanliness.spec.js';

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  for (const route of ALL_29_ROUTES) {
    const t0 = Date.now();
    const testName = `Cleanliness & Zero Console Errors on ${route}`;
    const page = await context.newPage();

    const consoleErrors = [];
    const consoleWarnings = [];
    const uncaughtExceptions = [];
    const framerNetworkRequests = [];

    // Intercept console messages
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        consoleErrors.push(text);
      } else if (type === 'warning') {
        consoleWarnings.push(text);
      }
    });

    // Intercept uncaught page errors
    page.on('pageerror', (err) => {
      uncaughtExceptions.push(err.message || String(err));
    });

    // Intercept outgoing network requests for Framer telemetry
    page.on('request', (req) => {
      const reqUrl = req.url();
      if (reqUrl.includes('events.framer.com') || reqUrl.includes('framer.com/events') || reqUrl.includes('api.framer.com')) {
        framerNetworkRequests.push(reqUrl);
      }
    });

    try {
      await page.goto(`${baseUrl}${route}`, { waitUntil: 'load', timeout: 15000 });
      await page.waitForTimeout(200);

      // 1. Check DOM for residual Framer scripts
      const framerScriptFindings = await page.evaluate(() => {
        const findings = [];
        const scripts = Array.from(document.querySelectorAll('script'));
        for (const s of scripts) {
          const src = s.getAttribute('src') || '';
          const text = s.textContent || '';

          if (src.includes('framer.com') || src.includes('framerusercontent.com/sites/')) {
            findings.push(`External Framer script: ${src}`);
          }
          if (text.includes('__framer_force_showing_editorbar_since') || text.includes('https://framer.com/edit/init.mjs')) {
            findings.push('Residual Framer editorbar script tag');
          }
          if (text.includes('__framer__handoverData')) {
            findings.push('Residual Framer handoverData script tag');
          }
        }
        return findings;
      });

      // 2. Check for visible Buy Template badges or Polar.sh links
      const visibleBadges = await page.evaluate(() => {
        const selectors = [
          '.framer-w4mlp8',
          '[data-framer-name="Buy Template Module"]',
          'a[href*="polar.sh"]',
          '#__framer-badge-container'
        ];
        const visible = [];
        for (const sel of selectors) {
          const elements = document.querySelectorAll(sel);
          for (const el of elements) {
            const style = window.getComputedStyle(el);
            const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && (el.offsetWidth > 0 || el.offsetHeight > 0);
            if (isVisible) {
              visible.push({ selector: sel, text: el.innerText || '' });
            }
          }
        }
        return visible;
      });

      const duration = Date.now() - t0;

      // Classify failures
      const failures = [];

      if (consoleErrors.length > 0) {
        failures.push(`Console Errors (${consoleErrors.length}): ${consoleErrors.join(' | ')}`);
      }
      if (uncaughtExceptions.length > 0) {
        failures.push(`Uncaught Exceptions (${uncaughtExceptions.length}): ${uncaughtExceptions.join(' | ')}`);
      }
      if (framerNetworkRequests.length > 0) {
        failures.push(`Framer Telemetry Requests (${framerNetworkRequests.length}): ${framerNetworkRequests.join(', ')}`);
      }
      if (framerScriptFindings.length > 0) {
        failures.push(`Residual Framer Scripts (${framerScriptFindings.length}): ${framerScriptFindings.join(', ')}`);
      }
      if (visibleBadges.length > 0) {
        failures.push(`Visible Buy Template Badges (${visibleBadges.length}): ${JSON.stringify(visibleBadges)}`);
      }

      if (failures.length === 0) {
        reporter.recordTest({
          tier,
          suite,
          name: testName,
          status: 'PASS',
          durationMs: duration,
          details: {
            consoleErrorsCount: 0,
            uncaughtExceptionsCount: 0,
            framerTelemetryCount: 0,
            framerScriptsCount: 0,
            visibleBadgesCount: 0
          }
        });
      } else {
        reporter.recordTest({
          tier,
          suite,
          name: testName,
          status: 'FAIL',
          durationMs: duration,
          error: failures.join(' -- '),
          details: {
            route,
            consoleErrors,
            uncaughtExceptions,
            framerNetworkRequests,
            framerScriptFindings,
            visibleBadges
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
        error: `Page load error on ${route}: ${err.message}`,
        details: { route }
      });
    } finally {
      await page.close();
    }
  }

  await context.close();
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
      await runCleanlinessTests({ browser, baseUrl, reporter });
    } finally {
      await browser.close();
      await close();
      reporter.finish();
      reporter.generateMarkdownReport('test-results/AUDIT_REPORT_CLEANLINESS.md');
    }
  })();
}

module.exports = { runCleanlinessTests };
