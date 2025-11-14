export type MeteorShower = {
  id: string
  name: string
  peak: string
  radiant: string
  zhr: number
  hemisphere: 'north' | 'south' | 'both'
  description: string
}

export const meteorShowers: MeteorShower[] = [
  {
    id: 'perseids',
    name: 'Perseiden',
    peak: '2025-08-13T02:00:00Z',
    radiant: 'Perseus',
    zhr: 100,
    hemisphere: 'north',
    description: 'Warme Sommernacht + Sternschnuppenregen: perfekter Wunschmoment.',
  },
  {
    id: 'leonids',
    name: 'Leoniden',
    peak: '2025-11-18T04:00:00Z',
    radiant: 'Löwe',
    zhr: 20,
    hemisphere: 'both',
    description: 'Schnelle Meteore, manchmal mit Nachleuchten – wilde Lichttänze.',
  },
  {
    id: 'geminids',
    name: 'Geminiden',
    peak: '2025-12-14T02:00:00Z',
    radiant: 'Zwillinge',
    zhr: 120,
    hemisphere: 'north',
    description: 'Bunte Meteore im Winter – heißer Kakao und Sternenzauber.',
  },
]

export type DeepSkyObject = {
  id: string
  name: string
  type: string
  constellation: string
  bestMonths: number[]
  description: string
}

export const deepSkyObjects: DeepSkyObject[] = [
  {
    id: 'm31',
    name: 'Andromedanebel (M31)',
    type: 'Galaxie',
    constellation: 'Andromeda',
    bestMonths: [9, 10, 11, 12],
    description: 'Der nächste große Nachbar unserer Galaxie – leicht als diffuses Oval erkennbar.',
  },
  {
    id: 'm13',
    name: 'Herkuleshaufen (M13)',
    type: 'Kugelsternhaufen',
    constellation: 'Herkules',
    bestMonths: [5, 6, 7, 8],
    description: 'Tausende Sterne dicht gepackt – wirkt wie glitzernder Staub.',
  },
  {
    id: 'm42',
    name: 'Orionnebel (M42)',
    type: 'Emissionsnebel',
    constellation: 'Orion',
    bestMonths: [11, 12, 1, 2],
    description: 'In diesem Nebel entstehen gerade neue Sterne – kosmische Kinderstube.',
  },
]
