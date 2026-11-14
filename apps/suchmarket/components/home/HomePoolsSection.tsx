'use client'

import Link from 'next/link'
import { PoolListCard, PoolListItem } from '@/components/PoolListCard'
import { SAMPLE_POOLS } from '@/lib/homeFixtures'

export function HomePoolsSection({
  chainId,
  pools,
  isLoading,
  error,
  preview,
}: {
  chainId: number
  pools: PoolListItem[]
  isLoading: boolean
  error: Error | null
  preview: boolean
}) {
  const showSamples = preview && pools.length === 0 && !isLoading
  const items = showSamples ? SAMPLE_POOLS : pools

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(ellipse 70% 50% at 85% 0%, rgba(44,95,79,0.10), transparent), radial-gradient(ellipse 40% 35% at 5% 90%, rgba(166,93,78,0.06), transparent)',
        }}
      />
      <div className="sm-container relative py-10 md:py-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="font-display text-3xl md:text-5xl tracking-tight text-ink leading-[1.05]">
              such.market
            </p>
            <h1 className="mt-3 text-base md:text-lg text-mute font-normal max-w-xl leading-relaxed">
              Recent pools — buy and sell on a bonding curve.
            </h1>
          </div>
          <Link href="/explore" className="sm-btn-secondary shrink-0 self-start md:self-auto">
            Explore all
          </Link>
        </div>

        {showSamples && (
          <p className="mb-4 text-xs uppercase tracking-[0.12em] text-soft">
            Sample data · preview mode — not on-chain
          </p>
        )}

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-busy aria-label="Loading pools">
            {[0, 1, 2].map((i) => (
              <div key={i} className="sm-card p-4 h-[132px] animate-pulse bg-mist/80 border-line" />
            ))}
          </div>
        ) : error && !showSamples ? (
          <div className="sm-card p-8 text-center">
            <p className="text-clay text-sm font-medium">Could not load pools</p>
            <p className="mt-2 text-xs text-mute">{error.message}</p>
            <Link href="/explore" className="sm-btn-secondary inline-flex mt-6">
              Try explore
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-white/60 px-6 py-14 text-center">
            <p className="font-display text-xl text-ink">No pools yet</p>
            <p className="mt-2 text-sm text-mute max-w-md mx-auto leading-relaxed">
              When traders open buy, sell, or trade pools on this chain, they will appear here.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/create" className="sm-btn-primary">
                Create a pool
              </Link>
              <Link href="/?preview=1" className="sm-btn-ghost text-xs">
                Preview with samples
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.slice(0, 6).map((pool) =>
              showSamples ? (
                <div key={pool.poolAddress} className="relative">
                  <span className="absolute top-3 right-3 z-10 text-[10px] uppercase tracking-wider text-soft bg-mist border border-line px-2 py-0.5 rounded">
                    Sample
                  </span>
                  <div className="pointer-events-none opacity-95">
                    <PoolListCard pool={pool} chainId={chainId} />
                  </div>
                </div>
              ) : (
                <PoolListCard key={pool.poolAddress} pool={pool} chainId={chainId} />
              )
            )}
          </div>
        )}
      </div>
    </section>
  )
}
