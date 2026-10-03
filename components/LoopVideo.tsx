"use client";

import { useEffect, useRef, useState } from 'react';

/** Motion stays opt-in for reduced-motion visitors. Playback stops off screen. */
export default function LoopVideo({ src, label, className = '', priority = false }: {
  src: string; label: string; className?: string; priority?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const sync = () => {
      if (visible && !media.matches && !document.hidden) void video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); });
    observer.observe(video);
    media.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); media.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); };
  }, []);
  return <>
    <video ref={ref} src={src} muted loop playsInline preload={priority ? 'metadata' : 'none'} controls aria-label={label} onError={() => setFailed(true)} className={className} />
    {failed ? <span role="status" className="absolute bottom-6 left-6 text-xs text-[#C0C0C0]">Film unavailable.</span> : null}
  </>;
}
