import { useMemo } from 'react'
import { meteorShowers, deepSkyObjects } from '@/data/skyCatalog'
import { AppleCard } from '@/components/ui/AppleCard'

const now = () => new Date()

const findNextShowers = () => {
  const today = now().getTime()
  return meteorShowers
    .map((shower) => ({ shower, date: new Date(shower.peak) }))
    .filter(({ date }) => date.getTime() >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3)
}

const pickDeepSkyList = () => {
  const month = now().getMonth() + 1
  return deepSkyObjects.filter((obj) => obj.bestMonths.includes(month))
}

export function MeteorCard() {
  const showers = useMemo(() => findNextShowers(), [])
  const deepSky = useMemo(() => pickDeepSkyList(), [])

  return (
    <AppleCard
      eyebrow="Meteore & Deep Sky"
      title="Beobachtungsempfehlung"
      variant={['wide', 'tall']}
      motionPreset="deep"
    >
      <div className="meteor-list">
        {showers.map(({ shower, date }) => (
          <div key={shower.id} className="meteor-entry">
            <strong className="meteor-entry__title">{shower.name}</strong>
            <span className="meteor-entry__meta">
              Peak {date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long' })} · Radiant{' '}
              {shower.radiant} · ZHR {shower.zhr}
            </span>
          </div>
        ))}
      </div>

      <div className="deep-sky-strip">
        {deepSky.map((obj) => (
          <div className="deep-sky-card deep-sky-mini-card" key={obj.id}>
            <strong>{obj.name}</strong>
            <p>{obj.description}</p>
          </div>
        ))}
      </div>
    </AppleCard>
  )
}
