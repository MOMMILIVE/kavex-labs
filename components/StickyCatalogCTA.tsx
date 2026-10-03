export default function StickyCatalogCTA() {
  return <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#333333] bg-[#0A0A0A] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
    <a href="#catalog" className="flex min-h-14 items-center justify-center border border-[#333333] bg-black text-sm text-[#F3F3F3] hover:border-[#C0C0C0]">Unlock Pricing</a>
  </div>;
}
