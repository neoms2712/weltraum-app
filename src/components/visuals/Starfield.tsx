import { useEffect, useRef } from 'react'

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = 280
    }

    resize()
    window.addEventListener('resize', resize)

    const w = () => canvas.width
    const h = () => canvas.height

    const stars = Array.from({ length: 90 }).map(() => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      opacity: Math.random() * 0.7 + 0.2,
      size: Math.random() * 1.2 + 0.3,
      speed: Math.random() * 0.05 + 0.02,
    }))

    let frame: number
    const animate = () => {
      ctx.clearRect(0, 0, w(), h())
      for (const s of stars) {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`
        ctx.fill()
        s.opacity += (Math.random() - 0.5) * 0.02
        s.opacity = Math.max(0.1, Math.min(0.9, s.opacity))
      }
      frame = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="starfield starfield-wrapper">
      <canvas ref={canvasRef} className="starfield-canvas" />
    </div>
  )
}
