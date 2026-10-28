interface GoldenBirdsProps {
  className?: string
  count?: number
}

// Hand-placed formation (x, y, scale) — a loose flock travelling left to right.
const FORMATION: [number, number, number][] = [
  [40, 60, 1],
  [110, 30, 0.8],
  [150, 85, 0.7],
  [210, 50, 0.9],
  [260, 95, 0.55],
  [300, 40, 0.6],
  [345, 75, 0.45],
]

/** Small gilded birds used as directional accents. Purely decorative. */
export function GoldenBirds({ className = '', count = FORMATION.length }: GoldenBirdsProps) {
  return (
    <svg className={`golden-birds ${className}`} viewBox="0 0 400 140" aria-hidden="true">
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E9D29A" />
          <stop offset=".5" stopColor="#B8945A" />
          <stop offset="1" stopColor="#8A6A3D" />
        </linearGradient>
      </defs>
      {FORMATION.slice(0, count).map(([x, y, s], i) => (
        <g key={i} className="bird" transform={`translate(${x} ${y}) scale(${s})`}>
          <path
            d="M-30 -4 Q-14 -14 -2 -1 Q0 1 2 -1 Q14 -14 30 -4 Q14 -7 3 5 L0 9 L-3 5 Q-14 -7 -30 -4 Z"
            fill="url(#gold)"
          />
        </g>
      ))}
    </svg>
  )
}
