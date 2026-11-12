"use client";

import { useEffect, useRef, useState } from "react";

export type Point = [number, number];
export type Edge = [number, number];

// Same look and motion as the About page constellation, driven by data
// so each page can have its own pattern.
export default function ConstellationField({
  points,
  edges,
}: {
  points: Point[];
  edges: Edge[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Pause the animation when scrolled out of view
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
      className={`pointer-events-none absolute inset-0 ${visible ? "" : "const-paused"}`}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMid slice"
      >
        <g className="const-drift">
          {edges.map(([a, b], i) => {
            const p1 = points[a];
            const p2 = points[b];
            if (!p1 || !p2) return null;
            return (
              <line
                key={`l${i}`}
                className="const-line"
                x1={p1[0]}
                y1={p1[1]}
                x2={p2[0]}
                y2={p2[1]}
                stroke="#2A8C6E"
                strokeOpacity="0.35"
                strokeWidth="1"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            );
          })}
          {points.map(([x, y], i) => (
            <circle
              key={`p${i}`}
              className="const-dot"
              cx={x}
              cy={y}
              r={i % 3 === 0 ? 3.5 : 2.5}
              fill="#B8CFC4"
              style={{ animationDelay: `${(i % 5) * 0.8}s` }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
