import type { ReactNode } from 'react'

type DataCardProps = {
  label: string
  value: ReactNode
  hint?: ReactNode
}

export function DataCard({ label, value, hint }: DataCardProps) {
  return (
    <article className="data-card">
      <span className="data-card__label">{label}</span>
      <span className="data-card__value">{value}</span>
      {hint && <p className="data-card__hint">{hint}</p>}
    </article>
  )
}
