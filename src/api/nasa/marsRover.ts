import { mockMarsPhotos } from '@/api/mocks/nasa'
import type { MarsPhoto } from './types'

const NASA_IMAGE_API = 'https://images-api.nasa.gov/search'

type NasaImageResponse = {
  collection?: {
    items?: Array<{
      href?: string
      data?: Array<{ title?: string; date_created?: string }>
      links?: Array<{ href: string }>
    }>
  }
}

export async function fetchMarsPhotos(limit = 8): Promise<MarsPhoto[]> {
  const params = new URLSearchParams({
    q: 'Perseverance Rover surface',
    keywords: 'Mars Rover',
    media_type: 'image',
    year_start: '2021',
  })

  try {
    const res = await fetch(`${NASA_IMAGE_API}?${params.toString()}`)
    if (!res.ok) throw new Error(`Status ${res.status}`)
    const data = (await res.json()) as NasaImageResponse
    const items =
      data.collection?.items
        ?.map((item) => {
          const media = item.links?.[0]?.href ?? item.href ?? ''
          const meta = item.data?.[0]
          return {
            media,
            title: meta?.title ?? 'Mars Rover',
            date: meta?.date_created ? new Date(meta.date_created) : null,
          }
        })
        .filter((entry) => entry.media) ?? []
    items.sort((a, b) => {
      if (!a.date || !b.date) return 0
      return b.date.getTime() - a.date.getTime()
    })
    if (items.length === 0) {
      console.warn('NASA Image Library liefert keine Roverbilder – verwende Fallback.')
      return mockMarsPhotos
    }

    return items.slice(0, limit).map((item, idx) => ({
      id: idx,
      imageUrl: item.media,
      cameraName: item.title,
      earthDate: item.date ? item.date.toISOString().slice(0, 10) : '',
    }))
  } catch (error) {
    console.error('Mars-Galerie Request fehlgeschlagen:', error)
    return mockMarsPhotos
  }
}
