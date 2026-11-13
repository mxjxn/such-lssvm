'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { isAddress } from 'viem'
import { useAppChain } from '@/contexts/ChainContext'
import { PoolListCard, PoolListItem } from '@/components/PoolListCard'
import { getChainName, isSupportedChainId, SupportedChainId } from '@/lib/chains'

async function fetchPools(chainId: number, nft?: string, lookback?: string) {
  const params = new URLSearchParams({ chainId: String(chainId) })
  if (nft) params.set('nft', nft)
  if (lookback) params.set('lookback', lookback)
  const res = await fetch(`/api/pools?${params}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.details || err.error || 'Failed to load pools')
  }
  return res.json() as Promise<{ pools: PoolListItem[] }>
}

export default function ExplorePage() {
  const { chainId, setChainId } = useAppChain()
  const searchParams = useSearchParams()
  const [nftFilter, setNftFilter] = useState('')
  const [submittedNft, setSubmittedNft] = useState<string | undefined>()
  // Short lookback by default (public RPCs rate-limit); widen when filtering by NFT
  const lookback = submittedNft ? '500000' : '80000'

  useEffect(() => {
    const nft = searchParams.get('nft')
    const c = searchParams.get('chainId')
    if (nft && isAddress(nft)) {
      setNftFilter(nft)
      setSubmittedNft(nft)
    }
    if (c && isSupportedChainId(parseInt(c, 10))) {
      setChainId(parseInt(c, 10) as SupportedChainId)
    }
  }, [searchParams, setChainId])


  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['explorePools', chainId, submittedNft, lookback],
    queryFn: () => fetchPools(chainId, submittedNft, lookback),
  })

  const onFilter = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nftFilter) {
      setSubmittedNft(undefined)
      return
    }
    if (!isAddress(nftFilter)) {
      alert('Enter a valid NFT contract address')
      return
    }
    setSubmittedNft(nftFilter)
  }

  return (
    <div className="sm-container py-10">
      <header className="max-w-2xl mb-10">
        <h1 className="font-display text-3xl md:text-4xl text-ink">Explore</h1>
        <p className="mt-2 text-mute text-sm md:text-base leading-relaxed">
          Pools and collections on {getChainName(chainId)}. Filter by NFT contract to find liquidity
          for a specific collection. Prices update from the chain.
        </p>
      </header>

      <form onSubmit={onFilter} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          className="sm-input flex-1 font-mono text-xs sm:text-sm"
          placeholder="Filter by NFT contract (0x…)"
          value={nftFilter}
          onChange={(e) => setNftFilter(e.target.value)}
        />
        <button type="submit" className="sm-btn-secondary">
          Apply
        </button>
        <button
          type="button"
          className="sm-btn-ghost"
          onClick={() => {
            setNftFilter('')
            setSubmittedNft(undefined)
            refetch()
          }}
        >
          Refresh
        </button>
      </form>

      {isLoading || isFetching ? (
        <p className="text-sm text-mute py-12 text-center">Scanning factory events…</p>
      ) : error ? (
        <div className="sm-card p-6 text-center">
          <p className="text-clay text-sm font-medium">Could not load pools</p>
          <p className="mt-2 text-xs text-mute">{(error as Error).message}</p>
          <p className="mt-4 text-xs text-soft">
            Tip: public RPCs rate-limit large log scans. Set NEXT_PUBLIC_BASE_RPC_URL to a dedicated
            endpoint, or filter by NFT contract.
          </p>
        </div>
      ) : !data?.pools?.length ? (
        <div className="sm-card p-8 text-center">
          <p className="text-mute text-sm">No pools found in this range.</p>
          <a href="/create" className="sm-btn-primary inline-flex mt-4">
            Create the first pool
          </a>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.pools.map((pool) => (
            <PoolListCard key={pool.poolAddress} pool={pool} chainId={chainId} />
          ))}
        </div>
      )}
    </div>
  )
}
