import type { VercelRequest, VercelResponse } from '@vercel/node'

const NASA_BASE_URL = 'https://api.nasa.gov'
const ALLOWED_PREFIXES = ['/planetary/', '/mars-photos/', '/neo/']

const isAllowedPath = (path: string) => ALLOWED_PREFIXES.some((prefix) => path.startsWith(prefix))

const serializeParams = (params: VercelRequest['query']) => {
  const entries: Array<[string, string]> = []
  Object.entries(params).forEach(([key, value]) => {
    if (key === 'path') return
    if (Array.isArray(value)) {
      value.forEach((val) => entries.push([key, val]))
    } else if (typeof value === 'string') {
      entries.push([key, value])
    }
  })
  return entries
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.NASA_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'NASA_API_KEY nicht gesetzt' })
  }

  const pathParam = req.query.path
  const segments = Array.isArray(pathParam) ? pathParam : [pathParam].filter(Boolean)
  const upstreamPath = `/${segments.join('/')}`

  if (!isAllowedPath(`${upstreamPath}/`.replace(/\/\/+/, '/'))) {
    return res.status(400).json({ error: 'Pfad nicht erlaubt' })
  }

  const url = new URL(upstreamPath, NASA_BASE_URL)
  const params = serializeParams(req.query)
  params.forEach(([key, value]) => url.searchParams.append(key, value))
  url.searchParams.set('api_key', apiKey)

  try {
    const upstream = await fetch(url.toString())
    const contentType = upstream.headers.get('content-type') ?? 'application/json'
    const cacheHeader = upstream.headers.get('cache-control') ?? 'public, max-age=300'
    const body = await upstream.arrayBuffer()
    res.setHeader('content-type', contentType)
    res.setHeader('cache-control', cacheHeader)
    return res.status(upstream.status).send(Buffer.from(body))
  } catch (error) {
    console.error('NASA Proxy Fehler:', error)
    return res.status(500).json({ error: 'Proxy Anfrage fehlgeschlagen' })
  }
}
