import { useMemo } from 'react'
import { getMoonPhase } from '@/api'
import { getConstellationHighlights, getPlanetVisibilities } from '@/api/astro/sky'

export function TodayHighlightStrip() {
  const moon = useMemo(() => getMoonPhase(), [])
  const constellation = useMemo(() => getConstellationHighlights()[0], [])
  const planets = useMemo(() => getPlanetVisibilities(), [])
  const highlightPlanet = planets.find((planet) => planet.visible) ?? planets[0]

  return (
    <div className="today-strip">
      <div className="today-pill">
        <span className="pill-label">Mondphase</span>
        <span className="pill-value">{moon.name}</span>
      </div>
      {constellation ? (
        <div className="today-pill">
          <span className="pill-label">Sternbild</span>
          <span className="pill-value">{constellation.name}</span>
        </div>
      ) : null}
      {highlightPlanet ? (
        <div className="today-pill">
          <span className="pill-label">Highlight-Planet</span>
          <span className="pill-value">
            {highlightPlanet.icon} {highlightPlanet.name}
          </span>
        </div>
      ) : null}
    </div>
  )
}
