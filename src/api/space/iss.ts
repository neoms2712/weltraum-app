import {
  degreesToRadians,
  radiansToDegrees,
  ecfToLookAngles,
  eciToEcf,
  gstime,
  propagate,
  twoline2satrec,
} from 'satellite.js'
import type { SatRec } from 'satellite.js'

export interface IssPass {
  start: Date
  peak: Date
  end: Date
  maxAltitude: number
  durationSeconds: number
}

const TLE_ALT_URL = 'https://tle.ivanstanojevic.me/api/tle/25544'
const ALTITUDE_THRESHOLD = 10 // degrees
const HOURS_AHEAD = 12
const STEP_SECONDS = 60

const FALLBACK_TLE = {
  line1: '1 25544U 98067A   25090.57083333  .00016717  00000+0  30316-3 0  9994',
  line2: '2 25544  51.6418 182.2613 0004909  34.2891 249.7533 15.50109442434797',
}

const loadTle = async () => {
  try {
    const response = await fetch(TLE_ALT_URL)
    if (!response.ok) throw new Error(`Status ${response.status}`)
    const json = (await response.json()) as { line1?: string; line2?: string }
    if (!json.line1 || !json.line2) throw new Error('Alternatives TLE unvollständig')
    return { line1: json.line1, line2: json.line2 }
  } catch (error) {
    console.warn('Nutze statisches ISS-TLE als Fallback.', error)
    return FALLBACK_TLE
  }
}

const computeAltitude = (satrec: SatRec, date: Date, lat: number, lon: number) => {
  const result = propagate(satrec, date)
  if (!result || !result.position) return null
  const position = result.position
  const gmst = gstime(date)
  const positionEcf = eciToEcf(position, gmst)
  const observer = {
    latitude: degreesToRadians(lat),
    longitude: degreesToRadians(lon),
    height: 0,
  }
  const lookAngles = ecfToLookAngles(observer, positionEcf)
  return radiansToDegrees(lookAngles.elevation)
}

export async function fetchIssPasses(lat: number, lon: number, count = 3): Promise<IssPass[]> {
  const { line1, line2 } = await loadTle()
  const satrec = twoline2satrec(line1, line2)
  const startTime = new Date()
  const passes: IssPass[] = []
  let currentPass: { start: Date; peak: Date; maxAltitude: number } | null = null

  for (let seconds = 0; seconds <= HOURS_AHEAD * 3600; seconds += STEP_SECONDS) {
    const timestamp = new Date(startTime.getTime() + seconds * 1000)
    const altitude = computeAltitude(satrec, timestamp, lat, lon)
    if (altitude === null) continue

    if (altitude >= ALTITUDE_THRESHOLD) {
      if (!currentPass) {
        currentPass = { start: timestamp, peak: timestamp, maxAltitude: altitude }
      } else if (altitude > currentPass.maxAltitude) {
        currentPass.maxAltitude = altitude
        currentPass.peak = timestamp
      }
    } else if (currentPass) {
      const durationSeconds = (timestamp.getTime() - currentPass.start.getTime()) / 1000
      passes.push({
        start: currentPass.start,
        peak: currentPass.peak,
        end: timestamp,
        maxAltitude: currentPass.maxAltitude,
        durationSeconds,
      })
      currentPass = null
      if (passes.length >= count) break
    }
  }

  return passes
}
