'use client'

import { useParams } from 'next/navigation'
import { useChainId } from 'wagmi'
import { isAddress, Address } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import Link from 'next/link'
import { formatPrice } from '@/lib/pool'
import { useAggregatedNFTs, AggregatedNFT } from '@/hooks/useAggregatedNFTs'
import NFTCard from '@/components/NFTCard'

function getChainIdFromParams(chainIdParam: string | string[] | undefined, currentChainId: number): number {
  if (chainIdParam) {
    const id = Array.isArray(chainIdParam) ? parseInt(chainIdParam[0]) : parseInt(chainIdParam)
    if (!isNaN(id) && (id === base.id || id === baseSepolia.id)) {
      return id
    }
  }
  // Fallback to current chain or Base Mainnet
  return currentChainId || base.id
}

export default function BrowsePage() {
  const params = useParams()
  const nftContractAddress = params.poolContractAddress as string // Note: param name is poolContractAddress but it's actually NFT contract
  const currentChainId = useChainId()
  const chainId = getChainIdFromParams(params.chainId as string | string[] | undefined, currentChainId)

  const { data: aggregatedNFTs, isLoading, error } = useAggregatedNFTs(
    isAddress(nftContractAddress) ? (nftContractAddress as Address) : undefined,
    chainId
  )

  if (!isAddress(nftContractAddress)) {
    return (
      <main className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-600">Invalid contract address</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2">Browse NFTs</h1>
          <div className="text-sm text-gray-600 font-mono break-all mb-2">
            Contract: {nftContractAddress}
          </div>
          <div className="text-xs text-gray-500">
            Chain: {chainId === base.id ? 'Base Mainnet' : chainId === baseSepolia.id ? 'Base Sepolia' : `Chain ${chainId}`}
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading NFTs from all pools...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-600 font-semibold mb-2">Error loading NFTs</p>
            <p className="text-sm text-red-500">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </p>
          </div>
        ) : !aggregatedNFTs || aggregatedNFTs.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500 mb-2">No NFTs found in any pools for this contract.</p>
            <p className="text-sm text-gray-400 mb-4">
              NFTs are aggregated from all pools. If you just created a pool, it may take a moment to appear.
            </p>
            <Link
              href={`/create/${chainId}`}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create a Pool
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Found {aggregatedNFTs.length} NFT{aggregatedNFTs.length !== 1 ? 's' : ''} across {new Set(aggregatedNFTs.map(nft => nft.poolAddress)).size} pool{new Set(aggregatedNFTs.map(nft => nft.poolAddress)).size !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {aggregatedNFTs.map((nft) => (
                <NFTCard
                  key={`${nft.poolAddress}-${nft.tokenId.toString()}`}
                  tokenId={nft.tokenId}
                  nftContract={nftContractAddress as Address}
                  poolAddress={nft.poolAddress}
                  poolType={nft.poolType}
                  poolVariant={nft.poolVariant}
                  price={nft.price}
                  chainId={chainId}
                  amount={nft.amount}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

