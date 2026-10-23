import { useEffect, useRef } from 'react'
import { cssVar } from '../../lib/theme'
import { cn } from '../../lib/cn'

/**
 * Animated two-colour halftone field (the hero visual from the inspiration video).
 * A dot of colour B sits in every grid cell over a colour-A background; dot radius
 * follows a slowly drifting noise field, so B "pools" into blobs and drains away.
 *
 * <Halftone />                                   -> primary over accent, theme-aware
 * <Halftone colors={['--ink', '--primary']} />   -> any CSS var or literal colour
 */
export function Halftone({ colors = ['--primary', '--accent'], cell = 10, speed = 1, interactive = true, className }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let visible = true
    let palette = ['#000', '#fff']
    const pointer = { x: -1e4, y: -1e4, strength: 0 }
    const start = performance.now() - Math.random() * 20000

    const readColors = () => {
      palette = colors.map((c) => (c.startsWith('--') ? cssVar(c) || '#000' : c))
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      if (reduced) draw(start + 8000)
    }

    const field = (x, y, t) => {
      let n =
        Math.sin(x * 1.25 + t * 0.7 + Math.sin(y * 0.9 + t * 0.3) * 1.6) *
        Math.cos(y * 1.05 - t * 0.5 + Math.sin(x * 0.65 - t * 0.25) * 1.3)
      n += 0.55 * Math.sin((x - y) * 0.75 + t * 0.9)
      n += 0.3 * Math.cos(x * 2.1 + y * 1.7 - t * 1.1)
      let v = 0.5 + n * 0.36
      v = Math.min(1, Math.max(0, (v - 0.18) / 0.64))
      return v * v * (3 - 2 * v) // smoothstep for crisp blobs
    }

    function draw(now) {
      const t = ((now - start) / 1000) * 0.35 * speed
      const step = cell * dpr
      const cols = Math.ceil(canvas.width / step) + 1
      const rows = Math.ceil(canvas.height / step) + 1
      const scale = 1 / (165 * dpr) // noise units per device pixel — lower divisor = smaller blobs
      const px = pointer.x * dpr
      const py = pointer.y * dpr
      const reach = 160 * dpr

      ctx.fillStyle = palette[0]
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = palette[1]
      ctx.beginPath()
      for (let j = 0; j < rows; j++) {
        const cy = j * step
        for (let i = 0; i < cols; i++) {
          const cx = i * step
          let v = field(cx * scale, cy * scale, t)
          if (pointer.strength > 0.01) {
            const d = Math.hypot(cx - px, cy - py)
            if (d < reach) v = Math.min(1, v + (1 - d / reach) ** 2 * pointer.strength)
          }
          const r = step * (0.08 + 0.64 * v)
          ctx.moveTo(cx + r, cy)
          ctx.arc(cx, cy, r, 0, Math.PI * 2)
        }
      }
      ctx.fill()
    }

    const loop = (now) => {
      pointer.strength *= 0.94
      if (visible) draw(now)
      raf = requestAnimationFrame(loop)
    }

    readColors()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    // Re-read colours when theme/palette attributes change.
    const mo = new MutationObserver(() => {
      readColors()
      if (reduced) draw(start + 8000)
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-palette', 'style'] })

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.strength = Math.min(0.9, pointer.strength + 0.12)
    }
    if (interactive && !reduced) canvas.addEventListener('pointermove', onMove)

    if (reduced) draw(start + 8000)
    else raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointermove', onMove)
    }
  }, [colors.join(','), cell, speed, interactive])

  return <canvas ref={canvasRef} aria-hidden="true" className={cn('block h-full w-full', className)} />
}
