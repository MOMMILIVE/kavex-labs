const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 524 } });
  const pageRef = await ctx.newPage();
  await pageRef.goto("https://precept.framer.website");
  await pageRef.waitForTimeout(3000);

  // Get the CSS controlling hidden-XXX classes - search ALL rules recursively
  const ref = await pageRef.evaluate(() => {
    const allRules = [];
    function walkRules(ruleList) {
      for (const rule of Array.from(ruleList || [])) {
        const text = rule.cssText || "";
        if (text.includes("hidden-5bl3e9") || text.includes("hidden-72rtr7") || text.includes("hidden-a81c")) {
          allRules.push(text.slice(0, 400));
        }
        if (rule.cssRules) {
          walkRules(rule.cssRules);
        }
      }
    }
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        walkRules(sheet.cssRules);
      } catch(e) {}
    }
    return allRules;
  });
  
  console.log("Hidden CSS rules on reference site:", JSON.stringify(ref, null, 2));
  
  // Also get the raw CSS text of ALL stylesheets to find the hidden rules
  const allCSSText = await pageRef.evaluate(() => {
    const texts = [];
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        const rules = Array.from(sheet.cssRules || []);
        for (const rule of rules) {
          const text = rule.cssText || "";
          if (text.length > 10) {
            texts.push(text.slice(0, 200));
          }
        }
      } catch(e) {}
    }
    return texts.filter(t => t.includes("hidden")).slice(0, 10);
  });
  console.log("CSS with 'hidden':", JSON.stringify(allCSSText, null, 2));
  
  await browser.close();
})();
