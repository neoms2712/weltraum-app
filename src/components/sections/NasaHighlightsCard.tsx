import { useAsyncData } from '@/hooks/useAsyncData'
import { fetchApod } from '@/api/nasa/apod'
import { fetchMarsPhotos } from '@/api/nasa/marsRover'
import { fetchNeoHighlights } from '@/api/nasa/neo'
import { AppleCard } from '@/components/ui/AppleCard'

export function NasaHighlightsCard() {
  const apod = useAsyncData(fetchApod, [])
  const mars = useAsyncData(() => fetchMarsPhotos(6), [])
  const neos = useAsyncData(() => fetchNeoHighlights(5), [])

  const shortText = (t: string) =>
    t.length > 220 ? t.slice(0, 216).trim() + ' …' : t

  return (
    <AppleCard
      eyebrow="Mission Updates"
      title="NASA Highlights"
      variant="wide"
      motionPreset="deep"
    >
      <div className="nasa-apod">
        {apod.data && (
          <>
            {apod.data.url && (
              <img src={apod.data.url} alt={apod.data.title} className="nasa-apod__image" />
            )}
            <div className="nasa-apod__text">
              <strong className="nasa-apod__title">{apod.data.title}</strong>
              <span className="nasa-apod__date">{apod.data.date}</span>
              <p className="nasa-apod__desc">{shortText(apod.data.explanation)}</p>
            </div>
          </>
        )}
        {apod.status === 'loading' && <p className="loading-text">APOD wird geladen …</p>}
      </div>
      <div className="nasa-strip-label">Mars Rover – Latest Discoveries</div>
      <div className="nasa-strip">
        {mars.data?.map((photo) => (
          <div key={photo.id} className="nasa-strip__item">
            <img src={photo.imageUrl} alt={photo.cameraName} className="nasa-strip__thumb" />
            <div className="nasa-strip__meta">
              <strong>{photo.cameraName}</strong>
              <p>{photo.earthDate}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="nasa-neo">
        <p className="nasa-strip-label">Near Earth Objects</p>
        <div className="nasa-neo__grid">
          {neos.data?.slice(0, 4).map((neo) => (
            <div key={neo.id} className="nasa-neo__tile">
              <strong>{neo.name}</strong>
              <span>{neo.diameterMeters.toFixed(1)} m</span>
              <span>{neo.orbitingBody}</span>
              <span className={neo.hazardous ? 'danger' : 'safe'}>
                {neo.hazardous ? '⚠ gefährlich' : '✔ sicher'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AppleCard>
  )
}
