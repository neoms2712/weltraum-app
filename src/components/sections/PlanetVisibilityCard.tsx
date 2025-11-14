import { useMemo } from 'react'
import { getPlanetVisibilities } from '@/api/astro/sky'

export function PlanetsCard() {
  const planets = useMemo(() => getPlanetVisibilities(), [])

  return (
    <article className="dash-card">
      <p className="card-eyebrow">Planetenradar</p>
      <h3>Wer leuchtet heute?</h3>
      <div className="card-swipe">
        {planets.map((planet) => (
          <div className="card-swipe__item" key={planet.id}>
            <strong>
              {planet.icon} {planet.name}
            </strong>
            <p>{planet.description}</p>
            <p className="card-meta">
              Phase {planet.illuminated}% · Höhe {Math.round(planet.altitude)}°
            </p>
          </div>
        ))}
      </div>
    </article>
  )
}
