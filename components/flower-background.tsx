"use client"

import { useEffect, useRef } from "react"

type Flower = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  petals: number
  rotation: number
  rotationSpeed: number
  twinkle: number
  colorIndex: number // new: select from palette
}

function getThemeMode() {
  if (typeof document === "undefined") return "light"
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

function getPalette(mode: "light" | "dark") {
  const lightBlue = "rgba(147, 197, 253, 0.85)" // tailwind blue-300
  const blue = "rgba(96, 165, 250, 0.85)" // tailwind blue-400
  const deepBlue = "rgba(59, 130, 246, 0.85)" // tailwind blue-500
  return {
    petals: mode === "dark" ? [lightBlue, blue, deepBlue] : [lightBlue, deepBlue, blue],
    centerLight: "rgba(255,255,255,0.9)", // bright center on dark
    centerDark: "rgba(37, 99, 235, 0.9)", // primary blue center on light
  }
}

export default function FlowerBackground({
  density = 26,
}: {
  density?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const flowersRef = useRef<Flower[]>([])
  const dprRef = useRef<number>(1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      dprRef.current = dpr
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    const initFlowers = () => {
      const rect = canvas.getBoundingClientRect()
      const count = density
      const arr: Flower[] = []
      for (let i = 0; i < count; i++) {
        const size = 6 + Math.random() * 14
        const speed = 0.1 + Math.random() * 0.5
        arr.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (-0.15 - Math.random() * 0.35) * speed, // gently float upward
          size,
          petals: 5 + Math.floor(Math.random() * 2), // 5-6 petals
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.003,
          twinkle: Math.random() * 0.4 + 0.6,
          colorIndex: Math.floor(Math.random() * 3), // choose one of 3 petal colors
        })
      }
      flowersRef.current = arr
    }

    const drawFlower = (f: Flower) => {
      const mode = getThemeMode()
      const palette = getPalette(mode)
      const petalColor = palette.petals[f.colorIndex % palette.petals.length]
      const centerColor = mode === "dark" ? palette.centerLight : palette.centerDark

      ctx.save()
      ctx.translate(f.x, f.y)
      ctx.rotate(f.rotation)

      const tw = 0.9 + Math.sin(performance.now() * 0.001 + f.x * 0.01) * 0.1 * f.twinkle
      const petalW = f.size * 0.45 * tw
      const petalH = f.size * 0.9 * tw

      ctx.shadowBlur = 12
      ctx.shadowColor = petalColor
      ctx.fillStyle = petalColor

      for (let i = 0; i < f.petals; i++) {
        ctx.save()
        const angle = (i * (Math.PI * 2)) / f.petals
        ctx.rotate(angle)
        ctx.beginPath()
        ctx.ellipse(0, f.size * 0.35, petalW, petalH, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      ctx.shadowBlur = 8
      ctx.shadowColor = centerColor
      ctx.fillStyle = centerColor
      ctx.beginPath()
      ctx.arc(0, 0, f.size * 0.22, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    const step = () => {
      const rect = canvas.getBoundingClientRect()
      // Clear background subtly instead of full clear to leave a soft trail effect minimal (still opaque)
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Draw a faint vignette to add depth without gradients elsewhere
      ctx.save()
      const mode = getThemeMode()
      ctx.fillStyle = mode === "dark" ? "rgba(17,24,39,0.05)" : "rgba(0,0,0,0.03)"
      ctx.fillRect(0, 0, rect.width, rect.height)
      ctx.restore()

      for (const f of flowersRef.current) {
        // Move
        f.x += f.vx * 1.2
        f.y += f.vy * 1.2
        f.rotation += f.rotationSpeed

        // Wrap around edges
        if (f.x < -30) f.x = rect.width + 30
        if (f.x > rect.width + 30) f.x = -30
        if (f.y < -30) f.y = rect.height + 30
        if (f.y > rect.height + 30) f.y = -30

        drawFlower(f)
      }

      rafRef.current = requestAnimationFrame(step)
    }

    const handleThemeChange = () => {
      // Force a redraw next frame by clearing; colors are read per frame
    }

    resize()
    initFlowers()
    rafRef.current = requestAnimationFrame(step)
    window.addEventListener("resize", () => {
      resize()
      // keep relative positions on resize by re-initializing lightly
      initFlowers()
    })
    // Observe theme toggles
    const observer = new MutationObserver(handleThemeChange)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      observer.disconnect()
    }
  }, [density])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden hidden dark:block">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
