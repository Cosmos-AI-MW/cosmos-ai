export default function CosmicLoader() {
  return (
    <div className="flex items-center gap-3 px-6 py-5">
      <div className="relative h-8 w-8">
        <svg viewBox="0 0 32 32" className="h-8 w-8 overflow-visible">
          <defs>
            <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Glowing core, breathing */}
          <circle
            cx="16"
            cy="16"
            r="7"
            fill="url(#core-glow)"
            className="text-cosmos-teal animate-pulse"
            style={{ animationDuration: "2.4s" }}
          />
          <circle
            cx="16"
            cy="16"
            r="2"
            fill="currentColor"
            className="text-cosmos-teal"
          />

          {/* Orbit path 1, faint */}
          <ellipse
            cx="16"
            cy="16"
            rx="14"
            ry="7"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="1 3"
            className="text-cosmos-teal/25"
            transform="rotate(-20 16 16)"
          />

          {/* Orbit path 2, faint, different tilt */}
          <ellipse
            cx="16"
            cy="16"
            rx="10"
            ry="4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
            strokeDasharray="1 2.5"
            className="text-cosmos-teal/15"
            transform="rotate(35 16 16)"
          />

          {/* Body 1: outer, slower, comet tail */}
          <g className="text-cosmos-teal">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 16 16"
              to="360 16 16"
              dur="3.2s"
              repeatCount="indefinite"
            />
            <g transform="rotate(-20 16 16)">
              <circle
                cx="1.4"
                cy="16"
                r="0.5"
                fill="currentColor"
                opacity="0.15"
              />
              <circle
                cx="2.4"
                cy="16"
                r="0.65"
                fill="currentColor"
                opacity="0.3"
              />
              <circle
                cx="3.6"
                cy="16"
                r="0.85"
                fill="currentColor"
                opacity="0.55"
              />
              <circle cx="30" cy="16" r="1.3" fill="currentColor" />
            </g>
          </g>

          {/* Body 2: inner, faster, counter-rotating, smaller tail */}
          <g className="text-cosmos-teal/80">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 16 16"
              to="0 16 16"
              dur="1.8s"
              repeatCount="indefinite"
            />
            <g transform="rotate(35 16 16)">
              <circle
                cx="6.6"
                cy="16"
                r="0.3"
                fill="currentColor"
                opacity="0.2"
              />
              <circle
                cx="7.3"
                cy="16"
                r="0.4"
                fill="currentColor"
                opacity="0.4"
              />
              <circle
                cx="8.2"
                cy="16"
                r="0.5"
                fill="currentColor"
                opacity="0.6"
              />
              <circle cx="26" cy="16" r="0.8" fill="currentColor" />
            </g>
          </g>
        </svg>
      </div>

      <div className="flex flex-col">
        <span className="text-cosmos-forest text-sm font-medium">
          Cosmos Write is thinking
        </span>
        <span className="text-cosmos-forest/50 text-xs font-light">
          Working on your request...
        </span>
      </div>
    </div>
  );
}
