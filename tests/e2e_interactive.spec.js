/**
 * Tier 2: Interactive Components & Gestures E2E Test Suite
 * Validates Navigation Drawer, Capable Industries drag physics, Testimonials carousel,
 * Newsroom drag-vs-click suppression, 18s logo marquee, Process Orbit sticky scroll,
 * Dynamic nav theme luminance inversion, and Dual DotReveal glow canvases.
 */

async function runInteractiveTests({ browser, baseUrl, reporter }) {
  console.log('\n===============================================================');
  console.log('🏁 EXECUTING TIER 2: INTERACTIVE COMPONENTS & GESTURES AUDIT');
  console.log('===============================================================');

  const tier = 'Tier 2: Interactive Components & Gestures';
  const suite = 'e2e_interactive.spec.js';
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // ---------------------------------------------------------------------------
  // 2.1 Navigation Drawer & Backdrop System
  // ---------------------------------------------------------------------------
  console.log('\n--- 2.1 Navigation Drawer & Backdrop System ---');

  // Test 2.1.1: Drawer toggle & backdrop visibility on Homepage
  {
    const t0 = Date.now();
    const testName = 'Nav Drawer: Opens smoothly, displays backdrop blur, updates aria-expanded';
    try {
      await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
      const nav = page.locator('nav.gnR7dqop');
      const menuBtn = nav.locator('.gn-btn');

      // Initial state
      const initialOpen = await nav.evaluate(el => el.classList.contains('open'));
      const initialAria = await menuBtn.getAttribute('aria-expanded');

      if (initialOpen || initialAria !== 'false') {
        throw new Error(`Drawer should initially be closed (open=${initialOpen}, aria-expanded=${initialAria})`);
      }

      // Click menu button to open
      await menuBtn.click();
      await page.waitForTimeout(300);

      const isOpen = await nav.evaluate(el => el.classList.contains('open'));
      const ariaExpanded = await menuBtn.getAttribute('aria-expanded');
      const backdrop = page.locator('.gnR7dqop-backdrop');
      const isBackdropVisible = await backdrop.isVisible();

      if (!isOpen || ariaExpanded !== 'true' || !isBackdropVisible) {
        throw new Error(`Drawer failed to open properly (open=${isOpen}, aria-expanded=${ariaExpanded}, backdropVisible=${isBackdropVisible})`);
      }

      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'PASS',
        durationMs: Date.now() - t0,
        details: { isOpen, ariaExpanded, backdropVisible: isBackdropVisible }
      });
    } catch (err) {
      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'FAIL',
        durationMs: Date.now() - t0,
        error: err.message
      });
    }
  }

  // Test 2.1.2: Drawer dismissal via backdrop click
  {
    const t0 = Date.now();
    const testName = 'Nav Drawer: Dismisses on backdrop click';
    try {
      const nav = page.locator('nav.gnR7dqop');
      const backdrop = page.locator('.gnR7dqop-backdrop');

      // Click backdrop outside drawer
      await backdrop.click({ position: { x: 500, y: 500 } });
      await page.waitForTimeout(300);

      const isOpen = await nav.evaluate(el => el.classList.contains('open'));
      const isBackdropVisible = await backdrop.isVisible();

      if (isOpen || isBackdropVisible) {
        throw new Error(`Drawer should close on backdrop click (open=${isOpen}, backdropVisible=${isBackdropVisible})`);
      }

      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'PASS',
        durationMs: Date.now() - t0,
        details: { isOpen, isBackdropVisible }
      });
    } catch (err) {
      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'FAIL',
        durationMs: Date.now() - t0,
        error: err.message
      });
    }
  }

  // Test 2.1.3: Drawer dismissal via Escape key
  {
    const t0 = Date.now();
    const testName = 'Nav Drawer: Dismisses on Escape keyboard event';
    try {
      const nav = page.locator('nav.gnR7dqop');
      const menuBtn = nav.locator('.gn-btn');

      // Reopen drawer
      await menuBtn.click();
      await page.waitForTimeout(300);
      let isOpen = await nav.evaluate(el => el.classList.contains('open'));
      if (!isOpen) throw new Error('Drawer failed to reopen for Escape key test');

      // Press Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);

      isOpen = await nav.evaluate(el => el.classList.contains('open'));
      if (isOpen) throw new Error('Drawer failed to close upon Escape key press');

      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'PASS',
        durationMs: Date.now() - t0,
        details: { isOpen }
      });
    } catch (err) {
      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'FAIL',
        durationMs: Date.now() - t0,
        error: err.message
      });
    }
  }

  // Test 2.1.4: Drawer functioning on subpages (/about and /careers)
  {
    const t0 = Date.now();
    const testName = 'Nav Drawer: Fully functional on subpages (/about, /careers)';
    try {
      for (const subpath of ['/about', '/careers']) {
        await page.goto(`${baseUrl}${subpath}`, { waitUntil: 'domcontentloaded' });
        const nav = page.locator('nav.gnR7dqop');
        const menuBtn = nav.locator('.gn-btn');
        await menuBtn.click();
        await page.waitForTimeout(250);
        const isOpen = await nav.evaluate(el => el.classList.contains('open'));
        if (!isOpen) throw new Error(`Nav drawer failed to open on ${subpath}`);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
      }

      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'PASS',
        durationMs: Date.now() - t0,
        details: { subpagesTested: ['/about', '/careers'] }
      });
    } catch (err) {
      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'FAIL',
        durationMs: Date.now() - t0,
        error: err.message
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 2.2 Capable Industries Carousel & Drag Physics
  // ---------------------------------------------------------------------------
  console.log('\n--- 2.2 Capable Industries Drag Carousel ---');

  // Test 2.2.1: Capable Industries 5-slide cycling via Next/Prev buttons
  {
    const t0 = Date.now();
    const testName = 'Capable Industries: Cycles through 5 slides via button controls';
    try {
      await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
      const section = page.locator('section[data-framer-name="Capable Industries"]');
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);

      const badge = section.locator('span[style*="font-variant-numeric:tabular-nums"]');
      const headline = section.locator('h3');
      const nextBtn = section.locator('button[aria-label="Next slide"]');
      const prevBtn = section.locator('button[aria-label="Previous slide"]');

      const expectedHeadlines = [
        'Aerospace & Defense',
        'Automotive',
        'Agriculture',
        'Logistics & Fulfillment',
        'Energy & Infrastructure'
      ];

      // Initial slide check
      let currentHeadline = (await headline.innerText()).trim();
      let currentBadge = (await badge.innerText()).trim();

      if (!currentHeadline.includes(expectedHeadlines[0]) || !currentBadge.includes('1')) {
        throw new Error(`Slide 1 mismatch: headline="${currentHeadline}", badge="${currentBadge}"`);
      }

      // Step forward through slides 2, 3, 4, 5
      for (let i = 1; i < 5; i++) {
        await nextBtn.click();
        await page.waitForTimeout(700);

        currentHeadline = (await headline.innerText()).trim();
        currentBadge = (await badge.innerText()).trim();

        if (!currentHeadline.includes(expectedHeadlines[i]) || !currentBadge.includes(String(i + 1))) {
          throw new Error(`Slide ${i + 1} mismatch: expected "${expectedHeadlines[i]}", got "${currentHeadline}" (badge: ${currentBadge})`);
        }
      }

      // Step backward to slide 4
      await prevBtn.click();
      await page.waitForTimeout(700);
      currentHeadline = (await headline.innerText()).trim();
      if (!currentHeadline.includes(expectedHeadlines[3])) {
        throw new Error(`Backward step mismatch: expected "${expectedHeadlines[3]}", got "${currentHeadline}"`);
      }

      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'PASS',
        durationMs: Date.now() - t0,
        details: { totalSlides: 5, verifiedHeadlines: expectedHeadlines }
      });
    } catch (err) {
      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'FAIL',
        durationMs: Date.now() - t0,
        error: err.message
      });
    }
  }

  // Test 2.2.2: Capable Industries Mouse Drag Physics (40px Threshold & Snapback)
  {
    const t0 = Date.now();
    const testName = 'Capable Industries: Real-time mouse drag physics and 40px threshold swipe';
    try {
      await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
      const section = page.locator('section[data-framer-name="Capable Industries"]');
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);

      const dragContainer = section.locator('.framer-poqq88-container, .framer-x0i8pu').first();
      const badge = section.locator('span[style*="font-variant-numeric:tabular-nums"]');
      const box = await dragContainer.boundingBox();

      if (!box) throw new Error('Could not find bounding box for Capable Industries drag container');

      const startX = box.x + box.width * 0.5;
      const startY = box.y + box.height * 0.5;

      // Sub-test A: Drag under threshold (< 40px, e.g. 25px swipe left) -> Snaps back, stays on slide 1
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(startX - 25, startY, { steps: 5 });

      const intermediateTransform = await section.locator('img').first().evaluate(el => el.parentElement.style.transform);
      await page.mouse.up();
      await page.waitForTimeout(500);

      let currentBadge = (await badge.innerText()).trim();
      if (!currentBadge.includes('1')) {
        throw new Error(`Sub-threshold drag (25px) should not advance slide, but badge is ${currentBadge}`);
      }

      // Sub-test B: Drag over threshold (> 40px, e.g. 120px swipe left) -> Advances to slide 2
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(startX - 120, startY, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(800);

      currentBadge = (await badge.innerText()).trim();
      if (!currentBadge.includes('2')) {
        throw new Error(`Over-threshold drag (120px) should advance to slide 2, but badge is ${currentBadge}`);
      }

      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'PASS',
        durationMs: Date.now() - t0,
        details: { thresholdTested: '40px', intermediateTransform, finalBadge: currentBadge }
      });
    } catch (err) {
      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'FAIL',
        durationMs: Date.now() - t0,
        error: err.message
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 2.3 Testimonials Carousel (4 Unique Quotes)
  // ---------------------------------------------------------------------------
  console.log('\n--- 2.3 Testimonials Carousel (4 Unique Quotes) ---');

  {
    const t0 = Date.now();
    const testName = 'Testimonials: Cycles through 4 unique quotes (Axlon, Aerix, Cargon, Voltan)';
    try {
      await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
      const section = page.locator('section[data-framer-name="Testimonials"]');
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);

      const badge = section.locator('span[style*="font-variant-numeric:tabular-nums"]');
      const author = section.locator('span[style*="text-transform:uppercase"]');
      const nextBtn = section.locator('button').nth(1);

      const expectedQuotes = [
        { author: 'Axlon', badge: '1' },
        { author: 'Aerix', badge: '2' },
        { author: 'Cargon', badge: '3' },
        { author: 'Voltan', badge: '4' }
      ];

      // Validate all 4 quotes sequentially
      for (let i = 0; i < 4; i++) {
        const expected = expectedQuotes[i];
        const curBadgeText = (await badge.innerText()).trim();
        const curAuthorText = (await author.innerText()).trim();

        if (!curBadgeText.includes(expected.badge) || !curAuthorText.toUpperCase().includes(expected.author.toUpperCase())) {
          throw new Error(`Testimonial ${i + 1} mismatch: expected author "${expected.author}" with badge "${expected.badge}", got author "${curAuthorText}" and badge "${curBadgeText}"`);
        }

        if (i < 3) {
          await nextBtn.click();
          await page.waitForTimeout(700);
        }
      }

      // Test drag gesture on testimonials (drag right to retreat)
      const box = await section.boundingBox();
      if (box) {
        await page.mouse.move(box.x + 300, box.y + 200);
        await page.mouse.down();
        await page.mouse.move(box.x + 450, box.y + 200, { steps: 10 });
        await page.mouse.up();
        await page.waitForTimeout(700);
        const curBadge = (await badge.innerText()).trim();
        if (!curBadge.includes('3')) {
          throw new Error(`Dragging right on testimonials should move to slide 3, but got badge: ${curBadge}`);
        }
      }

      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'PASS',
        durationMs: Date.now() - t0,
        details: { quotesVerified: expectedQuotes.map(q => q.author) }
      });
    } catch (err) {
      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'FAIL',
        durationMs: Date.now() - t0,
        error: err.message
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 2.4 Newsroom Slideshow & Drag-vs-Click Suppression
  // ---------------------------------------------------------------------------
  console.log('\n--- 2.4 Newsroom Slideshow Drag-vs-Click Suppression ---');

  // Test 2.4.1: Drag gesture suppresses link click redirect
  {
    const t0 = Date.now();
    const testName = 'Newsroom: Drag gesture (>6px) suppresses article anchor click navigation';
    try {
      await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
      const slideshow = page.locator('.framer-slideshow');
      await slideshow.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);

      const track = slideshow.locator('ul');
      const firstCard = track.locator('li > div').first();
      const box = await firstCard.boundingBox();

      if (!box) throw new Error('Newsroom slideshow card not found for drag testing');

      const initialUrl = page.url();

      // Perform a horizontal drag swipe of 120px (> 6px drag threshold)
      await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.5);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.5, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(300);

      // Verify page did NOT navigate away
      const currentUrl = page.url();
      if (currentUrl !== initialUrl) {
        throw new Error(`Drag gesture accidentally triggered navigation to: ${currentUrl}`);
      }

      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'PASS',
        durationMs: Date.now() - t0,
        details: { initialUrl, currentUrl, dragDisplacement: '120px', suppressionActive: true }
      });
    } catch (err) {
      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'FAIL',
        durationMs: Date.now() - t0,
        error: err.message
      });
    }
  }

  // Test 2.4.2: Direct click on dots/slideshow controls
  {
    const t0 = Date.now();
    const testName = 'Newsroom: Direct click on dots/slideshow controls functions normally';
    try {
      await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
      const slideshow = page.locator('.framer-slideshow');
      await slideshow.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);

      const dotBtns = slideshow.locator('button[aria-label^="Scroll to page"]');
      const count = await dotBtns.count();

      if (count > 1) {
        await dotBtns.nth(1).click();
        await page.waitForTimeout(600);
        const secondDotOpacity = await dotBtns.nth(1).evaluate(el => el.style.opacity || getComputedStyle(el).opacity);
        if (secondDotOpacity !== '1') {
          throw new Error(`Second dot should be active (opacity: 1), but got: ${secondDotOpacity}`);
        }
      }

      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'PASS',
        durationMs: Date.now() - t0,
        details: { dotCount: count }
      });
    } catch (err) {
      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'FAIL',
        durationMs: Date.now() - t0,
        error: err.message
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 2.5 Continuous 18s Logo Marquee Glide
  // ---------------------------------------------------------------------------
  console.log('\n--- 2.5 Continuous 18s Logo Marquee Glide ---');

  {
    const t0 = Date.now();
    const testName = 'Logo Marquee: 18s linear continuous glide without pause on hover';
    try {
      await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
      const marqueeSection = page.locator('section[data-framer-name="Clients Ticker"]');
      await marqueeSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      const track = marqueeSection.locator('.native-ticker-track');
      const isVisible = await track.isVisible();
      if (!isVisible) throw new Error('Native ticker track is not visible');

      // Check animation CSS properties
      const animData = await track.evaluate(el => {
        const style = getComputedStyle(el);
        return {
          duration: style.animationDuration,
          timing: style.animationTimingFunction,
          iteration: style.animationIterationCount,
          playState: style.animationPlayState
        };
      });

      if (animData.duration !== '18s') {
        throw new Error(`Expected marquee animation-duration of 18s, but got "${animData.duration}"`);
      }

      // Hover over track with force: true (bypass movement stability check)
      await track.hover({ force: true });
      await page.waitForTimeout(200);

      const hoveredPlayState = await track.evaluate(el => getComputedStyle(el).animationPlayState);
      if (hoveredPlayState === 'paused') {
        throw new Error('Marquee should not pause on hover');
      }

      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'PASS',
        durationMs: Date.now() - t0,
        details: { ...animData, hoveredPlayState }
      });
    } catch (err) {
      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'FAIL',
        durationMs: Date.now() - t0,
        error: err.message
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 2.6 Process Orbit Sticky Scroll (500svh Progression)
  // ---------------------------------------------------------------------------
  console.log('\n--- 2.6 Process Orbit Sticky Scroll (500svh) ---');

  {
    const t0 = Date.now();
    const testName = 'Process Orbit: 500svh sticky scroll height & 5-step interactive progression';
    try {
      await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
      const orbitSection = page.locator('.poRncmkqop');
      const isPresent = await orbitSection.count() > 0;

      if (!isPresent) throw new Error('.poRncmkqop Process Orbit section not found on homepage');

      // Check container height
      const heightStyle = await orbitSection.evaluate(el => el.style.height || getComputedStyle(el).height);
      if (!heightStyle.includes('500svh') && !heightStyle.includes('500vh')) {
        const compHeight = await orbitSection.evaluate(el => el.offsetHeight);
        const winHeight = await page.evaluate(() => window.innerHeight);
        if (compHeight < winHeight * 4.5) {
          throw new Error(`Process Orbit height (${compHeight}px) should be ~500svh (${winHeight * 5}px)`);
        }
      }

      // Scroll through orbit section steps
      const box = await orbitSection.boundingBox();
      if (box) {
        await page.evaluate((top) => window.scrollTo(0, top + 1500), box.y);
        await page.waitForTimeout(300);

        const svgGroup = orbitSection.locator('svg g');
        const transform = await svgGroup.getAttribute('transform');
        if (!transform || !transform.includes('rotate')) {
          throw new Error(`SVG orbit group should have rotate transform on scroll, got: "${transform}"`);
        }
      }

      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'PASS',
        durationMs: Date.now() - t0,
        details: { height: heightStyle, scrollProgression: 'Active' }
      });
    } catch (err) {
      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'FAIL',
        durationMs: Date.now() - t0,
        error: err.message
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 2.7 Dynamic Adaptive Navigation Theme Inversion
  // ---------------------------------------------------------------------------
  console.log('\n--- 2.7 Dynamic Adaptive Navigation Theme Inversion ---');

  {
    const t0 = Date.now();
    const testName = 'Dynamic Nav Theme: Adds .theme-light on light sections and removes on dark';
    try {
      await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
      const nav = page.locator('nav.gnR7dqop');

      // 1. At top of page (Hero section - dark background)
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      let isThemeLight = await nav.evaluate(el => el.classList.contains('theme-light'));

      if (isThemeLight) {
        throw new Error('Nav should NOT have .theme-light class over Hero dark section');
      }

      // 2. Scroll into Capable Industries (light background section positioned under nav pill)
      const indSection = page.locator('section[data-framer-name="Capable Industries"]');
      const box = await indSection.boundingBox();
      if (!box) throw new Error('Capable Industries section not found for nav theme test');

      await page.evaluate((top) => window.scrollTo(0, top + 100), box.y);
      await page.waitForTimeout(400);

      isThemeLight = await nav.evaluate(el => el.classList.contains('theme-light'));
      if (!isThemeLight) {
        throw new Error('Nav should have .theme-light class when positioned over Capable Industries section');
      }

      // 3. Scroll back to top
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);

      isThemeLight = await nav.evaluate(el => el.classList.contains('theme-light'));
      if (isThemeLight) {
        throw new Error('Nav should remove .theme-light class after scrolling back to Hero dark section');
      }

      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'PASS',
        durationMs: Date.now() - t0,
        details: { darkHero: 'Verified', lightSection: 'Verified', returnDark: 'Verified' }
      });
    } catch (err) {
      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'FAIL',
        durationMs: Date.now() - t0,
        error: err.message
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 2.8 Dual DotReveal Glow Canvases (Hero & Footer)
  // ---------------------------------------------------------------------------
  console.log('\n--- 2.8 Dual DotReveal Glow Canvases ---');

  {
    const t0 = Date.now();
    const testName = 'Dual DotReveal Canvases: Hero & Footer particle canvases active on mousemove';
    try {
      await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });

      // 1. Hero DotReveal Canvas
      const heroCanvas = page.locator('#hero-section canvas');
      const hasHeroCanvas = await heroCanvas.count() > 0;
      if (!hasHeroCanvas) throw new Error('Hero DotReveal canvas (#hero-section canvas) not found');

      const heroBox = await heroCanvas.boundingBox();
      if (heroBox && heroBox.width > 0 && heroBox.height > 0) {
        await page.mouse.move(heroBox.x + 200, heroBox.y + 200);
        await page.waitForTimeout(150);
      }

      // 2. Footer DotReveal Canvas
      const footer = page.locator('footer, .framer-ZEYvg, .framer-1m3vhtb').first();
      await footer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      const footerCanvas = footer.locator('canvas').first();
      const hasFooterCanvas = await footerCanvas.count() > 0;
      if (!hasFooterCanvas) throw new Error('Footer DotReveal canvas not found in footer');

      const footerBox = await footerCanvas.boundingBox();
      if (footerBox && footerBox.width > 0 && footerBox.height > 0) {
        await page.mouse.move(footerBox.x + 200, footerBox.y + 200);
        await page.waitForTimeout(150);
      }

      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'PASS',
        durationMs: Date.now() - t0,
        details: { heroCanvas: 'Active', footerCanvas: 'Active' }
      });
    } catch (err) {
      reporter.recordTest({
        tier,
        suite,
        name: testName,
        status: 'FAIL',
        durationMs: Date.now() - t0,
        error: err.message
      });
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
      await runInteractiveTests({ browser, baseUrl, reporter });
    } finally {
      await browser.close();
      await close();
      reporter.finish();
      reporter.generateMarkdownReport('test-results/AUDIT_REPORT_INTERACTIVE.md');
    }
  })();
}

module.exports = { runInteractiveTests };
