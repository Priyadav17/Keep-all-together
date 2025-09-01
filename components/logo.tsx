export function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" role="img" aria-label="Logo" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" fill="#93C5FD" />
      {/* subtle outline */}
      <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(37,99,235,0.25)" strokeWidth="2" />
      {/* blue star */}
      <path d="M24 14l2.1 6.2h6.5l-5.2 3.8 2 6.2-5.4-3.9-5.4 3.9 2-6.2-5.2-3.8h6.5L24 14z" fill="#2563EB" />
      <title>KeepAll</title>
    </svg>
  )
}
