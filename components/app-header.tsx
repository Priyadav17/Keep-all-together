"use client"

import Link from "next/link"
import { useRouter } from "next/navigation" // router for sign out
import { Button } from "@/components/ui/button"
import { FontToggle } from "./font-toggle"
import { ThemeToggle } from "./theme-toggle"
import { Logo } from "./logo"

export function AppHeader() {
  const router = useRouter() // initialize router

  function handleSignOut() {
    try {
      localStorage.removeItem("demo-auth")
    } catch {}
    router.replace("/")
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo className="h-6 w-6" />
          <span className="heading-font text-sm tracking-tight">KeepAll</span>
        </Link>
        <div className="flex items-center gap-2">
          <FontToggle />
          <ThemeToggle />
          <Button variant="ghost" onClick={handleSignOut} aria-label="Sign out">
            Sign out
          </Button>
        </div>
      </div>
    </header>
  )
}
