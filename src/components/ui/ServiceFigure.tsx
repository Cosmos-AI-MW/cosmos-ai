"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const STROKE = "#2A8C6E";
const INK = "#0D4A3A";

// Sets CSS custom properties (timing, offsets, origins) on an SVG element
const v = (vars: Record<string, string>) => vars as CSSProperties;

function Line({
  d,
  delay = 0,
  width = 1.5,
  className = "",
  origin,
}: {
  d: string;
  delay?: number;
  width?: number;
  className?: string;
  origin?: string;
}) {
  return (
    <path
      className={`fig-stroke ${className}`}
      pathLength={1}
      d={d}
      stroke={STROKE}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={v({ "--d": `${delay}s`, ...(origin ? { "--o": origin } : {}) })}
    />
  );
}

/* ── Consulting: compass ───────────────────────── */
function Compass() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      <g className="fig-breathe">
        <path
          className="fig-stroke"
          pathLength={1}
          d="M6 40 a34 34 0 1 1 68 0 a34 34 0 1 1 -68 0"
          stroke="#2A8C6E"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ ["--d" as string]: "0s" }}
        />
        {["M40 6V13", "M74 40H67", "M40 74V67", "M6 40H13"].map((d, i) => (
          <path
            key={d}
            className="fig-stroke"
            pathLength={1}
            d={d}
            stroke="#2A8C6E"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{ ["--d" as string]: `${0.7 + i * 0.12}s` }}
          />
        ))}
        <g className="fig-needle">
          <path
            className="fig-fade"
            d="M40 18 L45 40 L35 40 Z"
            fill="#2A8C6E"
            style={{ ["--d" as string]: "1s" }}
          />
          <path
            className="fig-fade"
            d="M40 62 L45 40 L35 40 Z"
            stroke="#2A8C6E"
            strokeWidth="1.2"
            strokeLinejoin="round"
            style={{ ["--d" as string]: "1s" }}
          />
        </g>
        <circle
          className="fig-fade"
          cx="40"
          cy="40"
          r="2.2"
          fill="#0D4A3A"
          style={{ ["--d" as string]: "1.1s" }}
        />
      </g>
    </svg>
  );
}

/* ── Custom development: a cube snaps together ─── */
function Build() {
  const edges = [
    { d: "M40 10 L66 25", dx: 4, dy: -8 },
    { d: "M66 25 L40 40", dx: 8, dy: -2 },
    { d: "M40 40 L14 25", dx: -8, dy: -2 },
    { d: "M14 25 L40 10", dx: -4, dy: -8 },
    { d: "M40 40 L40 70", dx: 0, dy: 8 },
    { d: "M66 25 L66 55", dx: 8, dy: 0 },
    { d: "M14 25 L14 55", dx: -8, dy: 0 },
    { d: "M66 55 L40 70", dx: 6, dy: 8 },
    { d: "M40 70 L14 55", dx: -6, dy: 8 },
  ];
  return (
    <svg
      viewBox="0 0 80 80"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      <g className="fig-breathe">
        {edges.map((e, i) => (
          <g
            key={e.d}
            className="fig-slide"
            style={v({
              "--dx": `${e.dx}px`,
              "--dy": `${e.dy}px`,
              "--d": `${i * 0.1}s`,
            })}
          >
            <Line d={e.d} delay={i * 0.1} />
          </g>
        ))}
        <circle
          className="fig-fade"
          cx="40"
          cy="40"
          r="2.4"
          fill={INK}
          style={v({ "--d": "1.8s" })}
        />
      </g>
    </svg>
  );
}

/* ── Distribution: one source reaches three ────── */
function Distribute() {
  const paths = [
    "M23 38 C40 36 48 25 59 18",
    "M23 40 L63 40",
    "M23 42 C40 44 48 55 59 62",
  ];
  const nodes: [number, number][] = [
    [64, 16],
    [68, 40],
    [64, 64],
  ];
  return (
    <svg
      viewBox="0 0 80 80"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      <g className="fig-breathe">
        <circle
          className="fig-fade"
          cx="18"
          cy="40"
          r="5"
          fill={STROKE}
          style={v({ "--d": "0s" })}
        />
        {paths.map((d, i) => (
          <Line key={d} d={d} delay={0.5 + i * 0.2} />
        ))}
        {nodes.map(([cx, cy], i) => (
          <circle
            key={`${cx}-${cy}`}
            className="fig-grow"
            cx={cx}
            cy={cy}
            r="4"
            stroke={STROKE}
            strokeWidth="1.5"
            style={v({ "--d": `${1.3 + i * 0.2}s`, "--o": "50% 50%" })}
          />
        ))}
      </g>
    </svg>
  );
}

/* ── Training: a sprout opens ──────────────────── */
function Sprout() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      <g className="fig-breathe">
        <Line d="M22 70 H58" delay={0} />
        <Line d="M40 70 C40 58 40 48 40 34" delay={0.4} />
        <path
          className="fig-grow"
          d="M40 54 C30 54 23 48 23 39 C32 39 39 45 40 54 Z"
          fill={STROKE}
          fillOpacity="0.9"
          style={v({ "--d": "1.3s", "--o": "100% 100%" })}
        />
        <path
          className="fig-grow"
          d="M40 46 C50 46 57 40 57 31 C48 31 41 37 40 46 Z"
          fill={STROKE}
          fillOpacity="0.9"
          style={v({ "--d": "1.6s", "--o": "0% 100%" })}
        />
        <circle
          className="fig-grow"
          cx="40"
          cy="31"
          r="3.2"
          fill={INK}
          style={v({ "--d": "1.9s", "--o": "50% 50%" })}
        />
      </g>
    </svg>
  );
}

/* ── Data: scattered points settle into a curve ── */
function Data() {
  const pts = [
    { x: 14, y: 58, dx: -6, dy: -14 },
    { x: 31, y: 49, dx: 8, dy: 10 },
    { x: 46, y: 36, dx: -10, dy: 6 },
    { x: 58, y: 24, dx: 12, dy: -12 },
    { x: 68, y: 14, dx: -8, dy: 14 },
  ];
  return (
    <svg
      viewBox="0 0 80 80"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      <g className="fig-breathe">
        <Line d="M10 70 H72" delay={0} width={1.2} />
        <Line d="M10 70 V10" delay={0.15} width={1.2} />
        {pts.map((p, i) => (
          <g
            key={p.x}
            className="fig-slide"
            style={v({
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
              "--d": `${0.5 + i * 0.12}s`,
            })}
          >
            <circle
              cx={p.x}
              cy={p.y}
              r={i === pts.length - 1 ? 3.4 : 2.7}
              fill={i === pts.length - 1 ? INK : STROKE}
            />
          </g>
        ))}
        <Line d="M14 58 C26 54 36 46 46 36 S60 22 68 14" delay={1.9} />
      </g>
    </svg>
  );
}

/* ── Agriculture: an ear of maize grows ────────── */
function Maize() {
  const kernels: [number, number][] = [];
  [26, 32, 38, 44, 50].forEach((y) => {
    [36.5, 40, 43.5].forEach((x) => kernels.push([x, y]));
  });
  return (
    <svg
      viewBox="0 0 80 80"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      <g className="fig-breathe">
        <Line d="M22 72 H58" delay={0} />
        <Line d="M40 72 V64" delay={0.3} />
        {/* Cob */}
        <path
          className="fig-grow"
          d="M40 14 C31 24 31 50 40 60 C49 50 49 24 40 14 Z"
          stroke={STROKE}
          strokeWidth="1.5"
          strokeLinejoin="round"
          style={v({ "--d": "0.7s", "--o": "50% 100%" })}
        />
        {kernels.map(([x, y], i) => (
          <circle
            key={`${x}-${y}`}
            className="fig-fade"
            cx={x}
            cy={y}
            r="1.3"
            fill={INK}
            style={v({ "--d": `${1.3 + Math.floor(i / 3) * 0.1}s` })}
          />
        ))}
        {/* Husks */}
        <path
          className="fig-grow"
          d="M40 66 C27 63 21 47 25 30 C31 40 37 50 40 58 Z"
          fill={STROKE}
          fillOpacity="0.9"
          style={v({ "--d": "1.9s", "--o": "100% 100%" })}
        />
        <path
          className="fig-grow"
          d="M40 66 C53 63 59 47 55 30 C49 40 43 50 40 58 Z"
          fill={STROKE}
          fillOpacity="0.9"
          style={v({ "--d": "2.1s", "--o": "0% 100%" })}
        />
      </g>
    </svg>
  );
}

/* ── Health: a steady pulse ────────────────────── */
function Pulse() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      <g className="fig-breathe">
        <Line
          d="M6 40 a34 34 0 1 1 68 0 a34 34 0 1 1 -68 0"
          delay={0}
          width={1.2}
        />
        <Line
          className="fig-beat"
          origin="50% 61%"
          d="M6 40 H20 C22 40 22 36 25 36 C28 36 28 40 30 40 L33 44 L38 12 L43 58 L46 40 H52 C55 40 55 32 59 32 C63 32 63 40 66 40 H74"
          delay={0.6}
          width={1.8}
        />
      </g>
    </svg>
  );
}

/* ── WhatsApp / chat: a bubble with typing dots ── */
function Chat() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      <g className="fig-breathe">
        <Line
          d="M20 14 H60 A8 8 0 0 1 68 22 V46 A8 8 0 0 1 60 54 H38 L26 66 V54 H20 A8 8 0 0 1 12 46 V22 A8 8 0 0 1 20 14 Z"
          delay={0}
          width={1.6}
        />
        {[28, 40, 52].map((cx, i) => (
          <circle
            key={cx}
            className="fig-fade fig-dot"
            cx={cx}
            cy="34"
            r="3"
            fill={i === 2 ? INK : STROKE}
            style={v({
              "--d": `${1.2 + i * 0.15}s`,
              "--ad": `${2.4 + i * 0.18}s`,
            })}
          />
        ))}
      </g>
    </svg>
  );
}

/* ── Translation: text flows from one tile to another ── */
function Translate() {
  const tile = (x: number) =>
    `M${x + 4} 20 H${x + 24} A4 4 0 0 1 ${x + 28} 24 V56 A4 4 0 0 1 ${x + 24} 60 H${x + 4} A4 4 0 0 1 ${x} 56 V24 A4 4 0 0 1 ${x + 4} 20 Z`;
  const leftBars = ["M11 32 H29", "M11 40 H24", "M11 48 H27"];
  const rightBars = ["M51 32 H67", "M51 40 H69", "M51 48 H62"];
  return (
    <svg
      viewBox="0 0 80 80"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      <g className="fig-breathe">
        <Line d={tile(6)} delay={0} />
        <Line d={tile(46)} delay={0.2} />
        {leftBars.map((d, i) => (
          <Line key={d} d={d} delay={0.5 + i * 0.1} width={1.6} />
        ))}
        {rightBars.map((d, i) => (
          <g
            key={d}
            className="fig-slide"
            style={v({
              "--dx": "-40px",
              "--dy": "0px",
              "--d": `${1.1 + i * 0.15}s`,
            })}
          >
            <Line d={d} delay={1.1 + i * 0.15} width={1.6} />
          </g>
        ))}
        <Line d="M20 14 C28 4 52 4 60 14" delay={1.8} />
        <Line d="M59.1 8.1 L60 14 L54.4 11.8" delay={2.4} />
        <Line d="M60 66 C52 76 28 76 20 66" delay={2} />
        <Line d="M20.9 71.9 L20 66 L25.6 68.2" delay={2.6} />
      </g>
    </svg>
  );
}

/* ── Fallback for services without their own figure ── */
function Star() {
  const arms = [
    "M40 40 L40 8",
    "M40 40 L40 72",
    "M40 40 L8 40",
    "M40 40 L72 40",
    "M40 40 L17.4 17.4",
    "M40 40 L62.6 62.6",
    "M40 40 L62.6 17.4",
    "M40 40 L17.4 62.6",
  ];
  return (
    <svg
      viewBox="0 0 80 80"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      <g className="fig-breathe">
        {arms.map((d, i) => (
          <Line key={d} d={d} delay={i * 0.12} width={i < 4 ? 1.8 : 1.2} />
        ))}
        <circle
          className="fig-fade"
          cx="40"
          cy="40"
          r="3"
          fill={INK}
          style={v({ "--d": "1s" })}
        />
      </g>
    </svg>
  );
}

// Specific sectors come first so a title like "Health Analytics" gets the pulse.
const FIGURES: { match: RegExp; Figure: () => React.JSX.Element }[] = [
  { match: /agricult|farm/i, Figure: Maize },
  { match: /health|clinic|medical/i, Figure: Pulse },
  { match: /whatsapp|chat|messag/i, Figure: Chat },
  { match: /translat|language|chichewa/i, Figure: Translate },
  { match: /consult|advis/i, Figure: Compass },
  { match: /custom|develop/i, Figure: Build },
  { match: /distribut/i, Figure: Distribute },
  { match: /train|workshop/i, Figure: Sprout },
  { match: /data|analytic|automat/i, Figure: Data },
];

export default function ServiceFigure({
  title,
  className = "",
}: {
  title: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setDrawn(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry?.isIntersecting ?? false;
        setOnScreen(inView);
        if (inView) setDrawn(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Figure = FIGURES.find((f) => f.match.test(title))?.Figure ?? Star;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`${drawn ? "fig-in" : ""} ${onScreen ? "" : "fig-paused"} ${className}`}
    >
      <Figure />
    </div>
  );
}
