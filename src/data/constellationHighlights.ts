export type ConstellationConfig = {
  id: string
  name: string
  raHours: number
  decDegrees: number
  story: string
  icon?: string
}

export const constellations: ConstellationConfig[] = [
  {
    id: 'orion',
    name: 'Orion',
    raHours: 5.5,
    decDegrees: -5,
    story: 'Der Jäger steht hoch über dem Südhorizont und zeigt dir die hellen Gürtelsterne.',
    icon: '🗡️',
  },
  {
    id: 'pleiades',
    name: 'Siebengestirn',
    raHours: 3.8,
    decDegrees: 24,
    story: 'Die Plejaden funkeln wie glitzernde Diamanten – perfekte Wunschsterne.',
    icon: '✨',
  },
  {
    id: 'cassiopeia',
    name: 'Cassiopeia',
    raHours: 1,
    decDegrees: 60,
    story: 'Das charakteristische W weist dir den Nordhimmel und ruft nach Abenteuern.',
    icon: '👑',
  },
  {
    id: 'cygnus',
    name: 'Schwan',
    raHours: 20.6,
    decDegrees: 42,
    story: 'Der Schwan gleitet quer über die Milchstraße – ein Mini-Milky-Way für dich.',
    icon: '🦢',
  },
  {
    id: 'leo',
    name: 'Löwe',
    raHours: 10.5,
    decDegrees: 16,
    story: 'Der Löwe erhebt sich majestätisch – Symbol für Mut und Reisepläne.',
    icon: '🦁',
  },
]
