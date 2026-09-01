const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 524 } });
  const pageRef = await ctx.newPage();
  await pageRef.goto("https://precept.framer.website");
  await pageRef.waitForTimeout(4000);

  // The ssr-variant hidden-XXX system might be controlled by JS, not CSS
  // Let's check: after JS runs, what class/style is added to ssr-variant divs?
  const ref = await pageRef.evaluate(() => {
    // Find all .ssr-variant divs in document
    const all = Array.from(document.querySelectorAll(".ssr-variant"));
    return all.slice(0, 10).map(v => ({
      className: v.className,
      computedDisplay: getComputedStyle(v).display,
      inlineStyle: v.getAttribute("style"),
      // Walk up to get parent section name
      section: v.closest("[data-framer-name]")?.getAttribute("data-framer-name")
    }));
  });
  
  console.log("SSR Variant state after JS:", JSON.stringify(ref, null, 2));
  
  // Also get ALL CSS rules and look for rules with "ssr" in the selector 
  const cssRules = await pageRef.evaluate(() => {
    const result = [];
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules || [])) {
          if (rule.selectorText && (rule.selectorText.includes("ssr") || rule.selectorText.includes("hidden-"))) {
            result.push(rule.cssText.slice(0, 200));
          }
          if (rule.cssRules) {
            for (const inner of Array.from(rule.cssRules)) {
              if (inner.selectorText && (inner.selectorText.includes("ssr") || inner.selectorText.includes("hidden-"))) {
                result.push("@media: " + inner.cssText.slice(0, 200));
              }
            }
          }
        }
      } catch(e) {}
    }
    return result;
  });
  
  console.log("ssr/hidden CSS rules:", JSON.stringify(cssRules, null, 2));
  await browser.close();
})();
