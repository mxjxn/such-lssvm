'use client'

import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

// Get RPC URL from environment or use default
const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'

// Helper to get public client for a specific chain
// Currently only supporting Base Mainnet
export function getPublicClient(chainId: number) {
  if (chainId !== base.id) {
    throw new Error(`Unsupported chain: ${chainId}. Only Base Mainnet (${base.id}) is currently supported.`)
  }
  
  return createPublicClient({
    chain: base,
    transport: http(BASE_RPC_URL),
  })
}
