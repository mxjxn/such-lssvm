'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { base, baseSepolia } from 'viem/chains'

export function SiteHeader() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-obsidian/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 shrink-0 rounded-sm flex items-center justify-center font-display text-gold text-lg border border-gold/40 bg-imperial/50"
            aria-hidden
          >
            S
          </div>
          <div className="min-w-0">
            <div className="font-display text-sm md:text-base uppercase tracking-[0.25em] text-champagne group-hover:text-gold-light transition-colors truncate">
              Suchmarket
            </div>
            <div className="font-serif text-xs italic text-champagne/50 hidden sm:block">
              Fine Art Liquidity Exchange
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-2 md:gap-4" aria-label="Main">
          <Link
            href={`/create/${base.id}`}
            className="sm-btn-secondary hidden sm:inline-block"
          >
            Create Pool
          </Link>
          <Link href={`/create/${baseSepolia.id}`} className="sm-btn-secondary text-[10px] sm:text-xs">
            Sepolia
          </Link>
          {!isHome && (
            <Link href="/" className="font-display text-xs uppercase tracking-widest text-gold/80 hover:text-gold">
              Salon
            </Link>
          )}
        </nav>
      </div>
      <div className="sm-divider opacity-60" />
    </header>
  )
}
