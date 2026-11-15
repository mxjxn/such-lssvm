import { NextRequest, NextResponse } from 'next/server'
import { Address, isAddress } from 'viem'
import { queryPoolsByNFTContract } from '@/lib/subgraph'

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

interface PoolInfo {
  poolAddress: Address
  spotPrice: bigint
  poolType: number
  nftAddress: Address
  poolVariant?: number
  tokenContract?: Address | null
  delta?: bigint
  fee?: bigint
  bondingCurve?: Address
}

/**
 * API route to discover pools for a given NFT contract address
 * Uses Graph Protocol subgraph for efficient querying
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { contractAddress: string } }
) {
  try {
    const { contractAddress } = params

    // Validate address
    if (!isAddress(contractAddress)) {
      return NextResponse.json(
        { error: 'Invalid contract address' },
        { status: 400 }
      )
    }

    // Get chain ID from query params (default to Base Mainnet)
    const searchParams = request.nextUrl.searchParams
    const chainIdParam = searchParams.get('chainId')
    const chainId = chainIdParam ? parseInt(chainIdParam, 10) : 8453

    // Validate chain ID
    if (chainId !== 8453 && chainId !== 84532) {
      return NextResponse.json(
        { error: 'Unsupported chain ID. Only 8453 (Base Mainnet) and 84532 (Base Sepolia) are supported.' },
        { status: 400 }
      )
    }

    // Check cache
    const cacheKey = `pools-${chainId}-${contractAddress.toLowerCase()}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ pools: cached.data })
    }

    // Query subgraph for pools
    const subgraphPools = await queryPoolsByNFTContract(chainId, contractAddress as Address)

    // Transform subgraph pools to PoolInfo format
    const pools: PoolInfo[] = subgraphPools.map((pool) => ({
      poolAddress: pool.id as Address,
      spotPrice: BigInt(pool.spotPrice),
      poolType: pool.poolType,
      nftAddress: pool.nftContract as Address,
      poolVariant: pool.poolVariant,
      tokenContract: pool.tokenContract ? (pool.tokenContract as Address) : null,
      delta: BigInt(pool.delta),
      fee: BigInt(pool.fee),
      bondingCurve: pool.bondingCurve as Address,
    }))

    // Cache results
    cache.set(cacheKey, {
      data: pools,
      timestamp: Date.now(),
    })

    return NextResponse.json({ pools })
  } catch (error) {
    console.error('Error fetching pools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pools', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

