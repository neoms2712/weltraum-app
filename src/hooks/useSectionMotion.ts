import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useSectionMotion() {
  const pageRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = pageRef.current
    if (!root) return

    const sections = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.section'))

    sections.forEach((section) => {
      const header = section.querySelector('.section-header')
      const cards = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('.apple-card'))

      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            duration: 0.8,
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
            },
          },
        )
      }

      if (cards.length > 0) {
        gsap.from(cards, {
          opacity: 0,
          y: 35,
          scale: 0.97,
          ease: 'power2.out',
          duration: 0.8,
          stagger: 0.12,
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
          },
        })
      }
    })
  }, [])

  return { pageRef }
}
