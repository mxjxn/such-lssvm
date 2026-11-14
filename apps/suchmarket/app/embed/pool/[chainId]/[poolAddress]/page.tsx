'use client'

import { useParams } from 'next/navigation'
import { Address, isAddress, getAddress } from 'viem'
import { usePoolData } from '@/hooks/usePoolData'
import { formatEth, formatFeeBps } from '@/lib/quotes'
import { getChainName, getCurveType, isSupportedChainId, poolTypeLabel } from '@/lib/chains'

/**
 * Lightweight embeddable pool card for cryptoart.social feeds.
 * Use in an iframe: /embed/pool/8453/0x…
 */
export default function EmbedPoolCard() {
  const params = useParams()
  const chainId = parseInt(
    Array.isArray(params.chainId) ? params.chainId[0] : params.chainId || '8453',
    10
  )
  const poolRaw = Array.isArray(params.poolAddress) ? params.poolAddress[0] : params.poolAddress
  const valid =
    isSupportedChainId(chainId) && typeof poolRaw === 'string' && isAddress(poolRaw)
  const poolAddress = valid ? (getAddress(poolRaw) as Address) : undefined
  const { data: pool, isLoading, error } = usePoolData(poolAddress, chainId)

  if (!valid || !poolAddress) {
    return <div className="p-4 text-xs text-mute">Invalid embed</div>
  }
  if (isLoading) {
    return <div className="p-4 text-xs text-mute animate-pulse">Loading…</div>
  }
  if (error || !pool) {
    return <div className="p-4 text-xs text-clay">Unavailable</div>
  }

  const curve = getCurveType(chainId, pool.bondingCurve)
  const href = `/pool/${chainId}/${poolAddress}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block w-full max-w-sm rounded-xl border border-line bg-white p-4 shadow-soft hover:border-ink/20 transition"
      style={{ fontFamily: 'var(--font-sora), system-ui, sans-serif' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-soft">such.market</p>
          <p className="mt-1 font-display text-lg text-ink">{poolTypeLabel(pool.poolType)} pool</p>
          <p className="text-xs text-mute mt-0.5">
            {getChainName(chainId)} · {curve}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg text-ink">{formatEth(pool.spotPrice)}</p>
          <p className="text-[10px] uppercase tracking-wider text-soft">ETH</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2 text-[11px] text-mute">
        <span className="rounded-full bg-mist px-2 py-0.5">Fee {formatFeeBps(pool.fee)}</span>
        <span className="rounded-full bg-mist px-2 py-0.5 truncate max-w-[140px] font-mono">
          {pool.nft.slice(0, 8)}…
        </span>
      </div>
      <p className="mt-3 text-xs text-forest">Open on such.market →</p>
    </a>
  )
}
