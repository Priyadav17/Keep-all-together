"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

const KEY = "demo-auth"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  useEffect(() => {
    const isAuthed = localStorage.getItem(KEY)
    if (!isAuthed) router.replace("/login")
  }, [router])
  return <>{children}</>
}
