import { useEffect, useRef } from 'react'

export function ShootingStar() {
  const layerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return

    const createStar = () => {
      const star = document.createElement('div')
      star.className = 'shooting-star'
      star.style.top = `${Math.random() * 60}px`
      star.style.left = '-200px'
      star.style.setProperty('--random', Math.random().toFixed(3))
      layer.appendChild(star)
      setTimeout(() => star.remove(), 13000)
    }

    const schedule = () => {
      createStar()
      const delay = Math.random() * 8000 + 12000
      timer = window.setTimeout(schedule, delay)
    }

    let timer = window.setTimeout(schedule, 2000)
    return () => clearTimeout(timer)
  }, [])

  return <div ref={layerRef} className="shooting-star-layer" />
}
