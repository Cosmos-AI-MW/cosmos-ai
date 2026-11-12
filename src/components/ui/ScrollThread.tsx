"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function ScrollThread({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const line = lineRef.current;
    if (!wrap || !line) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = wrap.getBoundingClientRect();
      const reading = window.innerHeight * 0.6;
      const progress = Math.min(
        1,
        Math.max(0, (reading - rect.top) / rect.height),
      );
      line.style.transform = `scaleY(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div
        ref={lineRef}
        aria-hidden="true"
        className="thread-line bg-cosmos-teal/60 pointer-events-none absolute top-0 bottom-0 -left-3 w-px"
      />
      {children}
    </div>
  );
}
