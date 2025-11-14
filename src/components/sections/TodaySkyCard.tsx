import { useMemo } from 'react'
import { findNextMeteorShower, formatEventDate, getLocalSkyTimes, getMoonPhase } from '@/api'
import { fetchIssPasses } from '@/api/space/iss'
import { appSettings } from '@/config/settings'
import { useAsyncData } from '@/hooks/useAsyncData'
import type { CelestialEvent } from '@/api/astro/celestialEvents'
import { AppleCard } from '@/components/ui/AppleCard'

export function TodaySkyCard({ events }: { events: CelestialEvent[] | null }) {
  const { lat, lon, label } = appSettings.location
  const skyTimes = useMemo(() => getLocalSkyTimes(lat, lon), [lat, lon])
  const moon = useMemo(() => getMoonPhase(), [])
  const nextShower = useMemo(() => (events ? findNextMeteorShower(events) : undefined), [events])
  const issPasses = useAsyncData(() => fetchIssPasses(lat, lon, 2), [lat, lon])
  const firstPass = issPasses.data?.[0]

  return (
    <AppleCard
      eyebrow={`Heute über ${label}`}
      title="Lokaler Himmel"
      variant="tall"
      motionPreset="soft"
    >
      <ul className="apple-card-list">
        <li>
          <span>Sonnenaufgang</span>
          <strong>{formatTime(skyTimes.sunrise)}</strong>
        </li>
        <li>
          <span>Sonnenuntergang</span>
          <strong>{formatTime(skyTimes.sunset)}</strong>
        </li>
        <li>
          <span>Mondaufgang</span>
          <strong>{formatTime(skyTimes.moonrise)}</strong>
        </li>
        <li>
          <span>Monduntergang</span>
          <strong>{formatTime(skyTimes.moonset)}</strong>
        </li>
        <li>
          <span>Mondphase</span>
          <strong>{moon.name}</strong>
        </li>
        <li>
          <span>Meteorschauer</span>
          <strong>{nextShower ? `${nextShower.name} (${formatEventDate(nextShower)})` : '–'}</strong>
        </li>
        <li>
          <span>ISS Pass</span>
          <strong>
            {issPasses.status === 'loading' && 'lädt…'}
            {issPasses.status === 'error' && 'offline'}
            {issPasses.status === 'success' && firstPass
              ? `${formatDate(firstPass.start)} · ${Math.round(firstPass.durationSeconds)}s`
              : null}
          </strong>
        </li>
      </ul>
    </AppleCard>
  )
}

const formatTime = (date?: Date | null) =>
  date ? date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : '–'

const formatDate = (date: Date) =>
  date.toLocaleString('de-DE', { hour: '2-digit', minute: '2-digit' })
