import { base, baseSepolia } from 'viem/chains'
import { Address } from 'viem'
import { BONDING_CURVES } from '@mxjxn/lssvm-abis'

export const SUPPORTED_CHAINS = [base, baseSepolia] as const
export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number]['id']

export const DEFAULT_CHAIN_ID: SupportedChainId = base.id

/** Launch focuses on Linear; other curves remain available for later. */
export const LAUNCH_CURVE = 'LINEAR' as const
export type CurveType = 'LINEAR' | 'EXPONENTIAL' | 'XYK' | 'GDA'

export function isSupportedChainId(chainId: number): chainId is SupportedChainId {
  return chainId === base.id || chainId === baseSepolia.id
}

export function getChainName(chainId: number): string {
  if (chainId === base.id) return 'Base'
  if (chainId === baseSepolia.id) return 'Base Sepolia'
  return `Chain ${chainId}`
}

export function getCurveType(chainId: number, bondingCurve: Address): CurveType | 'UNKNOWN' {
  const curves = BONDING_CURVES[chainId as keyof typeof BONDING_CURVES]
  if (!curves) return 'UNKNOWN'
  const lower = bondingCurve.toLowerCase()
  for (const [name, address] of Object.entries(curves)) {
    if (address.toLowerCase() === lower) return name as CurveType
  }
  return 'UNKNOWN'
}

export function curvePlainName(curve: CurveType | 'UNKNOWN'): string {
  switch (curve) {
    case 'LINEAR':
      return 'Linear'
    case 'EXPONENTIAL':
      return 'Exponential'
    case 'XYK':
      return 'XYK'
    case 'GDA':
      return 'GDA'
    default:
      return 'Custom'
  }
}

export function poolTypeLabel(poolType: number): string {
  if (poolType === 0) return 'Buy'
  if (poolType === 1) return 'Sell'
  if (poolType === 2) return 'Trade'
  return 'Pool'
}

export function poolTypePlain(poolType: number): string {
  if (poolType === 0) return 'Buys NFTs (pays ETH for art)'
  if (poolType === 1) return 'Sells NFTs (holds art for sale)'
  if (poolType === 2) return 'Buys and sells (always liquid both ways)'
  return 'Liquidity pool'
}
