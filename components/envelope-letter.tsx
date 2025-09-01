"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import StarryBackground from "@/components/starry-background"
import { EmojiPicker } from "@/components/envelope-emoji-picker"
import { PenIcon } from "@/components/icons"

type Entry = { id: string; title: string; content: string; createdAt: string }
const KEY = "diary-entries"

const getLS = (key: string) => {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(key) || "[]")
  } catch {
    return []
  }
}
const setLS = (key: string, value: unknown) => {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

export function EnvelopeLetter() {
  const { data: entries = [], mutate } = useSWR<Entry[]>(KEY, () => getLS(KEY), { fallbackData: [] })
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [open, setOpen] = useState(true)
  const [selStart, setSelStart] = useState<number | null>(null)
  const [selEnd, setSelEnd] = useState<number | null>(null)
  const textareaId = "letter-textarea"

  function save() {
    if (!title.trim() && !content.trim()) return
    const next: Entry[] = [
      {
        id: crypto.randomUUID(),
        title: title.trim() || "Untitled",
        content: content.trim(),
        createdAt: new Date().toISOString(),
      },
      ...entries,
    ]
    setLS(KEY, next)
    mutate(next, false)
    setTitle("")
    setContent("")
  }

  function remove(id: string) {
    const next = entries.filter((e) => e.id !== id)
    setLS(KEY, next)
    mutate(next, false)
  }

  function insertEmoji(emoji: string) {
    const ta = document.getElementById(textareaId) as HTMLTextAreaElement | null
    if (!ta) {
      setContent((v) => v + emoji)
      return
    }
    const start = ta.selectionStart ?? selStart ?? content.length
    const end = ta.selectionEnd ?? selEnd ?? content.length
    const next = content.slice(0, start) + emoji + content.slice(end)
    setContent(next)
    requestAnimationFrame(() => {
      const pos = start + emoji.length
      ta.selectionStart = ta.selectionEnd = pos
      ta.focus()
    })
  }

  return (
    <section className="tile relative overflow-hidden wm-letter supports-[backdrop-filter]:backdrop-blur-sm">
      <StarryBackground density={0.8} compact showMoon={false} opacity={0.18} />
      <div className="envelope">
        <div className="envelope-flap" aria-hidden />
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold heading-font">
            <PenIcon className="h-5 w-5" />
            Write a Letter
          </h2>
          <div className="wax-seal" aria-hidden />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Aesthetic letter-style diary. Saved locally to your browser.
        </p>

        <div className="mt-4 grid gap-3">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea
            id={textareaId}
            placeholder="Your words..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onSelect={(e) => {
              const el = e.target as HTMLTextAreaElement
              setSelStart(el.selectionStart)
              setSelEnd(el.selectionEnd)
            }}
            rows={5}
          />
          <div className="flex items-center justify-between">
            <EmojiPicker onPick={insertEmoji} />
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => setContent((v) => v + "\n✨")}>
                Add sparkle
              </Button>
              <Button onClick={save}>Save Letter</Button>
            </div>
          </div>
        </div>

        <button className="mt-4 text-sm text-primary underline" onClick={() => setOpen(!open)} aria-expanded={open}>
          {open ? "Hide previous letters" : "Show previous letters"}
        </button>

        {open && (
          <ul className="mt-3 space-y-3">
            {entries.map((e) => (
              <li key={e.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium heading-font">{e.title}</h3>
                  <button
                    className="text-xs text-red-600 hover:underline"
                    onClick={() => remove(e.id)}
                    aria-label={`Delete ${e.title}`}
                  >
                    Delete
                  </button>
                </div>
                <p className="mt-1 text-sm whitespace-pre-wrap">{e.content}</p>
                <p className="mt-2 text-xs text-muted-foreground">{new Date(e.createdAt).toLocaleString()}</p>
              </li>
            ))}
            {entries.length === 0 && <li className="text-sm text-muted-foreground">No letters yet.</li>}
          </ul>
        )}
      </div>
    </section>
  )
}
