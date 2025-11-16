import { useMemo, useRef } from 'react'
import { getPlanetVisibilities } from '@/api/astro/sky'
import { AppleCard } from '@/components/ui/AppleCard'

export function PlanetsCard() {
  const planets = useMemo(() => getPlanetVisibilities(), [])
  const stripRef = useRef<HTMLDivElement | null>(null)

  const scrollBy = (offset: number) => {
    stripRef.current?.scrollBy({ left: offset, behavior: 'smooth' })
  }

  return (
    <AppleCard
      eyebrow="Planetenradar"
      title="Wer leuchtet heute?"
      variant="wide"
      motionPreset="medium"
    >
      <div className="planet-strip" ref={stripRef}>
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
      <div className="strip-nav">
        <button
          type="button"
          className="strip-button"
          aria-label="Planeten nach links scrollen"
          onClick={() => scrollBy(-260)}
        >
          ‹
        </button>
        <button
          type="button"
          className="strip-button"
          aria-label="Planeten nach rechts scrollen"
          onClick={() => scrollBy(260)}
        >
          ›
        </button>
      </div>
    </AppleCard>
  )
}
