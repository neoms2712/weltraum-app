import { useEffect, useState } from 'react'
import type { MarsPhoto } from '@/api/nasa/types'
import { fetchMarsPhotos } from '@/api/nasa/marsRover'
import { useAsyncData } from '@/hooks/useAsyncData'

export function MarsGallery() {
  const { data, status } = useAsyncData(() => fetchMarsPhotos(10), [])
  const [selected, setSelected] = useState<MarsPhoto | null>(null)

  useEffect(() => {
    if (!selected) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelected(null)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
    }
  }, [selected])

  return (
    <article className="content-card">
      <header>
        <p className="eyebrow">Mars Rover Fotos</p>
        <h3>Curiosity – Sol 1000</h3>
      </header>
      <div className="mars-gallery">
        {status === 'loading' && <div className="media-frame__placeholder" />}
        {data?.map((photo) => (
          <button key={photo.id} className="mars-gallery__item" onClick={() => setSelected(photo)}>
            <img src={photo.imageUrl} alt={photo.cameraName} loading="lazy" />
            <span>{photo.cameraName}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="lightbox" role="dialog" aria-modal="true">
          <button
            type="button"
            className="lightbox__scrim"
            aria-label="Lightbox schließen"
            onClick={() => setSelected(null)}
          />
          <div className="lightbox__content">
            <button
              className="lightbox__close"
              onClick={() => setSelected(null)}
              aria-label="Schließen"
            >
              ×
            </button>
            <img src={selected.imageUrl} alt={selected.cameraName} />
            <p>
              {selected.cameraName} – {selected.earthDate}
            </p>
          </div>
        </div>
      )}
    </article>
  )
}
