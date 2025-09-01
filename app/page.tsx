"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { FontToggle } from "@/components/font-toggle"
import AestheticWrapper from "@/components/aesthetic-wrapper"
import StarryBackground from "@/components/starry-background"

const KEY = "demo-auth"

export default function HomePage() {
  const router = useRouter()
  useEffect(() => {
    const isAuthed = localStorage.getItem(KEY)
    if (isAuthed) router.replace("/dashboard")
  }, [router])

  return (
    <AestheticWrapper>
      <main className="relative mx-auto grid min-h-screen max-w-3xl content-center gap-6 px-4 text-foreground">
        <StarryBackground />
        <div className="relative z-10 text-center">
          {/* existing code */}
          <div className="mx-auto mb-3 h-12 w-12 rounded-lg border bg-accent" aria-hidden />
          <h1 className="heading-font text-3xl font-bold text-balance">KeepAll Organizer</h1>
          <p className="mt-2 text-pretty text-sm text-muted-foreground">
            Aesthetic diary envelope, beautiful gallery, link keeper with YouTube, and a watchlist — all in one.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
            <div className="flex items-center gap-2">
              <FontToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </main>
    </AestheticWrapper>
  )
}
