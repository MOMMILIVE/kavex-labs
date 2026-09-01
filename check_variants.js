const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 524 } });
  
  const pageRef = await ctx.newPage();
  await pageRef.goto("https://precept.framer.website");
  await pageRef.waitForTimeout(3000);

  const ref = await pageRef.evaluate(() => {
    const allBuild = Array.from(document.querySelectorAll("[class*='framer-1chkusm']"));
    const buildInfo = allBuild.map(el => {
      const cs = getComputedStyle(el);
      return {
        className: el.className,
        width: el.getBoundingClientRect().width,
        display: cs.display,
        gap: cs.gap
      };
    });
    
    const ssrVariants = Array.from(document.querySelectorAll(".ssr-variant")).filter(v => {
      const cs = getComputedStyle(v);
      return cs.display !== "none";
    }).map(v => ({
      className: v.className,
      display: getComputedStyle(v).display
    }));
    
    const h1 = document.querySelector("h1.framer-text");
    const buildRow = h1 ? h1.closest("[class*='framer-1chkusm']") : null;
    return {
      buildInfo,
      activeSSR: ssrVariants.slice(0, 3),
      activeGap: buildRow ? getComputedStyle(buildRow).gap : null
    };
  });
  
  console.log("Ref @ 1024px:", JSON.stringify(ref, null, 2));

  const pageLoc = await ctx.newPage();
  await pageLoc.goto("http://localhost:3000");
  await pageLoc.waitForTimeout(2000);

  const loc = await pageLoc.evaluate(() => {
    const allBuild = Array.from(document.querySelectorAll("[class*='framer-1chkusm']"));
    const buildInfo = allBuild.map(el => {
      const cs = getComputedStyle(el);
      return {
        className: el.className,
        width: el.getBoundingClientRect().width,
        display: cs.display,
        gap: cs.gap
      };
    });
    
    const ssrVariants = Array.from(document.querySelectorAll(".ssr-variant")).filter(v => {
      const cs = getComputedStyle(v);
      return cs.display !== "none";
    }).map(v => ({
      className: v.className,
      display: getComputedStyle(v).display
    }));
    
    const h1 = document.querySelector("h1.framer-text");
    const buildRow = h1 ? h1.closest("[class*='framer-1chkusm']") : null;
    return {
      buildInfo,
      activeSSR: ssrVariants.slice(0, 3),
      activeGap: buildRow ? getComputedStyle(buildRow).gap : null
    };
  });
  
  console.log("Loc @ 1024px:", JSON.stringify(loc, null, 2));
  
  await browser.close();
})();
