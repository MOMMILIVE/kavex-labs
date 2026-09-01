/**
 * Precept QA Audit — Test Harness & Reporting Framework
 * Provides test execution coordination, diagnostic interception,
 * matrix aggregation, JSON report generation, and Markdown scorecard generation.
 */

const fs = require('fs');
const path = require('path');

class TestReporter {
  constructor() {
    this.startTime = Date.now();
    this.endTime = null;
    this.results = [];
    this.tiers = {
      'Tier 1: Routes & Link Integrity': { total: 0, passed: 0, failed: 0, skipped: 0, items: [] },
      'Tier 2: Interactive Components & Gestures': { total: 0, passed: 0, failed: 0, skipped: 0, items: [] },
      'Tier 3: Responsive Layout Matrix': { total: 0, passed: 0, failed: 0, skipped: 0, items: [] },
      'Tier 4: Cleanliness & Zero Console Errors': { total: 0, passed: 0, failed: 0, skipped: 0, items: [] }
    };
    this.discoveredDefects = [];
  }

  recordTest({ tier, suite, name, status, durationMs, error = null, details = null }) {
    const record = {
      tier,
      suite,
      name,
      status, // 'PASS' | 'FAIL' | 'WARN' | 'SKIP'
      durationMs: Math.round(durationMs || 0),
      error: error ? (typeof error === 'string' ? error : error.message || String(error)) : null,
      details: details || {}
    };

    this.results.push(record);

    if (this.tiers[tier]) {
      this.tiers[tier].total++;
      if (status === 'PASS') this.tiers[tier].passed++;
      else if (status === 'FAIL') this.tiers[tier].failed++;
      else if (status === 'SKIP') this.tiers[tier].skipped++;
      this.tiers[tier].items.push(record);
    }

    if (status === 'FAIL') {
      this.discoveredDefects.push({
        tier,
        suite,
        name,
        error: record.error,
        details: record.details
      });
    }

    const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : status === 'WARN' ? '⚠️' : '⏭️';
    const durStr = `${record.durationMs}ms`.padStart(7);
    console.log(`  ${icon} [${status}] ${name} (${durStr})`);
    if (error) {
      console.log(`     └─ Error: ${record.error}`);
    }
  }

  finish() {
    this.endTime = Date.now();
  }

  getSummary() {
    let total = this.results.length;
    let passed = this.results.filter(r => r.status === 'PASS').length;
    let failed = this.results.filter(r => r.status === 'FAIL').length;
    let skipped = this.results.filter(r => r.status === 'SKIP').length;
    let totalDurationMs = (this.endTime || Date.now()) - this.startTime;

    return {
      total,
      passed,
      failed,
      skipped,
      passRate: total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0',
      totalDurationMs,
      tiers: this.tiers,
      defectsCount: this.discoveredDefects.length
    };
  }

  generateJsonReport(outputPath) {
    const summary = this.getSummary();
    const payload = {
      timestamp: new Date().toISOString(),
      summary,
      tiers: this.tiers,
      discoveredDefects: this.discoveredDefects,
      allResults: this.results
    };

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), 'utf8');
    return outputPath;
  }

  generateMarkdownReport(outputPath) {
    const summary = this.getSummary();
    const timestamp = new Date().toISOString();

    let md = `# Precept Native QA Audit Scorecard\n\n`;
    md += `**Execution Timestamp**: \`${timestamp}\`  \n`;
    md += `**Total Test Assertions**: **${summary.total}**  \n`;
    md += `**Passed**: **${summary.passed}** ✅  \n`;
    md += `**Failed**: **${summary.failed}** ❌  \n`;
    md += `**Skipped**: **${summary.skipped}** ⏭️  \n`;
    md += `**Pass Rate**: **${summary.passRate}%**  \n`;
    md += `**Total Execution Time**: **${(summary.totalDurationMs / 1000).toFixed(2)}s**  \n\n`;

    md += `---\n\n`;
    md += `## Tier Summary Breakdown\n\n`;
    md += `| Tier | Total | Passed | Failed | Skipped | Pass Rate |\n`;
    md += `| :--- | :---: | :---: | :---: | :---: | :---: |\n`;

    for (const [tierName, stats] of Object.entries(this.tiers)) {
      const rate = stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(1) + '%' : 'N/A';
      md += `| **${tierName}** | ${stats.total} | ${stats.passed} | ${stats.failed} | ${stats.skipped} | ${rate} |\n`;
    }

    md += `\n---\n\n`;
    md += `## Discovered Defects & Escalations (${this.discoveredDefects.length})\n\n`;

    if (this.discoveredDefects.length === 0) {
      md += `> 🎉 **Zero defects detected!** All routes, interactive components, responsive viewports, and cleanliness assertions passed 100%.\n\n`;
    } else {
      md += `| # | Tier | Test Name | Defect Summary |\n`;
      md += `| :--- | :--- | :--- | :--- |\n`;
      this.discoveredDefects.forEach((d, idx) => {
        const cleanErr = (d.error || 'Unknown failure').replace(/\|/g, '\\|').replace(/\n/g, ' ');
        md += `| ${idx + 1} | ${d.tier} | \`${d.name}\` | ${cleanErr} |\n`;
      });
      md += `\n`;
    }

    md += `---\n\n`;
    md += `## Detailed Test Results by Tier\n\n`;

    for (const [tierName, stats] of Object.entries(this.tiers)) {
      md += `### ${tierName} (${stats.passed}/${stats.total} Passed)\n\n`;
      md += `| Status | Test Description | Duration | Details |\n`;
      md += `| :---: | :--- | :---: | :--- |\n`;
      for (const item of stats.items) {
        const icon = item.status === 'PASS' ? '✅' : item.status === 'FAIL' ? '❌' : '⏭️';
        const detStr = item.error ? `⚠️ ${item.error}` : (item.details?.info || 'OK');
        md += `| ${icon} | ${item.name} | ${item.durationMs}ms | ${detStr.replace(/\|/g, '\\|')} |\n`;
      }
      md += `\n`;
    }

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, md, 'utf8');
    return outputPath;
  }
}

const VIEWPORTS = {
  Desktop: { width: 1920, height: 1080, name: '1920px Desktop' },
  Laptop:  { width: 1440, height: 900,  name: '1440px Laptop' },
  Tablet:  { width: 1024, height: 768,  name: '1024px Tablet' },
  Mobile:  { width: 390,  height: 844,  name: '390px Mobile' }
};

const ALL_29_ROUTES = [
  '/',
  '/about',
  '/capabilities',
  '/capabilities/automated-inspection',
  '/capabilities/precision-machining',
  '/capabilities/robotic-assembly',
  '/capabilities/system-integration',
  '/newsroom',
  '/newsroom/filters/all',
  '/newsroom/aerix-every-part-inspection',
  '/newsroom/automation-should-fit-your-line',
  '/newsroom/axlon-two-platforms-one-line',
  '/newsroom/cargon-automated-floor-peak',
  '/careers',
  '/careers/automation-integration-engineer',
  '/careers/cnc-machinist',
  '/careers/controls-engineer',
  '/careers/field-service-engineer',
  '/careers/machine-vision-engineer',
  '/careers/manufacturing-engineer',
  '/careers/mechanical-design-engineer',
  '/careers/quality-engineer',
  '/careers/robotics-engineer',
  '/careers/robotics-software-engineer',
  '/careers/solutions-engineer',
  '/careers/technical-writer',
  '/contact',
  '/privacy',
  '/404'
];

module.exports = {
  TestReporter,
  VIEWPORTS,
  ALL_29_ROUTES
};
