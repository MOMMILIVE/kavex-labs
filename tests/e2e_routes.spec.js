/**
 * Tier 1: Routes & Link Integrity E2E Test Suite
 * Validates that all 29 canonical static routes load with HTTP status 200
 * and executes a full link crawler across every page verifying 0 broken links and 0 404s.
 */

const { ALL_29_ROUTES } = require('./test_harness');

async function runRoutesTests({ browser, baseUrl, reporter }) {
  console.log('\n===============================================================');
  console.log('🏁 EXECUTING TIER 1: ROUTES & LINK INTEGRITY AUDIT');
  console.log('===============================================================');

  const tier = 'Tier 1: Routes & Link Integrity';
  const suite = 'e2e_routes.spec.js';
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  const baseOrigin = new URL(baseUrl).origin;

  // ---------------------------------------------------------------------------
  // Part 1: All 29 Static Routes HTTP 200 Verification
  // ---------------------------------------------------------------------------
  console.log('\n--- 1.1 Canonical 29 Static Routes HTTP Status Verification ---');

  for (const route of ALL_29_ROUTES) {
    const t0 = Date.now();
    const testName = `Route ${route} resolves with HTTP 200`;
    const targetUrl = `${baseUrl}${route}`;

    try {
      const response = await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const status = response ? response.status() : null;
      const duration = Date.now() - t0;

      const pageTitle = await page.title();
      const hasContent = await page.evaluate(() => document.body.innerText.length > 20);

      if (status === 200 || (route === '/404' && (status === 200 || status === 404))) {
        reporter.recordTest({
          tier,
          suite,
          name: testName,
          status: 'PASS',
          durationMs: duration,
          details: { status, pageTitle, length: hasContent ? 'OK' : 'EMPTY' }
        });
      } else {
        reporter.recordTest({
          tier,
          suite,
          name: testName,
          status: 'FAIL',
          durationMs: duration,
          error: `Expected HTTP 200 but received HTTP ${status} for route ${route}`,
          details: { status, route, pageTitle }
        });
      }
    } catch (err) {
      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'FAIL',
        durationMs: Date.now() - t0,
        error: err.message,
        details: { route, targetUrl }
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Part 2: Comprehensive Internal Link Graph Crawler Across All 29 Pages
  // ---------------------------------------------------------------------------
  console.log('\n--- 1.2 Full Site Anchor Link Graph Crawler ---');

  const crawledLinks = new Map(); // targetUrl -> { sourcePages: [], rawHrefs: Set, status: null }
  const brokenLinks = [];

  for (const sourceRoute of ALL_29_ROUTES) {
    const pageUrl = `${baseUrl}${sourceRoute}`;
    const t0 = Date.now();
    const testName = `Crawl internal links on route ${sourceRoute}`;

    try {
      await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });

      // Extract all anchor links on this page
      const pageLinks = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a[href]'));
        return anchors.map(a => ({
          rawHref: a.getAttribute('href'),
          resolvedHref: a.href,
          text: a.innerText ? a.innerText.trim().slice(0, 40) : ''
        }));
      });

      let internalOnPageCount = 0;

      for (const link of pageLinks) {
        const raw = (link.rawHref || '').trim();
        if (!raw || raw.startsWith('#') || raw.startsWith('javascript:') || raw.startsWith('mailto:') || raw.startsWith('tel:')) {
          continue;
        }

        // Check if internal origin
        let isInternal = false;
        try {
          const resolvedObj = new URL(link.resolvedHref);
          if (resolvedObj.origin === baseOrigin) {
            isInternal = true;
          }
        } catch (e) {
          isInternal = false;
        }

        if (!isInternal) {
          continue;
        }

        // Internal link
        internalOnPageCount++;
        const targetUrl = link.resolvedHref;

        if (!crawledLinks.has(targetUrl)) {
          crawledLinks.set(targetUrl, {
            rawHrefs: new Set([raw]),
            sourcePages: [sourceRoute],
            status: null,
            error: null
          });
        } else {
          const entry = crawledLinks.get(targetUrl);
          entry.rawHrefs.add(raw);
          if (!entry.sourcePages.includes(sourceRoute)) {
            entry.sourcePages.push(sourceRoute);
          }
        }
      }

      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'PASS',
        durationMs: Date.now() - t0,
        details: { totalAnchors: pageLinks.length, internalLinksChecked: internalOnPageCount, info: `${internalOnPageCount} internal links discovered` }
      });
    } catch (err) {
      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'FAIL',
        durationMs: Date.now() - t0,
        error: `Failed to crawl links on ${sourceRoute}: ${err.message}`,
        details: { sourceRoute }
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Part 3: Verify Resolution of All Discovered Unique Internal Target URLs
  // ---------------------------------------------------------------------------
  console.log(`\n--- 1.3 Validating ${crawledLinks.size} Unique Discovered Internal Target URLs ---`);

  for (const [targetUrl, info] of crawledLinks.entries()) {
    const t0 = Date.now();
    const urlObj = new URL(targetUrl);
    const testName = `Link target resolves 200: ${urlObj.pathname}`;

    try {
      const resp = await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const status = resp ? resp.status() : null;
      info.status = status;

      const duration = Date.now() - t0;

      // Check if status is 200 (or /404 valid resolution)
      if (status === 200) {
        reporter.recordTest({
          tier,
          suite,
          name: testName,
          status: 'PASS',
          durationMs: duration,
          details: {
            status,
            sourcesCount: info.sourcePages.length,
            sources: info.sourcePages.slice(0, 3).join(', ')
          }
        });
      } else {
        const errorMsg = `HTTP ${status} on target ${urlObj.pathname} (linked from ${info.sourcePages.join(', ')}; raw hrefs: ${Array.from(info.rawHrefs).join(', ')})`;
        info.error = errorMsg;
        brokenLinks.push({ targetUrl, status, sources: info.sourcePages, rawHrefs: Array.from(info.rawHrefs) });

        reporter.recordTest({
          tier,
          suite,
          name: testName,
          status: 'FAIL',
          durationMs: duration,
          error: errorMsg,
          details: { targetUrl, status, sources: info.sourcePages }
        });
      }
    } catch (err) {
      const errorMsg = `Navigation error to ${urlObj.pathname}: ${err.message} (linked from ${info.sourcePages.join(', ')})`;
      info.error = errorMsg;
      brokenLinks.push({ targetUrl, error: err.message, sources: info.sourcePages, rawHrefs: Array.from(info.rawHrefs) });

      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'FAIL',
        durationMs: Date.now() - t0,
        error: errorMsg,
        details: { targetUrl, sources: info.sourcePages }
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Part 4: Overall Zero-Broken-Links Assertion
  // ---------------------------------------------------------------------------
  const summaryTestName = `Zero broken internal links across all 29 routes (Found ${brokenLinks.length} broken)`;
  if (brokenLinks.length === 0) {
    reporter.recordTest({
      tier,
      suite,
      name: summaryTestName,
      status: 'PASS',
      durationMs: 0,
      details: { totalUniqueTargetUrls: crawledLinks.size, brokenCount: 0, info: 'All internal links resolve with status 200' }
    });
  } else {
    reporter.recordTest({
      tier,
      suite,
      name: summaryTestName,
      status: 'FAIL',
      durationMs: 0,
      error: `Detected ${brokenLinks.length} broken link destinations across the site`,
      details: { brokenLinks: brokenLinks.slice(0, 10) }
    });
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
      await runRoutesTests({ browser, baseUrl, reporter });
    } finally {
      await browser.close();
      await close();
      reporter.finish();
      reporter.generateMarkdownReport('test-results/AUDIT_REPORT_ROUTES.md');
    }
  })();
}

module.exports = { runRoutesTests };
