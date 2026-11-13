'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { base, baseSepolia } from 'viem/chains'
import { WalletButton } from './WalletButton'
import { useAppChain } from '@/contexts/ChainContext'

const NAV = [
  { href: '/explore', label: 'Explore' },
  { href: '/create', label: 'Create pool' },
  { href: '/launch', label: 'Launch' },
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
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="sm-container flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-8 min-w-0">
          <Link href="/" className="shrink-0">
            <span className="font-display text-xl tracking-tight text-ink">such.market</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-1.5 text-sm transition ${
                    active ? 'bg-mist text-ink' : 'text-mute hover:text-ink hover:bg-mist/70'
                  }`}
                >
                  {item.label}
                  {item.soon && (
                    <span className="ml-1.5 text-[10px] uppercase tracking-wider text-soft">Soon</span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex rounded-md border border-line bg-white p-0.5">
            <button
              type="button"
              onClick={() => setChainId(base.id)}
              className={`rounded px-2.5 py-1 text-xs ${
                chainId === base.id ? 'bg-ink text-white' : 'text-mute hover:text-ink'
              }`}
            >
              Base
            </button>
            <button
              type="button"
              onClick={() => setChainId(baseSepolia.id)}
              className={`rounded px-2.5 py-1 text-xs ${
                chainId === baseSepolia.id ? 'bg-ink text-white' : 'text-mute hover:text-ink'
              }`}
            >
              Sepolia
            </button>
          </div>
          <WalletButton />
        </div>
      </div>

      {/* Mobile nav */}
      <nav
        className="md:hidden flex gap-1 overflow-x-auto border-t border-line px-4 py-2"
        aria-label="Mobile"
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-full px-3 py-1 text-xs ${
              pathname?.startsWith(item.href) ? 'bg-mist text-ink' : 'text-mute'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
