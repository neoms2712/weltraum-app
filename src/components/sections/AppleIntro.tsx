import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const scenes = [
  { id: 'scene-1', text: 'Hallo Linda.', variant: 'primary' },
  { id: 'scene-2', text: 'Willkommen zu deiner Reise durch das Weltall.' },
  { id: 'scene-3', text: 'Deine Reise beginnt hier.' },
]

export function AppleIntro({ onDone }: { onDone?: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const sceneRefs = useRef<Array<HTMLDivElement | null>>([])
  const [isMobile, setIsMobile] = useState(false)
  const markDone = () => {
    onDone?.()
    if (containerRef.current) {
      containerRef.current.classList.add('apple-intro--done')
      containerRef.current.style.pointerEvents = 'none'
      const hero = document.querySelector('.section--hero')
      hero?.classList.add('section-visible')
      document.querySelectorAll('.apple-card').forEach((card) => {
        ;(card as HTMLElement).style.opacity = '1'
        ;(card as HTMLElement).style.transform = 'none'
      })
    }
  }

  useEffect(() => {
    const m = window.matchMedia('(max-width: 640px)')
    setIsMobile(m.matches)
    const handle = () => setIsMobile(m.matches)
    m.addEventListener('change', handle)
    return () => m.removeEventListener('change', handle)
  }, [])

  useEffect(() => {
    const [s1, s2, s3] = sceneRefs.current
    if (!s1 || !s2 || !s3) return

    if (isMobile) {
      ScrollTrigger.getAll().forEach((t) => t.kill())
      gsap.set([s1, s2, s3], { opacity: 0, y: 0 })
      gsap.set(s1, { opacity: 1 })

      let step = 1
      const handleScroll = () => {
        const y = window.scrollY
        if (step === 1 && y > 120) {
          step = 2
          gsap.to(s1, { opacity: 0, duration: 0.4 })
          gsap.to(s2, { opacity: 1, duration: 0.8 })
        } else if (step === 2 && y > 260) {
          step = 3
          gsap.to(s2, { opacity: 0, duration: 0.4 })
          gsap.to(s3, { opacity: 1, duration: 0.8 })
          window.removeEventListener('scroll', handleScroll)
          markDone()
        }
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        s1,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.1 },
      )

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=180%',
          scrub: 1.2,
          pin: stageRef.current,
          pinSpacing: true,
          onLeave: () => markDone(),
        },
      })

      tl.to(s1, { opacity: 0, y: -40 })
        .fromTo(s2, { opacity: 0, y: 40 }, { opacity: 1, y: 0 })
        .to(s2, { opacity: 0, y: -40 })
        .fromTo(s3, { opacity: 0, y: 40 }, { opacity: 1, y: 0 })
        .to([s1, s2, s3], { opacity: 0 })
    }, containerRef)

    return () => ctx.revert()
  }, [isMobile, onDone])

  return (
    <section className="apple-intro" ref={containerRef}>
      <div className="apple-intro__stage" ref={stageRef}>
        {scenes.map((scene, i) => (
          <div
            key={scene.id}
            className={`apple-intro__scene ${scene.variant === 'primary' ? 'primary' : ''}`}
            ref={(el) => {
              sceneRefs.current[i] = el
            }}
          >
            <p>{scene.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
