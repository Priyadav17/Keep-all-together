import { AppHeader } from "@/components/app-header"
import { EnvelopeLetter } from "@/components/envelope-letter"
import { GalleryGrid } from "@/components/gallery-grid"
import { LinksManager } from "@/components/links-manager"
import { Watchlist } from "@/components/watchlist"
import AestheticWrapper from "@/components/aesthetic-wrapper"

export default function DashboardPage() {
  return (
    <AestheticWrapper>
      <main>
        <AppHeader />
        <section className="mx-auto max-w-6xl px-4 py-6 text-foreground">
          <h1 className="heading-font text-2xl font-bold text-balance">Your Space</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Capture letters, collect images, save links, and queue shows to watch later.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <EnvelopeLetter />
            <GalleryGrid />
            <LinksManager />
            <Watchlist />
          </div>
        </section>
      </main>
    </AestheticWrapper>
  )
}
