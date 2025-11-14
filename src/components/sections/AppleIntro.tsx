import { useEffect, useRef } from 'react'
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const [s1, s2, s3] = sceneRefs.current

      if (s1) {
        gsap.fromTo(
          s1,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.1 },
        )
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=180%',
          scrub: 1.2,
          pin: stageRef.current,
          pinSpacing: true,
          onLeave: () => onDone?.(),
        },
      })

      tl.to(s1, { opacity: 0, y: -40, duration: 0.8 })
        .fromTo(
          s2,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 },
          '<0.1',
        )
        .to(s2, { opacity: 0, y: -40, duration: 0.8 })
        .fromTo(
          s3,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9 },
          '<0.1',
        )
        .to([s1, s2, s3], { opacity: 0, duration: 0.3, ease: 'none' })
    }, containerRef)

    return () => ctx.revert()
  }, [onDone])

  return (
    <section className="apple-intro-light" ref={containerRef}>
      <div className="apple-intro-light__stage" ref={stageRef}>
        {scenes.map((scene, i) => (
          <div
            key={scene.id}
            className={`apple-intro-light__scene ${
              scene.variant === 'primary' ? 'primary' : ''
            }`}
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
