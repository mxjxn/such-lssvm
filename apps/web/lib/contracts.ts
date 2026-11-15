import { Address } from 'viem'
import { CONFIG, getBondingCurveFromConfig, type CurveType } from './config'
import {
  getRouterAddress as getRouterAddressFromAbis,
  getFactoryAddress as getFactoryAddressFromAbis,
} from '@mxjxn/lssvm-abis'

export * from '@mxjxn/lssvm-abis'

export function getRouterAddress(chainId: number): Address {
  let address: Address | undefined

  if (chainId === 8453 && CONFIG.ROUTER_ADDRESS_8453) address = CONFIG.ROUTER_ADDRESS_8453
  else if (chainId === 84532 && CONFIG.ROUTER_ADDRESS_84532) address = CONFIG.ROUTER_ADDRESS_84532
  else if (chainId === 1 && CONFIG.ROUTER_ADDRESS_1) address = CONFIG.ROUTER_ADDRESS_1

  if (!address) {
    const envKey = `NEXT_PUBLIC_ROUTER_ADDRESS_${chainId}`
    const fromEnv = process.env[envKey]?.trim()
    if (fromEnv && fromEnv !== '0x0000000000000000000000000000000000000000') {
      address = fromEnv as Address
    }
  }

  if (address) return address

  try {
    return getRouterAddressFromAbis(chainId)
  } catch {
    throw new Error(
      `Router address not configured for chain ${chainId}. Set NEXT_PUBLIC_ROUTER_ADDRESS_${chainId}.`
    )
  }
}

export function getFactoryAddress(chainId: number): Address {
  let address: Address | undefined

  if (chainId === 8453 && CONFIG.FACTORY_ADDRESS_8453) address = CONFIG.FACTORY_ADDRESS_8453
  else if (chainId === 84532 && CONFIG.FACTORY_ADDRESS_84532) address = CONFIG.FACTORY_ADDRESS_84532
  else if (chainId === 1 && CONFIG.FACTORY_ADDRESS_1) address = CONFIG.FACTORY_ADDRESS_1

  if (!address) {
    const envKey = `NEXT_PUBLIC_FACTORY_ADDRESS_${chainId}`
    const fromEnv = process.env[envKey]?.trim()
    if (fromEnv && fromEnv !== '0x0000000000000000000000000000000000000000') {
      address = fromEnv as Address
    }
  }

  if (address) return address

  try {
    return getFactoryAddressFromAbis(chainId)
  } catch {
    throw new Error(
      `Factory address not configured for chain ${chainId}. Set NEXT_PUBLIC_FACTORY_ADDRESS_${chainId}.`
    )
  }
}

export function getBondingCurveAddress(chainId: number, curveType: CurveType | string): Address {
  const normalized = curveType.toString().toUpperCase() as CurveType
  return getBondingCurveFromConfig(chainId, normalized)
}