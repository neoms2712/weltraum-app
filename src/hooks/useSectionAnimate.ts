import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

console.log('Registering ScrollTrigger from useSectionAnimate')
gsap.registerPlugin(ScrollTrigger)

export function useSectionAnimate(threshold = 0.2) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches
    if (isMobile) {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      el.classList.add('section-visible')
      el.setAttribute('data-active', 'true')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('section-visible')
        }
      },
      { threshold: 0.01 },
    )

    observer.observe(el)

    const header = el.querySelector('.section-header')
    ScrollTrigger.create({
      trigger: el,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (header) {
          header.setAttribute('data-active', self.isActive ? 'true' : 'false')
        }
        el.setAttribute('data-active', self.isActive ? 'true' : 'false')
      },
    })

    if (el.dataset.parallax === 'true') {
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const x = (self.progress - 0.5) * 10
          el.style.setProperty('--parallax-x', `${x}px`)
        },
      })
    }

    return () => observer.disconnect()
  }, [threshold])

  return ref
}
