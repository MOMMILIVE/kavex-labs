#!/usr/bin/env node

/**
 * Precept QA Audit — Unified E2E Test Runner
 * Executes Tier 1 (Routes & Links), Tier 2 (Interactive & Gestures),
 * Tier 3 (Responsive Matrix), and Tier 4 (Cleanliness & Zero Console Errors).
 * Generates audit-report.json and AUDIT_REPORT.md.
 */

const path = require('path');
const { chromium } = require('playwright');
const { startServer } = require('./server');
const { TestReporter } = require('./test_harness');
const { runRoutesTests } = require('./e2e_routes.spec');
const { runInteractiveTests } = require('./e2e_interactive.spec');
const { runResponsiveTests } = require('./e2e_responsive.spec');
const { runCleanlinessTests } = require('./e2e_cleanliness.spec');

async function main() {
  console.log('╔═════════════════════════════════════════════════════════════╗');
  console.log('║        PRECEPT NATIVE — COMPLETE E2E QA AUDIT SUITE         ║');
  console.log('║         Zero Framer Runtime • 29 Routes • 4 Viewports       ║');
  console.log('╚═════════════════════════════════════════════════════════════╝\n');

  const args = process.argv.slice(2);
  const tierArg = args.find(a => a.startsWith('--tier='))?.split('=')[1];

  const reporter = new TestReporter();
  const rootDir = path.resolve(__dirname, '..');
  const projectPort = process.env.TEST_PORT ? parseInt(process.env.TEST_PORT, 10) : 0;

  console.log(`Starting local static test server from: ${rootDir}`);
  const { baseUrl, port, close: closeServer } = await startServer(projectPort, rootDir);
  console.log(`Static server active at: ${baseUrl} (port ${port})\n`);

  console.log('Launching headless Playwright Chromium browser...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  console.log('Chromium browser launched successfully.\n');

  try {
    if (!tierArg || tierArg === '1') {
      await runRoutesTests({ browser, baseUrl, reporter });
    }
    if (!tierArg || tierArg === '2') {
      await runInteractiveTests({ browser, baseUrl, reporter });
    }
    if (!tierArg || tierArg === '3') {
      await runResponsiveTests({ browser, baseUrl, reporter });
    }
    if (!tierArg || tierArg === '4') {
      await runCleanlinessTests({ browser, baseUrl, reporter });
    }
  } catch (fatalError) {
    console.error('\n❌ FATAL EXECUTION ERROR:', fatalError);
  } finally {
    console.log('\nClosing browser and test server...');
    await browser.close();
    await closeServer();
    reporter.finish();
  }

  // Generate Reports
  const jsonReportPath = path.resolve(rootDir, 'test-results', 'audit-report.json');
  const mdReportPath = path.resolve(rootDir, 'test-results', 'AUDIT_REPORT.md');

  reporter.generateJsonReport(jsonReportPath);
  reporter.generateMarkdownReport(mdReportPath);

  const summary = reporter.getSummary();

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('📊 AUDIT EXECUTION SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Total Tests Run : ${summary.total}`);
  console.log(`  Passed          : ${summary.passed} ✅`);
  console.log(`  Failed          : ${summary.failed} ❌`);
  console.log(`  Skipped         : ${summary.skipped} ⏭️`);
  console.log(`  Pass Rate       : ${summary.passRate}%`);
  console.log(`  Execution Time  : ${(summary.totalDurationMs / 1000).toFixed(2)}s`);
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`  JSON Report     : ${jsonReportPath}`);
  console.log(`  Markdown Report : ${mdReportPath}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (summary.failed > 0) {
    console.log(`⚠️  ${summary.failed} tests failed during audit.`);
    // Exit with code 1 on failure
    process.exit(1);
  } else {
    console.log('🎉 All QA audit tests passed successfully!');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Unhandled runner exception:', err);
  process.exit(1);
});
