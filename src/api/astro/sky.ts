import { Body, Equator, Horizon, Illumination, Observer } from 'astronomy-engine'
import { appSettings } from '@/config/settings'
import { constellations } from '@/data/constellationHighlights'
import type { ConstellationConfig } from '@/data/constellationHighlights'

export type ConstellationHighlight = ConstellationConfig & {
  altitude: number
  azimuth: number
  visible: boolean
}

export type PlanetVisibility = {
  id: string
  name: string
  icon: string
  altitude: number
  azimuth: number
  illuminated: number
  visible: boolean
  description: string
}

const planetConfigs = [
  { id: 'mercury', body: Body.Mercury, name: 'Merkur', icon: '☿️', minAlt: 5 },
  { id: 'venus', body: Body.Venus, name: 'Venus', icon: '♀️', minAlt: 5 },
  { id: 'mars', body: Body.Mars, name: 'Mars', icon: '♂️', minAlt: 5 },
  { id: 'jupiter', body: Body.Jupiter, name: 'Jupiter', icon: '♃', minAlt: 10 },
  { id: 'saturn', body: Body.Saturn, name: 'Saturn', icon: '♄', minAlt: 10 },
]

const observer = new Observer(appSettings.location.lat, appSettings.location.lon, 0)

const computeHorizon = (raHours: number, decDegrees: number, date: Date) => {
  const { altitude, azimuth } = Horizon(date, observer, raHours, decDegrees, 'normal')
  return { altitude, azimuth }
}

export const getConstellationHighlights = (date = new Date()): ConstellationHighlight[] => {
  return constellations
    .map((item) => {
      const coords = computeHorizon(item.raHours, item.decDegrees, date)
      return {
        ...item,
        altitude: coords.altitude,
        azimuth: coords.azimuth,
        visible: coords.altitude > 0,
      }
    })
    .filter((item) => item.visible)
    .sort((a, b) => b.altitude - a.altitude)
}

export const getPlanetVisibilities = (date = new Date()): PlanetVisibility[] => {
  return planetConfigs.map((config) => {
    const eq = Equator(config.body, date, observer, true, true)
    const { altitude, azimuth } = Horizon(date, observer, eq.ra, eq.dec, 'normal')
    const illumination = Illumination(config.body, date)
    const visible = altitude >= config.minAlt
    const percentage = Math.round((illumination.phase_fraction ?? 0) * 100)
    return {
      id: config.id,
      name: config.name,
      icon: config.icon,
      altitude,
      azimuth,
      illuminated: percentage,
      visible,
      description: visible
        ? `${config.name} steht ${Math.round(altitude)}° hoch im ${direction(azimuth)}.`
        : `${config.name} befindet sich unter dem Horizont.`,
    }
  })
}

const direction = (azimuth: number) => {
  if (azimuth < 45 || azimuth >= 315) return 'Norden'
  if (azimuth < 135) return 'Osten'
  if (azimuth < 225) return 'Süden'
  return 'Westen'
}
