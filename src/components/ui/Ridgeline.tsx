"use client";

import { useEffect, useRef, useState } from "react";

// Paths run slightly past both edges (-40 to 1240) so the layers can drift
// sideways without ever showing a gap.
const BACK =
  "M-40 160 L-40 92 L0 92 L60 78 L120 96 L190 58 L250 84 L330 40 L410 82 L470 66 L560 100 L640 52 L720 90 L800 64 L880 98 L960 44 L1040 86 L1110 62 L1200 96 L1240 96 L1240 160 Z";
const MID =
  "M-40 160 L-40 120 L0 120 L80 100 L150 124 L240 84 L320 118 L400 96 L490 128 L580 90 L670 122 L760 80 L850 120 L940 98 L1030 126 L1120 92 L1200 118 L1240 118 L1240 160 Z";
const FRONT =
  "M-40 160 L-40 140 L0 140 L100 128 L200 144 L300 132 L420 148 L540 130 L660 146 L780 128 L900 146 L1020 132 L1120 144 L1200 134 L1240 134 L1240 160 Z";

export default function Ridgeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry?.isIntersecting ?? true);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 -bottom-px ${visible ? "" : "const-paused"}`}
    >
      <svg
        className="block h-28 w-full md:h-36"
        viewBox="0 0 1200 160"
        preserveAspectRatio="none"
      >
        <g
          className="ridge-breathe"
          style={{ animationDelay: "-2s", animationDuration: "17s" }}
        >
          <path
            className="ridge-rise"
            style={{ animationDelay: "0.1s" }}
            d={BACK}
            fill="#1A6B54"
            fillOpacity="0.45"
            stroke="#1A6B54"
            strokeOpacity="0.45"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
        <g
          className="ridge-breathe"
          style={{ animationDelay: "-5s", animationDuration: "11s" }}
        >
          <path
            className="ridge-rise"
            style={{ animationDelay: "0.35s" }}
            d={MID}
            fill="#2A8C6E"
            fillOpacity="0.5"
            stroke="#2A8C6E"
            strokeOpacity="0.5"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
        <path
          className="ridge-rise"
          style={{ animationDelay: "0.6s" }}
          d={FRONT}
          fill="#F2F5F3"
          stroke="#F2F5F3"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
