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
    <header className="sticky top-0 z-40 border-b-2 border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="sm-container flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-8 min-w-0">
          <Link href="/" className="shrink-0">
            <span className="sm-heading text-2xl text-orange-deep">such.market</span>
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
                      ? 'bg-orange/15 text-orange-deep font-medium'
                      : 'text-mute hover:text-ink hover:bg-mist/70'
                  }`}
                >
                  {item.label}
                  {item.soon && (
                    <span className="ml-1.5 sm-play text-[10px] uppercase tracking-wider text-sky">
                      Soon
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex rounded-xl border-2 border-line bg-white p-0.5">
            <button
              type="button"
              onClick={() => setChainId(base.id)}
              className={`rounded-lg px-2.5 py-1 text-xs ${
                chainId === base.id ? 'bg-sky-deep text-white' : 'text-mute hover:text-ink'
              }`}
            >
              Base
            </button>
            <button
              type="button"
              onClick={() => setChainId(baseSepolia.id)}
              className={`rounded-lg px-2.5 py-1 text-xs ${
                chainId === baseSepolia.id ? 'bg-sky-deep text-white' : 'text-mute hover:text-ink'
              }`}
            >
              Sepolia
            </button>
          </div>
          <WalletButton />
        </div>
      </div>

      <nav
        className="md:hidden flex gap-1 overflow-x-auto border-t-2 border-line px-4 py-2"
        aria-label="Mobile"
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-full px-3 py-1 text-xs ${
              pathname?.startsWith(item.href)
                ? 'bg-orange/15 text-orange-deep'
                : 'text-mute'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
