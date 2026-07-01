'use client'

import { useParams } from 'next/navigation'
import { useChainId } from 'wagmi'
import { isAddress, Address } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import Link from 'next/link'
import { useAggregatedNFTs } from '@/hooks/useAggregatedNFTs'
import NFTCard from '@/components/NFTCard'
import { PageChrome } from '@/components/PageChrome'
import { LoadingSpinner, ErrorPanel } from '@/components/design/StatusPanel'
import { GildedFrame } from '@/components/design/GildedFrame'

function getChainIdFromParams(chainIdParam: string | string[] | undefined, currentChainId: number): number {
  if (chainIdParam) {
    const id = Array.isArray(chainIdParam) ? parseInt(chainIdParam[0]) : parseInt(chainIdParam)
    if (!isNaN(id) && (id === base.id || id === baseSepolia.id)) {
      return id
    }
  }
  return currentChainId || base.id
}

export default function BrowsePage() {
  const params = useParams()
  const nftContractAddress = params.poolContractAddress as string
  const currentChainId = useChainId()
  const chainId = getChainIdFromParams(params.chainId as string | string[] | undefined, currentChainId)

  const { data: aggregatedNFTs, isLoading, error } = useAggregatedNFTs(
    isAddress(nftContractAddress) ? (nftContractAddress as Address) : undefined,
    chainId
  )

  if (!isAddress(nftContractAddress)) {
    return (
      <PageChrome title="Gallery" subtitle="An invalid address was presented">
        <ErrorPanel title="Invalid Contract" message="The address provided is not a valid Ethereum contract." />
      </PageChrome>
    )
  }

  const chainLabel =
    chainId === base.id ? 'Base Mainnet' : chainId === baseSepolia.id ? 'Base Sepolia' : `Chain ${chainId}`

  return (
    <PageChrome title="The Gallery" subtitle={`Works from ${chainLabel}`}>
      <div className="mb-8 text-center">
        <p className="font-mono text-xs text-champagne/40 break-all">{nftContractAddress}</p>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Curating works from every pool…" />
      ) : error ? (
        <ErrorPanel
          title="Could Not Load Gallery"
          message={error instanceof Error ? error.message : 'An unknown error occurred'}
        />
      ) : !aggregatedNFTs || aggregatedNFTs.length === 0 ? (
        <GildedFrame padding="lg" className="text-center">
          <p className="font-serif text-lg italic text-champagne/60 mb-2">The gallery stands empty.</p>
          <p className="font-serif text-sm text-champagne/40 mb-6">
            No works have been placed in any pool for this contract. Newly inaugurated pools may take a
            moment to appear.
          </p>
          <Link href={`/create/${chainId}`} className="sm-btn-primary inline-block">
            Inaugurate a Pool
          </Link>
        </GildedFrame>
      ) : (
        <>
          <p className="font-display text-xs uppercase tracking-[0.2em] text-gold/70 text-center mb-8">
            {aggregatedNFTs.length} work{aggregatedNFTs.length !== 1 ? 's' : ''} across{' '}
            {new Set(aggregatedNFTs.map((nft) => nft.poolAddress)).size} chamber
            {new Set(aggregatedNFTs.map((nft) => nft.poolAddress)).size !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </PageChrome>
  )
}
