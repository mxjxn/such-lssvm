'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function SiteFooter() {
  const pathname = usePathname()
  if (pathname?.startsWith('/embed')) return null

  return (
    <footer className="mt-auto border-t border-line bg-paper">
      <div className="sm-container py-10 flex flex-col sm:flex-row gap-6 sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-lg text-ink">such.market</p>
          <p className="mt-1 max-w-md text-sm text-mute leading-relaxed">
            NFT AMM pools on Base — the sales home for the cryptoart ecosystem.
            Studio launches contracts; social embeds the market; auctions arrive here next.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-mute">
          <Link href="/explore" className="hover:text-ink">
            Explore
          </Link>
          <Link href="/create" className="hover:text-ink">
            Create pool
          </Link>
          <Link href="/auctions" className="hover:text-ink">
            Auctions
          </Link>
          <a
            href="https://github.com/mxjxn/such-lssvm"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink"
          >
            Protocol
          </a>
        </div>
      </div>
    </footer>
  )
}
