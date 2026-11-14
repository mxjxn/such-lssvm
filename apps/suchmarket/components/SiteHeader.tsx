'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { base, baseSepolia } from 'viem/chains'
import { WalletButton } from './WalletButton'
import { useAppChain } from '@/contexts/ChainContext'

const NAV = [
  { href: '/explore', label: 'Explore' },
  { href: '/create', label: 'Create pool' },
  { href: '/my-pools', label: 'My pools' },
  { href: '/auctions', label: 'Auctions', soon: true },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { chainId, setChainId } = useAppChain()

  if (pathname?.startsWith('/embed')) {
    return null
  }

  return (
    <header className="sm-header-bar sticky top-0 z-40 shadow-md">
      <div className="sm-container flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-8 min-w-0">
          <Link href="/" className="shrink-0">
            <span className="sm-heading text-2xl text-white drop-shadow-sm">such.market</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-3 py-1.5 text-sm transition ${
                    active
                      ? 'bg-white text-orange-deep font-medium shadow-sm'
                      : 'text-white/90 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  {item.label}
                  {item.soon && (
                    <span
                      className={`ml-1.5 sm-play text-[10px] uppercase tracking-wider ${
                        active ? 'text-sky-deep' : 'text-white/80'
                      }`}
                    >
                      Soon
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex rounded-xl border-2 border-white/40 bg-black/15 p-0.5">
            <button
              type="button"
              onClick={() => setChainId(base.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                chainId === base.id
                  ? 'bg-white text-sky-deep'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              Base
            </button>
            <button
              type="button"
              onClick={() => setChainId(baseSepolia.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                chainId === baseSepolia.id
                  ? 'bg-white text-sky-deep'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              Sepolia
            </button>
          </div>
          <WalletButton onBrand />
        </div>
      </div>

      <nav
        className="md:hidden flex gap-1 overflow-x-auto border-t border-white/25 px-4 py-2"
        aria-label="Mobile"
      >
        {NAV.map((item) => {
          const active = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                active ? 'bg-white text-orange-deep font-medium' : 'text-white/90 bg-white/10'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
