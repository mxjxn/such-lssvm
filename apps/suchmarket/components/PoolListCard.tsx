'use client'

import Link from 'next/link'
import { formatEth, formatFeeBps } from '@/lib/quotes'
import { curvePlainName, poolTypeLabel, CurveType } from '@/lib/chains'

export interface PoolListItem {
  poolAddress: string
  nft: string
  poolType: number
  spotPrice: string
  delta: string
  fee: string
  curveType: string
  owner?: string | null
}

export function PoolListCard({
  pool,
  chainId,
}: {
  pool: PoolListItem
  chainId: number
}) {
  const spot = formatEth(BigInt(pool.spotPrice))
  const fee = formatFeeBps(BigInt(pool.fee))

  return (
    <Link
      href={`/pool/${chainId}/${pool.poolAddress}`}
      className="sm-card block p-4 hover:border-ink/20 transition group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="sm-chip">{poolTypeLabel(pool.poolType)}</span>
            <span className="sm-chip">{curvePlainName(pool.curveType as CurveType)}</span>
          </div>
          <p className="font-mono text-xs text-soft truncate">{pool.poolAddress}</p>
          <p className="mt-1 font-mono text-[11px] text-soft/80 truncate">NFT {pool.nft}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-display text-xl text-ink">{spot}</p>
          <p className="text-[11px] uppercase tracking-wider text-soft">ETH spot</p>
          <p className="mt-2 text-xs text-mute">Fee {fee}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-forest opacity-0 group-hover:opacity-100 transition">
        View pool →
      </p>
    </Link>
  )
}
