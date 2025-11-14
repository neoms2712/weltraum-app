import { useMemo } from 'react'
import { getConstellationHighlights } from '@/api/astro/sky'

export function SkyHighlightsCard() {
  const highlights = useMemo(() => getConstellationHighlights().slice(0, 3), [])

  return (
    <article className="content-card">
      <header>
        <p className="eyebrow">Sternkarten Live</p>
        <h3>Was gerade über Buchloe funkelt</h3>
      </header>
      <ul className="timeline">
        {highlights.length === 0 && <li>Gerade keine markanten Sternbilder sichtbar.</li>}
        {highlights.map((item) => (
          <li key={item.id}>
            <strong>
              {item.icon ? `${item.icon} ` : ''}
              {item.name}
            </strong>{' '}
            – {Math.round(item.altitude)}° hoch im {direction(item.azimuth)} · {item.story}
          </li>
        ))}
      </ul>
    </article>
  )
}

const direction = (azimuth: number) => {
  if (azimuth < 45 || azimuth >= 315) return 'Norden'
  if (azimuth < 135) return 'Osten'
  if (azimuth < 225) return 'Süden'
  return 'Westen'
}
