'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function SiteFooter() {
  const pathname = usePathname()
  if (pathname?.startsWith('/embed')) return null

  return (
    <footer className="mt-auto border-t-2 border-line bg-mist/40">
      <div className="sm-container py-10 flex flex-col sm:flex-row gap-6 sm:items-end sm:justify-between">
        <div>
          <p className="sm-heading text-xl text-orange-deep">such.market</p>
          <p className="mt-1 max-w-md text-sm text-mute leading-relaxed">
            NFT AMM pools on Base — the sales home for the cryptoart ecosystem. Studio launches
            contracts; social embeds the market; auctions arrive here next.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-mute">
          <Link href="/explore" className="hover:text-sky-deep">
            Explore
          </Link>
          <Link href="/create" className="hover:text-sky-deep">
            Create pool
          </Link>
          <Link href="/auctions" className="hover:text-sky-deep">
            Auctions
          </Link>
          <a
            href="https://github.com/mxjxn/such-lssvm"
            target="_blank"
            rel="noreferrer"
            className="hover:text-sky-deep"
          >
            Protocol
          </a>
        </div>
      </div>
    </footer>
  )
}
