export function PenIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 17.25V21h3.75L18.81 8.94l-3.75-3.75L3 17.25z" fill="#E76F51" />
      <path
        d="M20.71 7.04a1 1 0 0 0 0-1.42l-2.34-2.34a1 1 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"
        fill="#93C5FD"
      />
    </svg>
  )
}
