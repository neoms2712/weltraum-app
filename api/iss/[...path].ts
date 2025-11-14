import type { VercelRequest, VercelResponse } from '@vercel/node'

const ISS_BASE_URL = 'https://api.open-notify.org/'
const ALLOWED_RESOURCES = new Set(['iss-pass.json'])

const buildUrl = (resource: string, query: VercelRequest['query']) => {
  const url = new URL(resource, ISS_BASE_URL)
  Object.entries(query).forEach(([key, value]) => {
    if (key === 'path') return
    if (value === undefined) return
    if (Array.isArray(value)) {
      value.forEach((entry) => url.searchParams.append(key, entry))
    } else {
      url.searchParams.append(key, value)
    }
  })
  return url.toString()
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pathParam = req.query.path
  const segments = Array.isArray(pathParam) ? pathParam : [pathParam].filter(Boolean)
  const resource = segments.length ? segments.join('/') : 'iss-pass.json'

  if (!ALLOWED_RESOURCES.has(resource)) {
    return res.status(400).json({ error: 'Dieser ISS-Endpunkt ist nicht erlaubt.' })
  }

  const lat = req.query.lat ?? req.query.latitude
  const lon = req.query.lon ?? req.query.longitude
  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat und lon Parameter sind erforderlich.' })
  }

  try {
    const upstreamUrl = buildUrl(resource, req.query)
    const upstream = await fetch(upstreamUrl, {
      headers: { 'User-Agent': 'weltraum-app-proxy' },
    })
    const body = await upstream.arrayBuffer()
    res.setHeader('cache-control', 's-maxage=60, stale-while-revalidate=300')
    res.setHeader('content-type', upstream.headers.get('content-type') ?? 'application/json')
    return res.status(upstream.status).send(Buffer.from(body))
  } catch (error) {
    console.error('ISS Proxy Fehler:', error)
    return res.status(502).json({ error: 'ISS Proxy Anfrage fehlgeschlagen.' })
  }
}
