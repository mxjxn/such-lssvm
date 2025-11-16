'use client'

import { createPublicClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { CONFIG } from './config'

// Helper to get public client for a specific chain
// Supporting Base Mainnet and Base Sepolia
export function getPublicClient(chainId: number) {
  if (chainId === base.id) {
    return createPublicClient({
      chain: base,
      transport: http(CONFIG.BASE_RPC_URL),
    })
  }
  
  if (chainId === baseSepolia.id) {
    return createPublicClient({
      chain: baseSepolia,
      transport: http(CONFIG.BASE_SEPOLIA_RPC_URL),
    })
  }
  
  throw new Error(`Unsupported chain: ${chainId}. Only Base Mainnet (${base.id}) and Base Sepolia (${baseSepolia.id}) are currently supported.`)
}
