import { useLayoutEffect } from 'react'
import gsap from 'gsap'

export function useFadeIn() {
  useLayoutEffect(() => {
    gsap.to('.fade-in', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
    })
  }, [])
}
