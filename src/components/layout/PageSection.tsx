import type { PropsWithChildren, ReactNode } from 'react'
import { useRevealSection } from '@/hooks/useRevealSection'

type PageSectionProps = PropsWithChildren<{
  id?: string
  eyebrow?: string
  title: string
  subtitle?: string
  actions?: ReactNode
}>

export function PageSection({ id, eyebrow, title, subtitle, actions, children }: PageSectionProps) {
  const sectionRef = useRevealSection<HTMLElement>()

  return (
    <section className="page-section" id={id} ref={sectionRef}>
      <div className="page-section__header">
        {eyebrow && <p className="page-section__eyebrow">{eyebrow}</p>}
        <div className="page-section__title-row">
          <div>
            <h2 className="page-section__title">{title}</h2>
            {subtitle && <p className="page-section__subtitle">{subtitle}</p>}
          </div>
          {actions}
        </div>
      </div>
      {children}
    </section>
  )
}
