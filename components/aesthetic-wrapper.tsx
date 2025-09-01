"use client"
import type { ReactNode } from "react"
import "../styles/theme-overrides.css"

export default function AestheticWrapper({ children }: { children: ReactNode }) {
  return <div className="peach-theme min-h-dvh">{children}</div>
}
