import { filterEventsByMonth, formatEventDate } from '@/api/astro/celestialEvents'
import type { CelestialEvent } from '@/api/astro/celestialEvents'
import { AppleCard } from '@/components/ui/AppleCard'

type CelestialEventsListProps = {
  events: CelestialEvent[] | null
  status: 'idle' | 'loading' | 'success' | 'error'
  referenceDate?: Date
}

export function CelestialEventsList({
  events,
  status,
  referenceDate = new Date(),
}: CelestialEventsListProps) {
  const monthEvents = events ? filterEventsByMonth(events, referenceDate) : []
  const monthLabel = referenceDate.toLocaleDateString('de-DE', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <AppleCard
      eyebrow="Kosmischer Kalender"
      title={monthLabel}
      variant="wide"
      motionPreset="spotlight"
    >
      <div className="event-list">
        {status === 'loading' && <p className="event-hint">Daten werden geladen…</p>}
        {status === 'error' && (
          <p className="event-hint error">Eventfeed aktuell nicht verfügbar.</p>
        )}
        {status === 'success' && monthEvents.length === 0 && (
          <p className="event-hint">Keine Ereignisse in diesem Monat.</p>
        )}
        {monthEvents.map((event) => (
          <div key={`${event.id}-${event.date}`} className="event-row">
            <strong className="event-date">{formatEventDate(event)}</strong>
            <span className="event-name">
              {event.icon ? `${event.icon} ` : ''}
              {event.name}
            </span>
          </div>
        ))}
      </div>
    </AppleCard>
  )
}
