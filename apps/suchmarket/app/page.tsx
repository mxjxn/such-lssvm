'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useChainId } from 'wagmi'
import { isAddress } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import Link from 'next/link'
import { GildedHeading } from '@/components/design/GildedHeading'
import { GildedFrame } from '@/components/design/GildedFrame'

export default function Home() {
  const router = useRouter()
  const currentChainId = useChainId()
  const [selectedChainId, setSelectedChainId] = useState<number>(currentChainId || base.id)
  const [poolAddress, setPoolAddress] = useState('')
  const [nftContractAddress, setNftContractAddress] = useState('')
  const [isNavigating, setIsNavigating] = useState(false)

  const handleViewPool = (e: React.FormEvent) => {
    e.preventDefault()
    if (isAddress(poolAddress)) {
      setIsNavigating(true)
      router.push(`/pool/${selectedChainId}/${poolAddress}`)
    }
  }

  const handleBrowseNFTs = (e: React.FormEvent) => {
    e.preventDefault()
    if (isAddress(nftContractAddress)) {
      setIsNavigating(true)
      router.push(`/browse/${nftContractAddress}?chainId=${selectedChainId}`)
    }
  }

  const getChainName = (chainId: number) => {
    return chainId === base.id ? 'Base Mainnet' : chainId === baseSepolia.id ? 'Base Sepolia' : `Chain ${chainId}`
  }

  return (
    <div className="relative min-h-screen bg-velvet-gradient bg-damask overflow-hidden">
      {/* Ambient decorative layers */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, rgba(139,34,82,0.25) 0%, transparent 40%), radial-gradient(circle at 85% 80%, rgba(201,162,39,0.15) 0%, transparent 35%)',
        }}
      />
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20"
        aria-hidden
        style={{
          background: 'radial-gradient(ellipse, rgba(201,162,39,0.4) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">
        <GildedHeading
          subtitle="Enter the salon. Acquire masterpieces. Provision liquidity upon the velvet stage of Base."
          className="mb-16"
        >
          Suchmarket
        </GildedHeading>

        {/* Chain selector — jeweled toggles */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {[
            { id: base.id, label: 'Base Mainnet', gem: '◆' },
            { id: baseSepolia.id, label: 'Base Sepolia', gem: '◇' },
          ].map((chain) => (
            <button
              key={chain.id}
              type="button"
              onClick={() => setSelectedChainId(chain.id)}
              className={`font-display text-xs uppercase tracking-[0.2em] px-5 py-2.5 transition-all duration-300 ${
                selectedChainId === chain.id
                  ? 'sm-btn-primary'
                  : 'sm-btn-secondary'
              }`}
            >
              <span className="mr-2 opacity-70" aria-hidden>
                {chain.gem}
              </span>
              {chain.label}
            </button>
          ))}
        </div>

        {/* Primary CTA */}
        <div className="text-center mb-16">
          <Link href={`/create/${selectedChainId}`} className="sm-btn-primary inline-block text-base">
            Inaugurate a Pool
          </Link>
          <p className="font-serif text-sm italic text-champagne/45 mt-4">
            Bestow your collection upon the market
          </p>
        </div>

        {/* Action cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <GildedFrame padding="lg" className="shadow-baroque">
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-14 h-14 shrink-0 flex items-center justify-center border border-crimson/50 bg-crimson/10 text-crimson font-accent text-2xl"
                aria-hidden
              >
                ✦
              </div>
              <div>
                <h2 className="font-display text-lg uppercase tracking-[0.15em] text-gold-light">
                  Peruse the Collection
                </h2>
                <p className="font-serif text-sm italic text-champagne/60 mt-1">
                  Survey all works across every pool, arranged by offering price
                </p>
              </div>
            </div>
            <form onSubmit={handleBrowseNFTs} className="space-y-4">
              <input
                type="text"
                value={nftContractAddress}
                onChange={(e) => setNftContractAddress(e.target.value)}
                placeholder="NFT contract address (0x…)"
                className="sm-input rounded-sm"
              />
              <button
                type="submit"
                disabled={isNavigating || !isAddress(nftContractAddress)}
                className="w-full sm-btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Enter the Gallery
              </button>
            </form>
          </GildedFrame>

          <GildedFrame padding="lg" className="shadow-baroque">
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-14 h-14 shrink-0 flex items-center justify-center border border-gold/50 bg-gold/10 text-gold font-accent text-2xl"
                aria-hidden
              >
                ◈
              </div>
              <div>
                <h2 className="font-display text-lg uppercase tracking-[0.15em] text-gold-light">
                  Inspect a Pool
                </h2>
                <p className="font-serif text-sm italic text-champagne/60 mt-1">
                  Approach a specific liquidity chamber and examine its treasures
                </p>
              </div>
            </div>
            <form onSubmit={handleViewPool} className="space-y-4">
              <input
                type="text"
                value={poolAddress}
                onChange={(e) => setPoolAddress(e.target.value)}
                placeholder="Pool address (0x…)"
                className="sm-input rounded-sm"
              />
              <button
                type="submit"
                disabled={isNavigating || !isAddress(poolAddress)}
                className="w-full sm-btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Unveil the Chamber
              </button>
            </form>
          </GildedFrame>
        </div>

        {/* Quick links — catalog of expeditions */}
        <GildedFrame padding="lg">
          <h3 className="font-display text-sm uppercase tracking-[0.25em] text-gold text-center mb-8">
            Expeditions &amp; Provisions
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <QuickLink
              href={`/create/${selectedChainId}`}
              title="Create Pool"
              description="Establish a new liquidity salon"
              icon="✚"
            />

            {selectedChainId === baseSepolia.id && (
              <>
                <QuickLink
                  href={`/create/${selectedChainId}?nftContract=0xF130207fbE0913b5470732D25699E41F5Ea4da7f&nftType=ERC721&initialNFTIds=1&spotPrice=0.002&delta=0.01&fee=100&bondingCurve=LINEAR`}
                  title="Test ERC721 Pool"
                  description="A provisional chamber for experimentation"
                  icon="I"
                />
                <QuickLink
                  href={`/create/${selectedChainId}?nftContract=0x68f397655a5a1478e24Bdb52D0Df33e50AB6Ce28&nftType=ERC1155&nftId=0&spotPrice=0.002&delta=0.01&fee=100&bondingCurve=LINEAR`}
                  title="Test ERC1155 Pool"
                  description="Edition works upon the testnet stage"
                  icon="II"
                />
                <QuickLink
                  href="/browse/0xF130207fbE0913b5470732D25699E41F5Ea4da7f?chainId=84532"
                  title="Test ERC721 Gallery"
                  description="Browse the trial collection"
                  icon="◆"
                />
                <QuickLink
                  href="/browse/0x68f397655a5a1478e24Bdb52D0Df33e50AB6Ce28?chainId=84532"
                  title="Test ERC1155 Gallery"
                  description="Peruse edition test works"
                  icon="◇"
                />
              </>
            )}
          </div>
        </GildedFrame>

        <p className="text-center mt-12 font-serif text-sm text-champagne/40">
          Presently attuned to{' '}
          <span className="text-gold/80 italic">{getChainName(selectedChainId)}</span>
          <span className="mx-2 opacity-30">·</span>
          Chain {selectedChainId}
        </p>
      </div>
    </div>
  )
}

function QuickLink({
  href,
  title,
  description,
  icon,
}: {
  href: string
  title: string
  description: string
  icon: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 p-4 border border-gold/20 bg-obsidian/40 hover:border-gold/45 hover:bg-imperial/30 transition-all duration-300"
    >
      <div
        className="w-11 h-11 shrink-0 flex items-center justify-center border border-gold/30 text-gold font-display text-sm group-hover:border-gold/60 transition-colors"
        aria-hidden
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="font-display text-xs uppercase tracking-[0.12em] text-champagne group-hover:text-gold-light transition-colors">
          {title}
        </div>
        <div className="font-serif text-xs italic text-champagne/45 mt-0.5 truncate">{description}</div>
      </div>
    </Link>
  )
}
