import { Address } from 'viem'

/**
 * Deployment addresses are intentionally **not** baked into this package.
 * Set addresses via environment variables in your app (see `apps/web/.env.example`)
 * or pass them at runtime. `addresses.example.ts` documents the expected shape.
 */
export type ChainContractAddresses = {
  ROUTER: Address
  FACTORY: Address
}

export type BondingCurveAddresses = {
  LINEAR: Address
  EXPONENTIAL: Address
  XYK: Address
  GDA: Address
}

export const CONTRACT_ADDRESSES: Partial<Record<number, ChainContractAddresses>> = {}

export const BONDING_CURVES: Partial<Record<number, BondingCurveAddresses>> = {}

/**
 * Get the router address for a given chain ID (must be configured by the consumer).
 */
export function getRouterAddress(chainId: number): Address {
  const addresses = CONTRACT_ADDRESSES[chainId]
  if (!addresses?.ROUTER) {
    throw new Error(
      `Router address not configured for chain ${chainId}. Set NEXT_PUBLIC_ROUTER_ADDRESS_${chainId} in your app env.`
    )
  }
  return addresses.ROUTER
}

/**
 * Get the factory address for a given chain ID (must be configured by the consumer).
 */
export function getFactoryAddress(chainId: number): Address {
  const addresses = CONTRACT_ADDRESSES[chainId]
  if (!addresses?.FACTORY) {
    throw new Error(
      `Factory address not configured for chain ${chainId}. Set NEXT_PUBLIC_FACTORY_ADDRESS_${chainId} in your app env.`
    )
  }
  return addresses.FACTORY
}

/**
 * Get the bonding curve address for a given chain ID and curve type.
 */
export function getBondingCurveAddress(
  chainId: number,
  curveType: 'LINEAR' | 'EXPONENTIAL' | 'XYK' | 'GDA'
): Address {
  const curves = BONDING_CURVES[chainId]
  if (!curves) {
    throw new Error(
      `Bonding curves not configured for chain ${chainId}. Set NEXT_PUBLIC_CURVE_${curveType}_${chainId} in your app env.`
    )
  }
  const addr = curves[curveType]
  if (!addr) {
    throw new Error(`Bonding curve ${curveType} not configured for chain ${chainId}`)
  }
  return addr
}