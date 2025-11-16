import { useMemo } from 'react'
import { AppleCard } from '@/components/ui/AppleCard'
import { getMoonPhase } from '@/api'
import { getConstellationHighlights } from '@/api/astro/sky'
import type { CelestialEvent } from '@/api/astro/celestialEvents'

type CosmicPersonalityCardProps = {
  events: CelestialEvent[] | null
}

const nextEventTitle = (events: CelestialEvent[] | null) => {
  if (!events || events.length === 0) return 'das nächste Himmelsereignis'
  const now = Date.now()
  const future = events
    .map((event) => ({ event, timestamp: new Date(event.date).getTime() }))
    .filter(({ timestamp }) => !Number.isNaN(timestamp) && timestamp >= now)
    .sort((a, b) => a.timestamp - b.timestamp)
  return future[0]?.event.name ?? events[0].name
}

export function CosmicPersonalityCard({ events }: CosmicPersonalityCardProps) {
  const moon = useMemo(() => getMoonPhase(), [])
  const constellations = useMemo(() => getConstellationHighlights(), [])
  const constellation = constellations[0]?.name ?? 'Cassiopeia'
  const constellationMeaning = constellations[0]?.story ?? 'Ruhe und Harmonie'
  const eventTitle = nextEventTitle(events)

  const personality = {
    eyebrow: 'Kosmische Stimmung · Buchloe',
    title: 'Dein Himmelsprofil heute',
    moonText: `Der aktuelle Mond zeigt sich als ${moon.name} – eine Phase, die sanft daran erinnert, wie sich Gefühle verändern dürfen. Er bringt Ruhe, Klarheit und kleine Aufbrüche, die man erst spürt, bevor man sie versteht.`,
    constellationText: `Über dir steht heute ${constellation} – ein Sternbild, das für ${constellationMeaning} steht und dir einen Moment schenkt, der sich vertraut und gut anfühlt.`,
    eventText: `Außerdem zeigt der Himmel auf ${eventTitle} – ein stilles Zeichen dafür, dass alles seinen eigenen Rhythmus hat.`,
    poetry:
      'Und heute trägt der Himmel deinen Namen leise mit — zwischen Mondlicht und Sternenrauschen.',
  }

  return (
    <AppleCard variant="personal" motionPreset="spotlight">
      <div className="cosmic-personality personal-gradient">
        <span className="cosmic-personality__badge">
          <span>✦</span>
          {personality.eyebrow}
        </span>
        <h3 className="cosmic-personality__headline">{personality.title}</h3>
        <p className="cosmic-personality__text">{personality.moonText}</p>
        <p className="cosmic-personality__text">{personality.constellationText}</p>
        <p className="cosmic-personality__text">{personality.eventText}</p>
        <p className="cosmic-personality__poetry">{personality.poetry}</p>
      </div>
    </AppleCard>
  )
}
