import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type MotionPreset = 'soft' | 'medium' | 'deep' | 'spotlight' | 'cinematic'

type AppleCardVariant = 'default' | 'wide' | 'tall' | 'personal' | 'hero'

type AppleCardProps = {
  eyebrow?: string
  title?: string
  children: ReactNode
  variant?: AppleCardVariant | AppleCardVariant[]
  motionPreset?: MotionPreset
  animate?: boolean
}

type MotionConfig = {
  start: string
  y: number
  scaleFrom: number
  scaleTo: number
  liftScale: number
  driftY: number
  duration: number
  ease: string
}

const MOTION_PRESETS: Record<MotionPreset, MotionConfig> = {
  soft: {
    start: 'top 90%',
    y: 25,
    scaleFrom: 0.98,
    scaleTo: 1,
    liftScale: 0.004,
    driftY: 1.5,
    duration: 0.8,
    ease: 'power2.out',
  },
  medium: {
    start: 'top 85%',
    y: 35,
    scaleFrom: 0.97,
    scaleTo: 1,
    liftScale: 0.007,
    driftY: 3,
    duration: 1,
    ease: 'power2.out',
  },
  deep: {
    start: 'top 80%',
    y: 45,
    scaleFrom: 0.95,
    scaleTo: 1.01,
    liftScale: 0.012,
    driftY: 5,
    duration: 1.2,
    ease: 'power3.out',
  },
  spotlight: {
    start: 'top 78%',
    y: 40,
    scaleFrom: 0.96,
    scaleTo: 1,
    liftScale: 0.006,
    driftY: 2,
    duration: 1.3,
    ease: 'power2.inOut',
  },
  cinematic: {
    start: 'top 75%',
    y: 50,
    scaleFrom: 0.92,
    scaleTo: 1.02,
    liftScale: 0.015,
    driftY: 7,
    duration: 1.45,
    ease: 'power4.out',
  },
}

export function AppleCard({
  eyebrow,
  title,
  children,
  variant = 'default',
  motionPreset = 'medium',
  animate = true,
}: AppleCardProps) {
  const cardRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!animate) return

    const el = cardRef.current
    if (!el) return

    const cfg = MOTION_PRESETS[motionPreset]

    const ctx = gsap.context(() => {
      el.setAttribute('data-shadow', 'soft')
      gsap.set(el, {
        opacity: 0,
        y: cfg.y,
        scale: cfg.scaleFrom,
      })

      gsap.to(el, {
        opacity: 1,
        y: 0,
        scale: cfg.scaleTo,
        duration: cfg.duration,
        ease: cfg.ease,
        scrollTrigger: {
          trigger: el,
          start: cfg.start,
          end: 'bottom 60%',
          toggleActions: 'play none none reverse',
        },
      })

      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          end: 'bottom 25%',
          scrub: 0.6,
        },
        scale: cfg.scaleTo + cfg.liftScale,
        boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
        ease: 'none',
      })

      const eyebrow = el.querySelector('.apple-card-eyebrow')
      const title = el.querySelector('.apple-card-title')

      if (eyebrow) {
        gsap.to(eyebrow, {
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1,
          },
          y: -cfg.driftY * 0.6,
          opacity: 0.9,
          ease: 'none',
        })
      }

      if (title) {
        gsap.to(title, {
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1,
          },
          y: -cfg.driftY,
          opacity: 0.95,
          ease: 'none',
        })
      }

      if (variant === 'wide' || variant === 'personal') {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1.2,
          },
          backgroundPosition: '60% 40%',
          ease: 'none',
        })
      }

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        end: 'bottom 30%',
        scrub: true,
        onUpdate: (self) => {
          el.setAttribute('data-shadow', self.progress > 0.4 ? 'strong' : 'soft')
        },
      })
    }, cardRef)

    return () => ctx.revert()
  }, [motionPreset, animate, variant])

  const variantList = Array.isArray(variant) ? variant : [variant]
  const variantClass = variantList
    .filter((value) => value && value !== 'default')
    .map((value) => `apple-card--${value}`)
    .join(' ')

  return (
    <article ref={cardRef} className={`apple-card fade-in ${variantClass}`.trim()}>
      {eyebrow && <p className="apple-card-eyebrow">{eyebrow}</p>}
      {title && <h3 className="apple-card-title">{title}</h3>}
      <div className="apple-card-body">{children}</div>
    </article>
  )
}
