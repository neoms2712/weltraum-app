type ConstellationPoint = {
  x: number
  y: number
}

const CONSTELLATION_PATTERNS: Record<
  'cassiopeia' | 'orion' | 'lyra' | 'perseus',
  readonly ConstellationPoint[]
> = {
  cassiopeia: [
    { x: 12, y: 40 },
    { x: 32, y: 20 },
    { x: 50, y: 42 },
    { x: 68, y: 24 },
    { x: 82, y: 44 },
  ],
  orion: [
    { x: 30, y: 20 },
    { x: 40, y: 40 },
    { x: 50, y: 60 },
    { x: 60, y: 40 },
    { x: 70, y: 20 },
  ],
  lyra: [
    { x: 35, y: 25 },
    { x: 55, y: 25 },
    { x: 65, y: 45 },
    { x: 45, y: 65 },
    { x: 25, y: 50 },
  ],
  perseus: [
    { x: 20, y: 30 },
    { x: 35, y: 15 },
    { x: 55, y: 25 },
    { x: 70, y: 45 },
    { x: 60, y: 65 },
  ],
}

type PatternKey = keyof typeof CONSTELLATION_PATTERNS

type ConstellationCardProps = {
  name: string
  pattern: PatternKey
}

export function ConstellationCard({ name, pattern }: ConstellationCardProps) {
  const points = CONSTELLATION_PATTERNS[pattern]

  return (
    <div className="constellation-card">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(' ')}
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="0.6"
          fill="none"
        />
        {points.map((point, index) => (
          <circle
            key={`${pattern}-${index}`}
            cx={point.x}
            cy={point.y}
            r="1.8"
            fill="rgba(255,255,255,0.95)"
          />
        ))}
      </svg>
      <p className="constellation-card__title">{name}</p>
    </div>
  )
}
