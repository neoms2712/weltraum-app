import type { ApodResponse, MarsPhoto, NeoHighlight } from '@/api/nasa/types'

export const mockApod: ApodResponse = {
  date: '2024-12-01',
  explanation:
    'Dies ist eine Platzhalterbeschreibung. Sobald ein gültiger NASA-API-Schlüssel hinterlegt ist, erscheinen hier die aktuellen Astronomy-Picture-of-the-Day-Daten.',
  media_type: 'image',
  service_version: 'v1',
  title: 'Zwischenstopp in der Milchstraße',
  url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1350&q=80',
}

export const mockMarsPhotos: MarsPhoto[] = [
  {
    id: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
    cameraName: 'Mastcam',
    earthDate: '2015-05-30',
  },
  {
    id: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?auto=format&fit=crop&w=1200&q=80',
    cameraName: 'ChemCam',
    earthDate: '2015-05-30',
  },
]

export const mockNeoHighlights: NeoHighlight[] = [
  {
    id: '2000719',
    name: 'Apophis',
    diameterMeters: 375,
    hazardous: true,
    approach: '13. April 2029 – 21:46 Uhr',
    orbitingBody: 'Erde',
  },
  {
    id: '2024 QF2',
    name: '2024 QF2',
    diameterMeters: 83,
    hazardous: false,
    approach: '19. Februar 2025 – 06:12 Uhr',
    orbitingBody: 'Erde',
  },
]
