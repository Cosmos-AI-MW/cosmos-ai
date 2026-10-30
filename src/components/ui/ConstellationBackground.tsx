"use client";

import { useEffect, useRef, useState } from "react";

const POINTS: [number, number][] = [
  [80, 300],
  [190, 160],
  [310, 250],
  [430, 90],
  [540, 200],
  [650, 320],
  [760, 140],
  [870, 260],
  [980, 80],
  [1080, 210],
  [1130, 340],
  [240, 350],
  [700, 40],
  [400, 340],
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [4, 6],
  [6, 7],
  [7, 8],
  [8, 9],
  [9, 10],
  [2, 11],
  [5, 13],
  [6, 12],
  [7, 9],
];

export default function ConstellationBackground() {
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
          {EDGES.map(([a, b], i) => {
            const p1 = POINTS[a]!;
            const p2 = POINTS[b]!;
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
          {POINTS.map(([x, y], i) => (
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
