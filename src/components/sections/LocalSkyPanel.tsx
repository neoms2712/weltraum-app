import { useMemo } from 'react'
import { fetchIssPasses } from '@/api/space/iss'
import { findNextMeteorShower, formatEventDate, getLocalSkyTimes, getMoonPhase } from '@/api'
import type { CelestialEvent } from '@/api/astro/celestialEvents'
import { appSettings } from '@/config/settings'
import { useAsyncData } from '@/hooks/useAsyncData'

const formatter = new Intl.DateTimeFormat('de-DE', {
  hour: '2-digit',
  minute: '2-digit',
})

const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
  dateStyle: 'short',
  timeStyle: 'short',
})

type LocalSkyPanelProps = {
  events: CelestialEvent[] | null
}

export function LocalSkyPanel({ events }: LocalSkyPanelProps) {
  const { label, lat, lon } = appSettings.location
  const skyTimes = useMemo(() => getLocalSkyTimes(lat, lon), [lat, lon])
  const moon = useMemo(() => getMoonPhase(), [])
  const nextShower = useMemo(() => (events ? findNextMeteorShower(events) : undefined), [events])
  const {
    data: issPasses,
    status: issStatus,
    error: issError,
  } = useAsyncData(() => fetchIssPasses(lat, lon, appSettings.iss.passCount), [lat, lon], {
    refreshIntervalMs: 5 * 60 * 1000,
  })
  const formatTime = (value?: Date | null) => (value ? formatter.format(value) : '—')

  return (
    <article className="content-card content-card--wide">
      <header>
        <p className="eyebrow">Direkt über {label}</p>
        <h3>Lokaler Himmel & ISS-Sichtungen</h3>
      </header>
      <ul className="metrics-list">
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
          <span>Nächster Meteorschauer</span>
          <strong>
            {nextShower
              ? `${nextShower.name} – ${formatEventDate(nextShower)}`
              : 'Keine Daten für dieses Jahr'}
          </strong>
        </li>
      </ul>

      <div className="iss-list">
        <p className="eyebrow">ISS Sichtungen</p>
        <ul>
          {issStatus === 'loading' && <li>Daten werden geladen...</li>}
          {issStatus === 'error' && <li>{issError ?? 'ISS-Daten derzeit nicht verfügbar.'}</li>}
          {issStatus === 'success' && issPasses?.length === 0 && (
            <li>Keine Durchgänge gefunden.</li>
          )}
          {issStatus === 'success' &&
            issPasses?.map((pass, idx) => (
              <li key={`${pass.start.toISOString()}-${idx}`}>
                {dateTimeFormatter.format(pass.start)} · {Math.round(pass.durationSeconds)} Sekunden
                · Peak {Math.round(pass.maxAltitude)}°
              </li>
            ))}
        </ul>
      </div>
    </article>
  )
}
