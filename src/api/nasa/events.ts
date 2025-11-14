import { activeApiConfig, createApiClient, shouldUseClientApiKey } from '@/api'
import type { CelestialEvent } from '@/api/astro/celestialEvents'
import { mockCelestialEvents } from '@/api/mocks/events'

interface DonkiNotification {
  messageType: string
  messageIssueTime: string
  messageBody: string
  messageURL?: string
  messageID?: string
}

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY
const client = createApiClient(activeApiConfig)

const formatDate = (date: Date) => date.toISOString().split('T')[0]

const toCelestialEvent = (notification: DonkiNotification): CelestialEvent => {
  const title = notification.messageType ? `DONKI ${notification.messageType}` : 'DONKI-Event'
  return {
    id:
      notification.messageID ??
      notification.messageURL ??
      `${notification.messageIssueTime}-${notification.messageType}`,
    date: notification.messageIssueTime,
    name: title,
    description: notification.messageBody,
    category: 'solar-activity',
    source: 'NASA DONKI',
    url: notification.messageURL,
  }
}

export async function fetchCelestialEvents(rangeDays = 45): Promise<CelestialEvent[]> {
  if (shouldUseClientApiKey && !NASA_API_KEY) {
    console.warn('VITE_NASA_API_KEY fehlt – Events verwenden Fallback-Daten.')
    return mockCelestialEvents
  }

  const start = new Date()
  const end = new Date()
  end.setDate(end.getDate() + rangeDays)

  try {
    const notifications = await client.get<DonkiNotification[]>('/DONKI/notifications', {
      startDate: formatDate(start),
      endDate: formatDate(end),
      type: 'all',
      api_key: shouldUseClientApiKey ? NASA_API_KEY : undefined,
    })
    const normalized = notifications.map(toCelestialEvent)
    return [...normalized, ...mockCelestialEvents]
  } catch (error) {
    console.error('Celestial Events Request fehlgeschlagen:', error)
    return mockCelestialEvents
  }
}
