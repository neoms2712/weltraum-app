import { useEffect, useRef } from 'react'

export function useRevealSection<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('is-visible')
        } else {
          element.classList.remove('is-visible')
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [])

  return ref
}
