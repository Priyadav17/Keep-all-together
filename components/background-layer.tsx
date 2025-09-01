"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Lazy-load heavy canvases to avoid SSR issues
const StarryBackground = dynamic(() => import("./starry-background").then((m) => m.default || (m as any)), {
  ssr: false,
})
const FlowerBackground = dynamic(() => import("./flower-background").then((m) => m.default || (m as any)), {
  ssr: false,
})

export default function BackgroundLayer() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isLight = resolvedTheme === "light"

  return (
    <>
      {/* Stars always on; lighter blue in light mode */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-20">
        <StarryBackground compact opacity={isLight ? 0.5 : 0.35} starColorLight="#93C5FD" showMoon={!isLight} />
      </div>
      {/* Flowers only when NOT light (user requested no flowers in light mode) */}
      {!isLight ? (
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-30">
          <FlowerBackground />
        </div>
      ) : null}
    </>
  )
}
