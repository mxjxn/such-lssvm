'use client'

import Link from 'next/link'
import { useAppChain } from '@/contexts/ChainContext'
import { getChainName } from '@/lib/chains'

export default function HomePage() {
  const { chainId } = useAppChain()

  return (
    <div>
      {/* Hero — one composition, brand first */}
      <section className="relative overflow-hidden border-b border-line">
        <div
          className="absolute inset-0 opacity-70"
          aria-hidden
          style={{
            backgroundImage:
              'radial-gradient(ellipse 80% 60% at 70% 20%, rgba(44,95,79,0.12), transparent), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(166,93,78,0.08), transparent)',
          }}
        />
        <div className="sm-container relative py-16 md:py-24 max-w-3xl">
          <p className="font-display text-4xl md:text-6xl tracking-tight text-ink leading-[1.05]">
            such.market
          </p>
          <h1 className="mt-4 text-lg md:text-xl text-mute font-normal max-w-xl leading-relaxed">
            A quiet gallery for NFT liquidity. Buy and sell on a curve — always open, no auction clock.
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/explore" className="sm-btn-primary">
              Explore pools
            </Link>
            <Link href="/launch" className="sm-btn-secondary">
              Launch a collection
            </Link>
          </div>
          <p className="mt-6 text-xs text-soft">
            Live on {getChainName(chainId)}. Ethereum support later. Auctions will join this home.
          </p>
        </div>
      </section>

      <section className="sm-container py-14 grid md:grid-cols-3 gap-8">
        <Feature
          title="Pools, not listings"
          body="Each pool holds art and/or ETH on a bonding curve. Price moves a little with every trade so the market stays liquid both ways."
        />
        <Feature
          title="Made for artists"
          body="Launch a collection straight into a trade pool — collectors buy from the curve, can sell back, and you earn fees while liquidity remains."
        />
        <Feature
          title="Built for the ecosystem"
          body="cryptoart.studio manages contracts. cryptoart.social embeds market cards. such.market is where sales live — auctions next."
        />
      </section>

      <section className="border-t border-line bg-mist/40">
        <div className="sm-container py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl text-ink">Start with a pool</h2>
            <p className="mt-2 text-sm text-mute max-w-md">
              Anyone with NFTs or tokens can create a buy, sell, or trade pool. Linear curve at launch.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/create" className="sm-btn-primary">
              Create pool
            </Link>
            <Link href="/my-pools" className="sm-btn-secondary">
              My pools
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="font-display text-xl text-ink">{title}</h2>
      <p className="mt-2 text-sm text-mute leading-relaxed">{body}</p>
    </div>
  )
}
