import { useMemo } from 'react'
import { getPlanetVisibilities } from '@/api/astro/sky'
import { AppleCard } from '@/components/ui/AppleCard'

export function PlanetsCard() {
  const planets = useMemo(() => getPlanetVisibilities(), [])

  return (
    <AppleCard
      eyebrow="Planetenradar"
      title="Wer leuchtet heute?"
      variant="wide"
      motionPreset="medium"
    >
      <div className="planet-strip">
        {planets.map((planet) => (
          <div className="planet-tile" key={planet.id}>
            <div className="planet-tile__header">
              <span className="planet-icon">{planet.icon}</span>
              <strong className="planet-name">{planet.name}</strong>
            </div>
            <p className="planet-desc">{planet.description}</p>
            <p className="planet-meta">
              Phase {planet.illuminated}% · Höhe {Math.round(planet.altitude)}°
            </p>
          </div>
        ))}
      </div>
    </AppleCard>
  )
}
