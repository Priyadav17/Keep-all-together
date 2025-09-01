"use client"

import { useEffect, useRef, useState } from "react"

const EMOJIS = [
  "🌸",
  "🌼",
  "💌",
  "✨",
  "🫶",
  "💖",
  "🧋",
  "🍡",
  "🎀",
  "🐾",
  "🌙",
  "⭐",
  "🍓",
  "🪽",
  "😊",
  "🥰",
  "🌟",
  "🎐",
  "🧸",
  "🌈",
]

export function EmojiPicker({ onPick }: { onPick: (emoji: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border px-2.5 py-1.5 text-sm bg-card hover:bg-accent/20 transition-colors"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Add emoji ✨
      </button>
      {open && (
        <div role="dialog" className="absolute z-10 mt-2 w-52 rounded-md border bg-popover p-2 shadow">
          <div className="grid grid-cols-6 gap-1.5">
            {EMOJIS.map((e) => (
              <button
                key={e}
                className="h-8 w-8 rounded hover:bg-accent/30 transition"
                onClick={() => {
                  onPick(e)
                  setOpen(false)
                }}
                aria-label={`Insert ${e}`}
              >
                <span className="text-lg">{e}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
