import { useState } from 'react'
import { fetchApod } from '@/api/nasa/apod'
import { useAsyncData } from '@/hooks/useAsyncData'

export function ApodCard() {
  const [expanded, setExpanded] = useState(false)
  const { data, status } = useAsyncData(fetchApod, [])

  const toggle = () => setExpanded((prev) => !prev)

  return (
    <article className="content-card">
      <header>
        <p className="eyebrow">Astronomy Picture of the Day</p>
        <h3>{data?.title ?? 'Lade NASA APOD...'}</h3>
        <p className="meta">{data?.date}</p>
      </header>
      <div className="media-frame">
        {status === 'loading' && <div className="media-frame__placeholder" />}
        {data && data.media_type === 'image' && (
          <img src={data.url} alt={data.title} loading="lazy" />
        )}
      </div>
      {data && (
        <div className={`apod-description ${expanded ? 'apod-description--expanded' : ''}`}>
          {data.explanation}
        </div>
      )}
      {data && (
        <button className="link-btn" onClick={toggle}>
          {expanded ? 'Weniger anzeigen' : 'Mehr anzeigen'}
        </button>
      )}
    </article>
  )
}
