import { activeApiConfig, createApiClient, shouldUseClientApiKey } from '@/api'
import { mockApod } from '@/api/mocks/nasa'
import type { ApodResponse } from './types'

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY
const client = createApiClient(activeApiConfig)

export async function fetchApod(): Promise<ApodResponse> {
  if (shouldUseClientApiKey && !NASA_API_KEY) {
    console.warn('VITE_NASA_API_KEY fehlt – APOD nutzt statische Daten.')
    return mockApod
  }

  try {
    return await client.get<ApodResponse>('/planetary/apod', {
      thumbs: true,
      api_key: shouldUseClientApiKey ? NASA_API_KEY : undefined,
    })
  } catch (error) {
    console.error('APOD Request fehlgeschlagen:', error)
    return mockApod
  }
}
