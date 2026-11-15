'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getEnabledChainIds, getChainName, type SupportedChainId } from '@/lib/chains'
import { CONFIG } from '@/lib/config'
import { WalletButton } from './WalletButton'
import { useAppChain } from '@/contexts/ChainContext'

const NAV: { href: string; label: string }[] = [
  { href: '/explore', label: 'Explore' },
  { href: '/create', label: 'Create pool' },
  { href: '/my-pools', label: 'My pools' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { chainId, setChainId } = useAppChain()
  const enabledChains = getEnabledChainIds()

  return (
    <header className="sm-header-bar sticky top-0 z-40 shadow-md">
      <div className="sm-container flex min-h-[4rem] items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-6 min-w-0">
          <Link href="/explore" className="shrink-0">
            <span className="sm-wordmark text-lg text-white">{CONFIG.APP_NAME}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? 'bg-white text-accent-deep font-medium'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {enabledChains.length > 0 ? (
            <div className="hidden sm:flex rounded-lg border border-white/25 p-1 gap-1 overflow-x-auto max-w-[220px]">
              {enabledChains.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setChainId(id as SupportedChainId)}
                  className={`shrink-0 rounded-md px-2 py-1 text-xs ${
                    chainId === id ? 'bg-white text-accent-deep' : 'text-white/85 hover:bg-white/10'
                  }`}
                >
                  {getChainName(id)}
                </button>
              ))}
            </div>
          ) : (
            <span className="hidden sm:inline text-xs text-white/70">Set factory/router env vars</span>
          )}
          <WalletButton onBrand />
        </div>
      </div>

      <nav className="md:hidden flex gap-2 overflow-x-auto border-t border-white/20 px-4 py-2" aria-label="Mobile">
        {NAV.map((item) => {
          const active = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-full px-3 py-1 text-sm ${
                active ? 'bg-white text-accent-deep' : 'text-white/90 bg-white/10'
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