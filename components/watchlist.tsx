"use client"

import useSWR from "swr"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

type Item = {
  id: string
  title: string
  category: "Anime" | "Movie" | "Drama"
  status: "Planned" | "Watching" | "Completed"
  createdAt: string
}
const KEY = "watchlist-items"

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

export function Watchlist() {
  const { data: items = [], mutate } = useSWR<Item[]>(KEY, () => getLS(KEY), { fallbackData: [] })
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<Item["category"]>("Anime")

  function add() {
    if (!title.trim()) return
    const next: Item[] = [
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        category,
        status: "Planned",
        createdAt: new Date().toISOString(),
      },
      ...items,
    ]
    setLS(KEY, next)
    mutate(next, false)
    setTitle("")
  }

  function cycleStatus(id: string) {
    const next = items.map((i) => {
      if (i.id !== id) return i
      const order: Item["status"][] = ["Planned", "Watching", "Completed"]
      const idx = order.indexOf(i.status)
      return { ...i, status: order[(idx + 1) % order.length] }
    })
    setLS(KEY, next)
    mutate(next, false)
  }

  function remove(id: string) {
    const next = items.filter((i) => i.id !== id)
    setLS(KEY, next)
    mutate(next, false)
  }

  return (
    <section className="tile p-4">
      <h2 className="text-lg font-semibold heading-font">Watchlist</h2>
      <p className="mt-1 text-sm text-muted-foreground">Save anime, movies, and dramas to watch later.</p>

      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Select value={category} onValueChange={(v: Item["category"]) => setCategory(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Anime">Anime</SelectItem>
            <SelectItem value="Movie">Movie</SelectItem>
            <SelectItem value="Drama">Drama</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={add}>Add</Button>
      </div>

      <ul className="mt-4 space-y-3">
        {items.map((i) => (
          <li key={i.id} className="flex items-center justify-between rounded-lg border p-3">
            <div className="min-w-0">
              <p className="truncate font-medium">{i.title}</p>
              <p className="text-xs text-muted-foreground">{i.category}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-xs" onClick={() => cycleStatus(i.id)} aria-label="Toggle status">
                <Badge variant="secondary">{i.status}</Badge>
              </button>
              <button className="text-xs text-red-600 hover:underline" onClick={() => remove(i.id)}>
                Remove
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No items yet.</p>}
      </ul>
    </section>
  )
}
