"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { FontToggle } from "@/components/font-toggle"
import FlowerBackground from "@/components/flower-background"
import StarryBackground from "@/components/starry-background"

const KEY = "demo-auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  useEffect(() => {
    const isAuthed = localStorage.getItem(KEY)
    if (isAuthed) router.replace("/dashboard")
  }, [router])

  function completeLogin(withGoogle?: boolean) {
    if (!withGoogle && email && !email.includes("@")) return
    const profile = { email: withGoogle ? "google@example.com" : email, name: name || "You" }
    localStorage.setItem(KEY, JSON.stringify(profile))
    router.push("/dashboard")
  }

  return (
    <main className="relative mx-auto grid min-h-screen max-w-md content-center gap-6 overflow-hidden px-4">
      <FlowerBackground density={30} />
      <div className="text-center">
        <div className="mx-auto mb-3 h-10 w-10 rounded-lg bg-primary/90 ring-4 ring-primary/10" aria-hidden />
        <h1 className="heading-font text-balance text-2xl font-bold">Welcome to KeepAll</h1>
        <p className="mt-1 text-sm text-muted-foreground">Diary, gallery, links, and watchlist in one place.</p>
      </div>

      <div className="relative card rounded-xl border bg-card/80 p-5 shadow-sm backdrop-blur overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <StarryBackground compact density={0.9} showMoon={false} opacity={0.35} />
        </div>

        <div className="relative z-10">
          <label className="text-sm font-medium">Name</label>
          <Input className="mt-2" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          <label className="mt-3 text-sm font-medium">Email</label>
          <Input
            type="email"
            placeholder="you@example.com"
            className="mt-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button className="mt-4 w-full" onClick={() => completeLogin(false)}>
            Continue with Email
          </Button>
          <div className="my-3 text-center text-xs text-muted-foreground">or</div>
          <Button variant="outline" className="w-full bg-transparent" onClick={() => completeLogin(true)}>
            Continue with Google
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Demo sign-in only (no backend). We can wire real email + Google later.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <FontToggle />
        <ThemeToggle />
      </div>
    </main>
  )
}
