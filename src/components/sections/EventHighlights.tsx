import type { CelestialEvent } from '@/api/astro/celestialEvents'
import { formatEventDate } from '@/api/astro/celestialEvents'

type EventHighlightsProps = {
  events: CelestialEvent[] | null
  status: 'idle' | 'loading' | 'success' | 'error'
}

export function EventHighlights({ events, status }: EventHighlightsProps) {
  const solarEvents =
    events?.filter((event) => event.category === 'solar-activity').slice(0, 4) ?? []

  return (
    <article className="content-card">
      <header>
        <p className="eyebrow">Weltraumwetter</p>
        <h3>Solar-Alerts & Space Weather</h3>
      </header>
      <ul className="timeline">
        {status === 'loading' && <li>Daten werden geladen...</li>}
        {status === 'error' && <li>Weltraumwetter aktuell nicht verfügbar.</li>}
        {status === 'success' && solarEvents.length === 0 && <li>Keine Solar-Events gefunden.</li>}
        {solarEvents.map((event) => (
          <li key={event.id}>
            <strong>{formatEventDate(event)}</strong> – {event.name}
          </li>
        ))}
      </ul>
    </article>
  )
}
