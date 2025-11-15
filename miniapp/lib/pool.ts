'use client'

import { Address, formatUnits, parseUnits, zeroAddress } from 'viem'
import { getPublicClient } from './wagmi'
import { LSSVM_PAIR_ABI, PoolData, PoolType } from './contracts'

/**
 * Fetch pool data from a pair contract
 */
export async function fetchPoolData(pairAddress: Address, chainId: number): Promise<PoolData | null> {
  try {
    const client = getPublicClient(chainId)
    
    // Fetch basic pool info first
    const [poolType, spotPrice, delta, fee, nft, bondingCurve] = await Promise.all([
      client.readContract({
        address: pairAddress,
        abi: LSSVM_PAIR_ABI,
        functionName: 'poolType',
      }),
      client.readContract({
        address: pairAddress,
        abi: LSSVM_PAIR_ABI,
        functionName: 'spotPrice',
      }),
      client.readContract({
        address: pairAddress,
        abi: LSSVM_PAIR_ABI,
        functionName: 'delta',
      }),
      client.readContract({
        address: pairAddress,
        abi: LSSVM_PAIR_ABI,
        functionName: 'fee',
      }),
      client.readContract({
        address: pairAddress,
        abi: LSSVM_PAIR_ABI,
        functionName: 'nft',
      }),
      client.readContract({
        address: pairAddress,
        abi: LSSVM_PAIR_ABI,
        functionName: 'bondingCurve',
      }),
    ])

    // Try to fetch token address - ETH pairs don't have this function
    let token: Address = zeroAddress
    try {
      const tokenResult = await client.readContract({
        address: pairAddress,
        abi: LSSVM_PAIR_ABI,
        functionName: 'token',
      })
      token = tokenResult as Address
    } catch (error) {
      // If token() reverts, it's likely an ETH pair - use zero address to indicate ETH
      console.log('token() call reverted, assuming ETH pair')
      token = zeroAddress
    }

    return {
      address: pairAddress,
      poolType: poolType as PoolType,
      spotPrice: spotPrice as bigint,
      delta: delta as bigint,
      fee: fee as bigint,
      nft: nft as Address,
      token: token,
      bondingCurve: bondingCurve as Address,
    }
  } catch (error) {
    console.error('Error fetching pool data:', error)
    // Throw error so React Query can properly handle it
    if (error instanceof Error) {
      throw error
    }
    throw new Error(`Failed to fetch pool data: ${error}`)
  }
}

/**
 * Format price for display
 */
export function formatPrice(price: bigint, decimals: number = 18): string {
  return formatUnits(price, decimals)
}

/**
 * Parse price from string
 */
export function parsePrice(price: string, decimals: number = 18): bigint {
  return parseUnits(price, decimals)
}

