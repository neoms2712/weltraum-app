import { useMemo } from 'react'
import type { CelestialEvent } from '@/api/astro/celestialEvents'
import { getConstellationHighlights, getPlanetVisibilities } from '@/api/astro/sky'
import { messageTemplates } from '@/data/personalMessages'

const pickTemplate = () =>
  messageTemplates[Math.floor(Math.random() * messageTemplates.length)] ?? messageTemplates[0]

const upcomingEventName = (events: CelestialEvent[] | null) => {
  if (!events || events.length === 0) return 'das nächste Himmelsereignis'
  const now = Date.now()
  const future = events
    .map((event) => ({ event, timestamp: new Date(event.date).getTime() }))
    .filter(({ timestamp }) => !Number.isNaN(timestamp) && timestamp >= now)
    .sort((a, b) => a.timestamp - b.timestamp)
  return future[0]?.event.name ?? events[0].name
}

export function PersonalMessageCard({ events }: { events: CelestialEvent[] | null }) {
  const constellations = useMemo(() => getConstellationHighlights(), [])
  const planets = useMemo(() => getPlanetVisibilities(), [])
  const template = pickTemplate()
  const highlight = constellations[0]?.name ?? 'der Himmel'
  const planet = planets.find((p) => p.visible)?.name ?? 'die Planeten'
  const eventName = upcomingEventName(events)

  const message = template
    .replace('{highlight}', highlight)
    .replace('{planet}', planet)
    .replace('{event}', eventName)

  return (
    <article className="content-card">
      <header>
        <p className="eyebrow">Nur für Linda</p>
        <h3>Deine persönliche Botschaft</h3>
      </header>
      <p>{message}</p>
    </article>
  )
}
