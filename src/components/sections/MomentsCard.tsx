import { useMemo } from 'react'
import { findNextMeteorShower, formatEventDate, getLocalSkyTimes, getMoonPhase } from '@/api'
import { getPlanetVisibilities } from '@/api/astro/sky'
import type { CelestialEvent } from '@/api/astro/celestialEvents'
import { fetchIssPasses } from '@/api/space/iss'
import { appSettings } from '@/config/settings'
import { useAsyncData } from '@/hooks/useAsyncData'
import { AppleCard } from '@/components/ui/AppleCard'

type MomentHighlight = {
  title: string
  text: string
  icon: string
}

export function MomentsCard({ events }: { events: CelestialEvent[] | null }) {
  const { lat, lon } = appSettings.location
  const skyTimes = useMemo(() => getLocalSkyTimes(lat, lon), [lat, lon])
  const moon = useMemo(() => getMoonPhase(), [])
  const planetHighlights = useMemo(
    () => getPlanetVisibilities().filter((p) => p.visible).sort((a, b) => b.altitude - a.altitude),
    [],
  )
  const topPlanet = planetHighlights[0]
  const nextShower = useMemo(() => (events ? findNextMeteorShower(events) : undefined), [events])
  const issPasses = useAsyncData(() => fetchIssPasses(lat, lon, 1), [lat, lon])
  const firstPass = issPasses.data?.[0]

  const dynamicMoments: MomentHighlight[] = [
    {
      title: 'ISS-Fenster',
      icon: '🛰️',
      text:
        issPasses.status === 'loading'
          ? 'ISS-Daten werden geladen …'
          : issPasses.status === 'error'
            ? 'ISS-Daten derzeit nicht verfügbar.'
            : firstPass
              ? `Nächster Überflug gegen ${formatTime(firstPass.start)} · ca. ${Math.round(firstPass.durationSeconds)}s sichtbar.`
              : 'Heute kein Überflug berechnet.',
    },
    {
      title: 'Meteorschauer',
      icon: '🌠',
      text: nextShower
        ? `${nextShower.name} (${formatEventDate(nextShower)}) – guter Moment, die Augen offen zu halten.`
        : 'Heute kein markanter Schauer angekündigt.',
    },
    {
      title: 'Planetenblick',
      icon: '🔭',
      text: topPlanet
        ? `${topPlanet.name} steht etwa ${Math.round(topPlanet.altitude)}° hoch im ${direction(topPlanet.azimuth)} – bestes Fenster am Abend.`
        : 'Keine Planeten über dem Horizont – dafür vielleicht mehr Sterne sichtbar.',
    },
    {
      title: 'Mondfenster',
      icon: '🌙',
      text: `Phase: ${moon.name}. Auf: ${formatTime(skyTimes.moonrise)} · Unter: ${formatTime(skyTimes.moonset)}.`,
    },
  ]

  return (
    <AppleCard eyebrow="Momente" title="Momente des Tages" motionPreset="spotlight">
      <div className="moments-strip">
        {dynamicMoments.map((moment) => (
          <div className="moment-tile moment-card" key={moment.title}>
            <div className="moment-icon-badge">
              <span>{moment.icon}</span>
            </div>
            <strong>{moment.title}</strong>
            <p>{moment.text}</p>
          </div>
        ))}
      </div>
    </AppleCard>
  )
}

const formatTime = (date?: Date | null) =>
  date ? date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : '–'

const direction = (azimuth: number) => {
  if (azimuth < 45 || azimuth >= 315) return 'Norden'
  if (azimuth < 135) return 'Osten'
  if (azimuth < 225) return 'Süden'
  return 'Westen'
}
