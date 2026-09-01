const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({ headless: true });
  
  for (const width of [800, 1024, 1200, 1440, 1600]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const pageRef = await ctx.newPage();
    await pageRef.goto("https://precept.framer.website");
    await pageRef.waitForTimeout(1000);
    
    const size = await pageRef.evaluate(() => {
      const h1 = document.querySelector("h1.framer-text");
      if (!h1) return null;
      
      const cs = getComputedStyle(h1);
      const fs = cs.fontSize;
      const inlineStyle = h1.getAttribute("style") || "";
      const mult = inlineStyle.match(/\* ([\d.]+)\)/);
      
      return { fs, mult: mult ? mult[1] : null, w: h1.getBoundingClientRect().width };
    });
    
    console.log(`Width ${width}:`, size);
    await ctx.close();
  }
  
  await browser.close();
})();
