import { activeApiConfig, createApiClient, shouldUseClientApiKey } from '@/api'
import { mockNeoHighlights } from '@/api/mocks/nasa'
import type { NeoFeedResponse, NeoHighlight, NearEarthObjectRaw } from './types'

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY
const client = createApiClient(activeApiConfig)

const formatApproach = (neo: NearEarthObjectRaw) => {
  const entry = neo.close_approach_data?.[0]
  if (!entry) return 'Keine Daten'
  const date = entry.close_approach_date_full ?? ''
  return date || 'Zeitpunkt folgt'
}

const mapNeo = (neo: NearEarthObjectRaw): NeoHighlight => ({
  id: neo.id,
  name: neo.name,
  diameterMeters: neo.estimated_diameter.meters.estimated_diameter_max,
  hazardous: neo.is_potentially_hazardous_asteroid,
  approach: formatApproach(neo),
  orbitingBody: neo.close_approach_data?.[0]?.orbiting_body ?? 'Unbekannt',
})

export async function fetchNeoHighlights(limit = 5): Promise<NeoHighlight[]> {
  if (shouldUseClientApiKey && !NASA_API_KEY) {
    console.warn('VITE_NASA_API_KEY fehlt – NEO-Liste nutzt statische Daten.')
    return mockNeoHighlights
  }

  try {
    const response = await client.get<NeoFeedResponse>('/neo/rest/v1/feed/today', {
      api_key: shouldUseClientApiKey ? NASA_API_KEY : undefined,
    })
    const firstKey = Object.keys(response.near_earth_objects)[0]
    const objects = response.near_earth_objects[firstKey] ?? []
    return objects.slice(0, limit).map(mapNeo)
  } catch (error) {
    console.error('NEO Request fehlgeschlagen:', error)
    return mockNeoHighlights
  }
}
