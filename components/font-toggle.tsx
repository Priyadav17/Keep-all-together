"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Type } from "lucide-react"

const KEY = "font-mode" // 'press' | 'sans'

export function FontToggle() {
  const [mode, setMode] = useState<"press" | "sans">("press")

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem(KEY)) as "press" | "sans" | null
    if (saved) setMode(saved)
  }, [])

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-font", mode)
      localStorage.setItem(KEY, mode)
    }
  }, [mode])

  return (
    <Button
      variant="outline"
      onClick={() => setMode(mode === "press" ? "sans" : "press")}
      aria-label="Toggle heading font"
    >
      <Type className="mr-2 h-4 w-4" />
      {mode === "press" ? "Press 2P" : "Sans"}
    </Button>
  )
}
