import { base, baseSepolia, mainnet } from 'viem/chains'
import { Address } from 'viem'
import { ALL_CHAIN_CONFIGS, getChainConfig } from './chain-config'
import { getConfiguredBondingCurves, type CurveType } from './config'

export const SUPPORTED_CHAINS = [base, baseSepolia, mainnet] as const
export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number]['id']

export const DEFAULT_CHAIN_ID: SupportedChainId = baseSepolia.id

export function getEnabledChainIds(): SupportedChainId[] {
  const ids = ALL_CHAIN_CONFIGS.filter((c) => c.factoryAddress && c.routerAddress).map((c) => c.id)
  return ids.filter((id): id is SupportedChainId => isSupportedChainId(id))
}

export const LAUNCH_CURVE = 'LINEAR' as const
export type { CurveType }
export type BondingCurveKind = CurveType

export function isSupportedChainId(chainId: number): chainId is SupportedChainId {
  return chainId === base.id || chainId === baseSepolia.id || chainId === mainnet.id
}

export function getChainName(chainId: number): string {
  return getChainConfig(chainId)?.name ?? `Chain ${chainId}`
}

export function isChainOperational(chainId: number): boolean {
  const cfg = getChainConfig(chainId)
  return Boolean(cfg?.factoryAddress && cfg?.routerAddress)
}

export function getBondingCurvesForChain(chainId: number): Partial<Record<CurveType, Address>> {
  return getConfiguredBondingCurves(chainId)
}

export function getCurveType(chainId: number, bondingCurve: Address): CurveType | 'UNKNOWN' {
  const curves = getConfiguredBondingCurves(chainId)
  const lower = bondingCurve.toLowerCase()
  for (const [name, address] of Object.entries(curves)) {
    if (address && address.toLowerCase() === lower) return name as CurveType
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
  if (poolType === 0) return 'Buys NFTs (pays ETH or ERC-20)'
  if (poolType === 1) return 'Sells NFTs (holds inventory)'
  if (poolType === 2) return 'Two-sided trade pool'
  return 'Liquidity pool'
}