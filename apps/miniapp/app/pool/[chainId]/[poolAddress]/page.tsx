'use client'

import { useParams } from 'next/navigation'
import { isAddress } from 'viem'
import { usePoolData } from '@/hooks/usePoolData'
import { PoolDetails } from '@/components/PoolDetails'
import { Address } from 'viem'
import { base } from 'viem/chains'
import { useState, useEffect } from 'react'
import { getPublicClient } from '@/lib/wagmi'
import { LSSVM_PAIR_ABI } from '@/lib/contracts'

function getChainFromId(chainId: string | string[]) {
  const id = typeof chainId === 'string' ? parseInt(chainId) : parseInt(chainId[0])
  if (id !== base.id) {
    throw new Error(`Unsupported chain: ${id}. Only Base Mainnet (${base.id}) is currently supported.`)
  }
  return base
}

export default function PoolPage() {
  const params = useParams()
  const chainId = params.chainId as string
  const poolAddress = params.poolAddress as string

  const chain = getChainFromId(chainId)
  
  const [isERC1155, setIsERC1155] = useState<boolean>(false)
  const [poolNftId, setPoolNftId] = useState<bigint | null>(null)
  const [isDetectingERC1155, setIsDetectingERC1155] = useState<boolean>(true)

  const { data: poolData, isLoading, error } = usePoolData(poolAddress as Address, chain.id)

  // Detect ERC1155 pool
  useEffect(() => {
    if (!poolData?.address || !chain) return

    const detectERC1155 = async () => {
      setIsDetectingERC1155(true)
      const client = getPublicClient(chain.id)
      
      // Method 1: Try calling nftId() - ERC1155 pairs have this, ERC721 pairs don't
      // This is expected to fail for ERC721 pools, so we silently catch and continue
      try {
        const nftId = await client.readContract({
          address: poolData.address,
          abi: LSSVM_PAIR_ABI,
          functionName: 'nftId',
        }) as bigint
        
        setIsERC1155(true)
        setPoolNftId(nftId)
        setIsDetectingERC1155(false)
        return
      } catch (nftIdError) {
        // Expected to fail for ERC721 pools - silently continue to next detection method
      }
      
      // Method 2: Try pairVariant()
      try {
        const pairVariant = await client.readContract({
          address: poolData.address,
          abi: LSSVM_PAIR_ABI,
          functionName: 'pairVariant',
        }) as number
        
        console.log('Pair variant:', pairVariant)
        const is1155 = pairVariant === 2 || pairVariant === 3
        setIsERC1155(is1155)
        
        if (is1155) {
          // Try to get nftId
          try {
            const nftId = await client.readContract({
              address: poolData.address,
              abi: LSSVM_PAIR_ABI,
              functionName: 'nftId',
            }) as bigint
            setPoolNftId(nftId)
            console.log('Got pool nftId:', nftId.toString())
          } catch (err) {
            console.warn('Failed to get nftId:', err)
          }
        }
        
        setIsDetectingERC1155(false)
        return
      } catch (variantError) {
        console.warn('Error calling pairVariant:', variantError)
        setIsDetectingERC1155(false)
      }
    }

    detectERC1155()
  }, [poolData?.address, chain])

  if (!isAddress(poolAddress)) {
    return (
      <main className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-600">Invalid pool address</div>
        </div>
      </main>
    )
  }

  if (isLoading || isDetectingERC1155) {
    return (
      <main className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 mb-1">Loading pool data...</div>
              <div className="text-sm text-gray-500">Fetching pool information and detecting pool type</div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !poolData) {
    return (
      <main className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-600">
            Error loading pool data: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <PoolDetails 
          poolAddress={poolData.address}
          poolType={poolData.poolType}
          spotPrice={poolData.spotPrice}
          delta={poolData.delta}
          fee={poolData.fee}
          nftAddress={poolData.nft}
          tokenAddress={poolData.token}
          bondingCurve={poolData.bondingCurve}
          chainId={chain.id}
          isERC1155={isERC1155}
          poolNftId={poolNftId || undefined}
        />
      </div>
    </main>
  )
}

