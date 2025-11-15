'use client'

import { useParams } from 'next/navigation'
import { isAddress, Address } from 'viem'
import { base } from 'viem/chains'
import Link from 'next/link'
import { formatPrice } from '@/lib/pool'

// Hardcoded pools for now - in the future, this will be replaced with indexer queries
// Format: { [contractAddress: string]: Array<{ poolAddress: Address, spotPrice: bigint, poolType: number }> }
const HARDCODED_POOLS: Record<string, Array<{ poolAddress: Address; spotPrice: bigint; poolType: number }>> = {
  // Example structure - replace with actual pool data
  // '0x...': [
  //   { poolAddress: '0x...' as Address, spotPrice: 1000000000000000000n, poolType: 1 },
  // ],
}

interface PoolCardProps {
  poolAddress: Address
  spotPrice: bigint
  poolType: number
  chainId: number
}

function PoolCard({ poolAddress, spotPrice, poolType, chainId }: PoolCardProps) {
  const poolTypeLabel = poolType === 0 ? 'TOKEN' : poolType === 1 ? 'NFT' : 'TRADE'

  return (
    <Link href={`/pool/${chainId}/${poolAddress}`}>
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <div className="font-mono text-sm text-gray-600 truncate flex-1">
            {poolAddress.slice(0, 10)}...{poolAddress.slice(-8)}
          </div>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-semibold whitespace-nowrap ml-2">
            {poolTypeLabel}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          <div className="font-medium text-gray-900">
            Spot Price: {formatPrice(spotPrice)} ETH
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function BrowsePage() {
  const params = useParams()
  const poolContractAddress = params.poolContractAddress as string
  const chainId = base.id // Only Base mainnet for now

  if (!isAddress(poolContractAddress)) {
    return (
      <main className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-600">Invalid contract address</div>
        </div>
      </main>
    )
  }

  const pools = HARDCODED_POOLS[poolContractAddress.toLowerCase()] || []

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Pools for Contract</h1>
          <div className="text-sm text-gray-600 font-mono break-all mb-4">
            {poolContractAddress}
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <strong>Note:</strong> Pool data is currently hardcoded. In the future, this will be replaced with indexer queries. See FUTURE_INDEXING.md for details.
          </div>
        </div>

        {pools.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500 mb-2">No pools found for this contract.</p>
            <p className="text-sm text-gray-400">
              Pools are currently hardcoded. Add pools to HARDCODED_POOLS in browse/[poolContractAddress]/page.tsx
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pools.map((pool) => (
              <PoolCard
                key={pool.poolAddress}
                poolAddress={pool.poolAddress}
                spotPrice={pool.spotPrice}
                poolType={pool.poolType}
                chainId={chainId}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

