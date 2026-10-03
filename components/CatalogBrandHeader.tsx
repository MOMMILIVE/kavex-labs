/** Matches the existing site's floating navigation without loading its legacy runtime. */
export default function CatalogBrandHeader() {
  return <header className="fixed top-2 left-2 z-40 w-[min(360px,calc(100%-1rem))] border border-[#333333] bg-[#0A0A0A]/85 p-5 text-[#F3F3F3] backdrop-blur-xl md:top-4 md:left-4">
    <div className="flex items-center gap-5">
      <a href="/" aria-label="Kavex Labs home" className="shrink-0"><img src="/kavex_logo.svg" alt="" width="64" height="64" className="h-14 w-14 brightness-0 invert" /></a>
      <div className="flex-1"><span className="text-[9px] uppercase tracking-[0.12em] text-[#999999]">/ Catalog</span><p className="mt-5 text-xs">KAVEX Labs</p></div>
      <details className="group">
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 text-xs">Menu <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">{[2,7,12].flatMap(x=>[2,7,12].map(y=><rect key={`${x}-${y}`} x={x} y={y} width="2" height="2" />))}</svg></summary>
        <nav aria-label="Main navigation" className="absolute top-full left-[-1px] right-[-1px] border border-[#333333] bg-[#0A0A0A] p-6">
          {[['Home','/'],['About','/about'],['Capabilities','/capabilities'],['Recent Commissions','/newsroom/filters/all'],['Contact','/contact']].map(([label,href])=><a key={href} href={href} className="block py-3 text-sm text-[#C0C0C0] hover:text-[#F3F3F3]">{label}</a>)}
        </nav>
      </details>
    </div>
  </header>;
}
