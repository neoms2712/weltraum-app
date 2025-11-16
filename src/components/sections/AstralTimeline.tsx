const items = [
  {
    label: 'Mondphase',
    title: 'Abnehmender Sichelmond',
    detail: 'Bringt ruhige, klare Nächte.',
  },
  {
    label: 'Sternbild',
    title: 'Cassiopeia im Zenit',
    detail: 'Am besten gegen Norden sichtbar.',
  },
  {
    label: 'Highlight-Planet',
    title: 'Jupiter im Osten',
    detail: 'Maximale Helligkeit in der zweiten Nachthälfte.',
  },
  {
    label: 'ISS-Pass',
    title: 'Heute 00:41 • 240s',
    detail: 'Einmal quer über den Himmel.',
  },
] as const

export function AstralTimeline() {
  return (
    <div className="astral-timeline">
      {items.map((item) => (
        <div key={item.label} className="astral-timeline__item">
          <span className="astral-timeline__label">{item.label}</span>
          <span className="astral-timeline__title">{item.title}</span>
          <span className="astral-timeline__detail">{item.detail}</span>
        </div>
      ))}
    </div>
  )
}
