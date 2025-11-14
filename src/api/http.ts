import type { ApiConfig } from './config'

type QueryParams = Record<string, string | number | boolean | undefined>

const resolveBaseUrl = (base: string) => {
  if (/^https?:\/\//i.test(base)) {
    return base
  }
  if (typeof window !== 'undefined') {
    if (base.startsWith('/')) {
      return `${window.location.origin}${base}`
    }
    return new URL(base, window.location.origin).toString()
  }
  return base
}

export const buildUrl = (base: string, path: string, params: QueryParams = {}) => {
  const resolvedBase = resolveBaseUrl(base)
  const urlBase = resolvedBase.endsWith('/') ? resolvedBase : `${resolvedBase}/`
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  const url = new URL(normalizedPath, urlBase)
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === '') return
    url.searchParams.set(key, String(value))
  })
  return url.toString()
}

export async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
    ...init,
  })

  if (!response.ok) {
    const message = await response.text().catch(() => 'Unbekannter Fehler')
    throw new Error(`Request failed (${response.status}): ${message}`)
  }

  return (await response.json()) as T
}

export const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  const timeout = new Promise<never>((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id)
      reject(new Error('Request timeout'))
    }, timeoutMs)
  })

  return Promise.race([promise, timeout])
}

export const createApiClient = (config: ApiConfig) => ({
  get: <T>(path: string, params?: QueryParams, base = config.nasaBaseUrl) =>
    withTimeout(fetchJson<T>(buildUrl(base, path, params)), config.defaultTimeoutMs),
})
