/**
 * Application configuration from environment variables (build time for NEXT_PUBLIC_*).
 * Copy `apps/web/.env.example` to `.env.local` and fill in your deployment addresses.
 */

import { Address } from 'viem'

const ZERO = '0x0000000000000000000000000000000000000000'

function envAddr(key: string): Address | '' {
  const v = process.env[key]?.trim()
  if (!v || v.toLowerCase() === ZERO) return ''
  return v as Address
}

export type CurveType = 'LINEAR' | 'EXPONENTIAL' | 'XYK' | 'GDA'

function envCurve(chainId: number, curve: CurveType): Address | '' {
  return envAddr(`NEXT_PUBLIC_CURVE_${curve}_${chainId}`)
}

export function getConfiguredBondingCurves(chainId: number): Partial<Record<CurveType, Address>> {
  const curves: Partial<Record<CurveType, Address>> = {}
  for (const name of ['LINEAR', 'EXPONENTIAL', 'XYK', 'GDA'] as const) {
    const addr = envCurve(chainId, name)
    if (addr) curves[name] = addr
  }
  return curves
}

export const CONFIG = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME?.trim() || 'LSSVM Pools',
  ROUTER_ADDRESS_8453: envAddr('NEXT_PUBLIC_ROUTER_ADDRESS_8453'),
  FACTORY_ADDRESS_8453: envAddr('NEXT_PUBLIC_FACTORY_ADDRESS_8453'),
  ROUTER_ADDRESS_84532: envAddr('NEXT_PUBLIC_ROUTER_ADDRESS_84532'),
  FACTORY_ADDRESS_84532: envAddr('NEXT_PUBLIC_FACTORY_ADDRESS_84532'),
  ROUTER_ADDRESS_1: envAddr('NEXT_PUBLIC_ROUTER_ADDRESS_1'),
  FACTORY_ADDRESS_1: envAddr('NEXT_PUBLIC_FACTORY_ADDRESS_1'),
  BASE_RPC_URL: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
  BASE_SEPOLIA_RPC_URL: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
  ETHEREUM_RPC_URL: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || 'https://ethereum.publicnode.com',
  IPFS_URL: process.env.NEXT_PUBLIC_IPFS_URL || 'https://ipfs.io',
} as const

export function getBondingCurveFromConfig(
  chainId: number,
  curveType: CurveType
): Address {
  const addr = envCurve(chainId, curveType)
  if (!addr) {
    throw new Error(
      `Bonding curve ${curveType} not configured for chain ${chainId}. Set NEXT_PUBLIC_CURVE_${curveType}_${chainId}.`
    )
  }
  return addr
}