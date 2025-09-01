"use client"

import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import StarryBackground from "@/components/starry-background"

type ImgItem = { id: string; url: string; alt?: string; createdAt: string }
const KEY = "gallery-items"

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

export function GalleryGrid() {
  const { data: items = [], mutate } = useSWR<ImgItem[]>(KEY, () => getLS(KEY), { fallbackData: [] })
  const [url, setUrl] = useState("")
  const [alt, setAlt] = useState("")

  async function addFromFile(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const next: ImgItem[] = [
        { id: crypto.randomUUID(), url: dataUrl, alt, createdAt: new Date().toISOString() },
        ...items,
      ]
      setLS(KEY, next)
      mutate(next, false)
      setAlt("")
    }
    reader.readAsDataURL(file)
  }

  function addFromUrl() {
    if (!url.trim()) return
    const next: ImgItem[] = [
      { id: crypto.randomUUID(), url: url.trim(), alt, createdAt: new Date().toISOString() },
      ...items,
    ]
    setLS(KEY, next)
    mutate(next, false)
    setUrl("")
    setAlt("")
  }

  function remove(id: string) {
    const next = items.filter((i) => i.id !== id)
    setLS(KEY, next)
    mutate(next, false)
  }

  return (
    <section className="tile relative overflow-hidden rounded-xl border bg-card p-4 text-card-foreground wm-gallery supports-[backdrop-filter]:backdrop-blur-sm">
      <StarryBackground density={0.8} compact showMoon={false} opacity={0.18} />
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold heading-font text-balance">Image Gallery</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Collect images by URL or upload. Saved locally.</p>

      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <div className="col-span-2 grid gap-2 sm:grid-cols-2">
          <Input placeholder="Image URL" value={url} onChange={(e) => setUrl(e.target.value)} className="min-w-0" />
          <Input
            placeholder="Alt text (description)"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="min-w-0"
          />
        </div>
        <div className="flex items-stretch gap-2 sm:flex-row flex-col">
          <Button onClick={addFromUrl} className="flex-1">
            Add URL
          </Button>
          <label className="flex-1">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) addFromFile(f)
              }}
            />
            <span className="inline-flex w-full cursor-pointer items-center justify-center rounded-md border bg-background px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
              Upload
            </span>
          </label>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items.map((img) => (
          <figure key={img.id} className="group overflow-hidden rounded-lg border bg-card">
            <img
              src={img.url || "/placeholder.svg?height=160&width=240&query=gallery%20image%20placeholder"}
              alt={img.alt || "User image"}
              className="h-40 w-full object-cover transition-transform group-hover:scale-105"
              crossOrigin="anonymous"
            />
            <figcaption className="flex items-center justify-between p-2">
              <span className="line-clamp-1 text-xs">{img.alt || "Image"}</span>
              <button className="text-xs text-red-600 hover:underline" onClick={() => remove(img.id)}>
                Remove
              </button>
            </figcaption>
          </figure>
        ))}
        {items.length === 0 && <p className="col-span-full text-sm text-muted-foreground">No images yet.</p>}
      </div>
    </section>
  )
}
