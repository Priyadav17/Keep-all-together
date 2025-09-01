"use client"

import { useEffect, useRef } from "react"

export default function StarryBackground({
  density = 1,
  compact = false,
  showMoon = true,
  opacity = 1,
}: {
  density?: number
  compact?: boolean
  showMoon?: boolean
  opacity?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf = 0
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))

    ctx.imageSmoothingEnabled = true

    const isDark = () =>
      document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark"

    const colors = () => {
      if (isDark()) {
        return {
          star: "rgba(255,255,255,0.9)",
          starDim: "rgba(255,255,255,0.55)",
          moon: "#FFE3D6",
        }
      }
      return {
        star: "rgba(147,197,253,0.9)", // light blue
        starDim: "rgba(147,197,253,0.55)",
        moon: "#E76F51", // coral accent
      }
    }

    const resize = () => {
      const parent = canvas.parentElement
      const w = parent ? parent.clientWidth : window.innerWidth
      const h = parent ? parent.clientHeight : 400
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    type Star = { x: number; y: number; r: number; tw: number; phase: number; vx: number; vy: number }
    let stars: Star[] = []
    let craterParams: { ang: number; dist: number; rFactor: number }[] = []
    let lastT = 0

    const seedStars = () => {
      const parent = canvas.parentElement
      const w = parent ? parent.clientWidth : window.innerWidth
      const h = parent ? parent.clientHeight : 400
      const base = Math.floor((w * h) / 12000) + 40
      const count = Math.max(20, Math.floor(base * density * (compact ? 0.5 : 1))) // density + compact

      craterParams = Array.from({ length: 6 }).map(() => ({
        ang: Math.random() * Math.PI * 2,
        dist: 0.2 + Math.random() * 0.5,
        rFactor: 0.06 + Math.random() * 0.18,
      }))

      stars = Array.from({ length: count }).map(() => {
        const r = Math.random() * 1.4 + 0.6
        const angle = Math.random() * Math.PI * 2
        const speed = 6 + Math.random() * 12
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          tw: Math.random() * 0.02 + 0.01,
          phase: Math.random() * Math.PI * 2,
          vx: Math.cos(angle) * speed * (0.4 + 0.6 * (1.8 - r)),
          vy: Math.sin(angle) * speed * (0.4 + 0.6 * (1.8 - r)),
        }
      })
      lastT = 0
    }

    const draw = (t: number) => {
      const { star, starDim, moon } = colors()
      const parent = canvas.parentElement
      const w = parent ? parent.clientWidth : window.innerWidth
      const h = parent ? parent.clientHeight : 400

      const dt = lastT === 0 ? 1 / 60 : Math.min(0.05, t - lastT)
      lastT = t

      ctx.clearRect(0, 0, w, h)

      ctx.save()
      ctx.globalAlpha = opacity

      if (showMoon && !compact) {
        const moonR = Math.max(28, Math.min(56, Math.floor(w * 0.04)))
        const moonX = w - moonR - 24
        const moonY = 24 + moonR
        ctx.beginPath()
        ctx.fillStyle = moon
        ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = isDark() ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.15)"
        for (let i = 0; i < craterParams.length; i++) {
          const p = craterParams[i]
          const r = moonR * p.rFactor
          const cx = moonX + Math.cos(p.ang) * (moonR * p.dist)
          const cy = moonY + Math.sin(p.ang) * (moonR * p.dist)
          ctx.beginPath()
          ctx.arc(cx, cy, r, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      const margin = 24
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        s.x += s.vx * dt
        s.y += s.vy * dt

        if (s.x > w + margin) s.x = -margin
        if (s.x < -margin) s.x = w + margin
        if (s.y > h + margin) s.y = -margin
        if (s.y < -margin) s.y = h + margin

        const tw = (Math.sin(t * s.tw + s.phase) + 1) / 2
        const r = s.r * (0.6 + tw * 0.8)

        ctx.fillStyle = tw > 0.5 ? star : starDim
        const size = Math.max(0.8, r)
        const px = s.x
        const py = s.y
        ctx.beginPath()
        ctx.arc(px, py, size, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }

    const onFrame = (ts: number) => {
      draw(ts / 1000)
      raf = requestAnimationFrame(onFrame)
    }

    const onResize = () => {
      resize()
      seedStars()
    }

    resize()
    seedStars()
    raf = requestAnimationFrame(onFrame)

    window.addEventListener("resize", onResize)
    const mutation = new MutationObserver(() => {
      seedStars()
    })
    mutation.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      mutation.disconnect()
    }
  }, [density, compact, showMoon, opacity])

  return (
    <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
