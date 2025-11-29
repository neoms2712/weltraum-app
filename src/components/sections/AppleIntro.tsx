import { useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const scenes = [
  { id: 'scene-1', text: 'Hallo Linda.', variant: 'primary' },
  { id: 'scene-2', text: 'Willkommen zu deiner Reise durch das Weltall.' },
  { id: 'scene-3', text: 'Deine Reise beginnt hier.' },
]

export function AppleIntro({ onDone }: { onDone?: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const sceneRefs = useRef<Array<HTMLDivElement | null>>([])
  const doneRef = useRef(false)

  const markDone = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    gsap.killTweensOf(window)
    ScrollTrigger.getAll().forEach((t) => t.kill())
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

      const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches
      if (hero && isMobile) {
        const scrollToHero = () => {
          const top = hero.getBoundingClientRect().top + window.scrollY
          gsap.to(window, {
            scrollTo: top,
            duration: 0.8,
            ease: 'power3.out',
          })
        }
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            ScrollTrigger.refresh()
            setTimeout(scrollToHero, 120)
          }),
        )
      }
    }
  }, [onDone])

  useEffect(() => {
    const [s1, s2, s3] = sceneRefs.current
    if (!s1 || !s2 || !s3 || !containerRef.current) return

    const mm = gsap.matchMedia()

    const baseReset = () => {
      gsap.set([s1, s2, s3], { opacity: 0, y: 0 })
      gsap.set(s1, { opacity: 1 })
    }

    mm.add('(max-width: 640px)', () => {
      baseReset()
      let finished = false
      const tl = gsap.timeline({
        defaults: { ease: 'power1.out' },
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=170%',
          scrub: 0.15,
          pin: true,
          pinSpacing: true,
          anticipatePin: 0.4,
          invalidateOnRefresh: true,
          onLeave: () => markDone(),
        },
        onComplete: () => {
          if (!finished) {
            finished = true
            markDone()
          }
        },
      })

      tl.to(s1, { opacity: 0, y: -14, scale: 0.98, duration: 0.75 })
        .fromTo(s2, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.1 })
        .to(s2, { opacity: 0, y: -14, scale: 0.98, duration: 0.75 })
        .fromTo(s3, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.1 })

      const parallaxTweens = [
        gsap.to(s1, {
          y: -3,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=30%',
            scrub: 0.2,
          },
        }),
        gsap.to(s2, {
          y: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=50%',
            scrub: 0.2,
          },
        }),
        gsap.to(s3, {
          y: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=70%',
            scrub: 0.2,
          },
        }),
      ]

      return () => {
        tl.kill()
        parallaxTweens.forEach((tween) => tween.kill())
      }
    })

    mm.add('(min-width: 641px)', () => {
      baseReset()

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

      tl.fromTo(
        s1,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power1.out', delay: 0.1 },
      )
        .to(s1, { opacity: 0, y: -40, scale: 0.98, duration: 0.75, ease: 'power1.out' })
        .fromTo(s2, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power1.out' })
        .to(s2, { opacity: 0, y: -40, scale: 0.98, duration: 0.75, ease: 'power1.out' })
        .fromTo(s3, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power1.out' })
        .to([s1, s2, s3], { opacity: 0 })

      const parallaxTweens = [
        gsap.to(s1, {
          y: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=40%',
            scrub: 0.15,
          },
        }),
        gsap.to(s2, {
          y: -5,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=60%',
            scrub: 0.15,
          },
        }),
        gsap.to(s3, {
          y: -5,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=80%',
            scrub: 0.15,
          },
        }),
      ]

      return () => {
        tl.kill()
        parallaxTweens.forEach((tween) => tween.kill())
      }
    })

    return () => mm.revert()
  }, [markDone])

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
