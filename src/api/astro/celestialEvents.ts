export interface CelestialEvent {
  id: string
  date: string
  name: string
  icon?: string
  description?: string
  category?: string
  source?: string
  url?: string
}

const getEventDate = (event: CelestialEvent) => {
  const parsed = new Date(event.date)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export const filterEventsByMonth = (
  events: CelestialEvent[],
  referenceDate = new Date(),
): CelestialEvent[] => {
  const month = referenceDate.getMonth()
  const year = referenceDate.getFullYear()
  return events.filter((event) => {
    const eventDate = getEventDate(event)
    if (!eventDate) return false
    return eventDate.getMonth() === month && eventDate.getFullYear() === year
  })
}

export const findNextMeteorShower = (
  events: CelestialEvent[],
  now = new Date(),
): CelestialEvent | undefined => {
  return events
    .filter(
      (event) =>
        (event.category && event.category === 'meteor-shower') || /meteorschauer/i.test(event.name),
    )
    .map((event) => ({ event, eventDate: getEventDate(event) }))
    .filter((entry) => entry.eventDate && entry.eventDate.getTime() >= now.getTime())
    .sort((a, b) => (a.eventDate!.getTime() > b.eventDate!.getTime() ? 1 : -1))[0]?.event
}

export const formatEventDate = (event: CelestialEvent, locale = 'de-DE') => {
  const parsed = getEventDate(event)
  if (!parsed) return event.date
  return parsed.toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })
}
