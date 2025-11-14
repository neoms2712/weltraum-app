import { fetchNeoHighlights } from '@/api/nasa/neo'
import { useAsyncData } from '@/hooks/useAsyncData'

export function NeoList() {
  const { data } = useAsyncData(() => fetchNeoHighlights(6), [])

  return (
    <article className="content-card">
      <header>
        <p className="eyebrow">Near Earth Objects</p>
        <h3>Heute beobachtet</h3>
      </header>
      <ul className="neo-list">
        {data?.map((neo) => (
          <li key={neo.id}>
            <div>
              <strong>{neo.name}</strong>
              <p>{neo.approach}</p>
            </div>
            <p className="neo-list__meta">
              {neo.diameterMeters.toFixed(1)} m – {neo.hazardous ? '⚠️' : '✓'} – Orbit:{' '}
              {neo.orbitingBody}
            </p>
          </li>
        )) || <li>Keine Einträge geladen.</li>}
      </ul>
    </article>
  )
}
