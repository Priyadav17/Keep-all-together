"use client"

import useSWR from "swr"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import StarryBackground from "@/components/starry-background"

type LinkItem = { id: string; url: string; title?: string; type: "youtube" | "link"; createdAt: string }
const KEY = "saved-links"

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

function parseYouTubeId(u: string): string | null {
  try {
    const url = new URL(u)
    if (url.hostname.includes("youtube.com")) return url.searchParams.get("v")
    if (url.hostname === "youtu.be") return url.pathname.slice(1)
  } catch {}
  return null
}

export function LinksManager() {
  const { data: items = [], mutate } = useSWR<LinkItem[]>(KEY, () => getLS(KEY), { fallbackData: [] })
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")

  function add() {
    if (!url.trim()) return
    const yt = parseYouTubeId(url.trim())
    const next: LinkItem[] = [
      {
        id: crypto.randomUUID(),
        url: url.trim(),
        title: title.trim() || undefined,
        type: yt ? "youtube" : "link",
        createdAt: new Date().toISOString(),
      },
      ...items,
    ]
    setLS(KEY, next)
    mutate(next, false)
    setUrl("")
    setTitle("")
  }

  function remove(id: string) {
    const next = items.filter((i) => i.id !== id)
    setLS(KEY, next)
    mutate(next, false)
  }

  return (
    <section className="tile relative overflow-hidden p-4 rounded-xl border bg-card text-card-foreground wm-links supports-[backdrop-filter]:backdrop-blur-sm">
      <StarryBackground density={0.8} compact showMoon={false} opacity={0.18} />
      <h2 className="text-lg font-semibold heading-font">Saved Links</h2>
      <p className="mt-1 text-sm text-muted-foreground">Store important links and YouTube videos.</p>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <Input placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
        <Input placeholder="Optional title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Button onClick={add}>Save</Button>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {items.map((i) => {
          const ytId = i.type === "youtube" ? parseYouTubeId(i.url) : null
          return (
            <li key={i.id} className="overflow-hidden rounded-lg border">
              {ytId ? (
                <img
                  src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                  alt={i.title || "YouTube thumbnail"}
                  className="h-40 w-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="h-40 w-full bg-muted" />
              )}
              <div className="flex items-center justify-between p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{i.title || i.url}</p>
                  <a className="truncate text-xs text-primary underline" href={i.url} target="_blank" rel="noreferrer">
                    Open
                  </a>
                </div>
                <button className="text-xs text-red-600 hover:underline" onClick={() => remove(i.id)}>
                  Remove
                </button>
              </div>
            </li>
          )
        })}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No links yet.</p>}
      </ul>
    </section>
  )
}
