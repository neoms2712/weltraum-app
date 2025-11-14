import { useMemo } from 'react'
import { meteorShowers, deepSkyObjects } from '@/data/skyCatalog'

const now = () => new Date()

const findNextShowers = () => {
  const today = now().getTime()
  return meteorShowers
    .map((shower) => ({ shower, date: new Date(shower.peak) }))
    .filter(({ date }) => date.getTime() >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 2)
}

const pickDeepSky = () => {
  const month = now().getMonth() + 1
  return deepSkyObjects.filter((obj) => obj.bestMonths.includes(month))
}

export function MeteorCard() {
  const showers = useMemo(() => findNextShowers(), [])
  const deepSky = useMemo(() => pickDeepSky(), [])

  return (
    <article className="dash-card">
      <p className="card-eyebrow">Meteore & Deep Sky</p>
      <h3>Dein Beobachtungsplan</h3>
      <div className="card-lines">
        {showers.map(({ shower, date }) => (
          <p key={shower.id}>
            {shower.name} · Peak{' '}
            {date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long' })} · Radiant{' '}
            {shower.radiant} · ZHR {shower.zhr}
          </p>
        ))}
      </div>
      <div className="card-swipe">
        {deepSky.map((obj) => (
          <div className="card-swipe__item" key={obj.id}>
            <strong>{obj.name}</strong>
            <p>{obj.description}</p>
          </div>
        ))}
      </div>
    </article>
  )
}
