import { Address } from 'viem'
import { base, baseSepolia, mainnet, type Chain } from 'viem/chains'
import { CONFIG } from './config'

export interface ChainRuntimeConfig {
  id: number
  name: string
  viemChain: Chain
  rpcUrl: string
  factoryAddress: Address | null
  routerAddress: Address | null
  factoryStartBlock: bigint
}

const ZERO = '0x0000000000000000000000000000000000000000' as Address

function envAddr(key: string): Address | null {
  const v = process.env[key]?.trim()
  if (!v || v.toLowerCase() === ZERO) return null
  return v as Address
}

function envBigint(key: string, fallback: bigint): bigint {
  const v = process.env[key]?.trim()
  if (!v) return fallback
  try {
    return BigInt(v)
  } catch {
    return fallback
  }
}

function resolveFactory(chainId: number): Address | null {
  if (chainId === 8453 && CONFIG.FACTORY_ADDRESS_8453) return CONFIG.FACTORY_ADDRESS_8453
  if (chainId === 84532 && CONFIG.FACTORY_ADDRESS_84532) return CONFIG.FACTORY_ADDRESS_84532
  if (chainId === 1 && CONFIG.FACTORY_ADDRESS_1) return CONFIG.FACTORY_ADDRESS_1
  return envAddr(`NEXT_PUBLIC_FACTORY_ADDRESS_${chainId}`)
}

function resolveRouter(chainId: number): Address | null {
  if (chainId === 8453 && CONFIG.ROUTER_ADDRESS_8453) return CONFIG.ROUTER_ADDRESS_8453
  if (chainId === 84532 && CONFIG.ROUTER_ADDRESS_84532) return CONFIG.ROUTER_ADDRESS_84532
  if (chainId === 1 && CONFIG.ROUTER_ADDRESS_1) return CONFIG.ROUTER_ADDRESS_1
  return envAddr(`NEXT_PUBLIC_ROUTER_ADDRESS_${chainId}`)
}

function buildChain(
  id: number,
  name: string,
  viemChain: Chain,
  rpcUrl: string
): ChainRuntimeConfig {
  return {
    id,
    name,
    viemChain,
    rpcUrl,
    factoryAddress: resolveFactory(id),
    routerAddress: resolveRouter(id),
    factoryStartBlock: envBigint(`INDEXER_FACTORY_START_BLOCK_${id}`, 0n),
  }
}

/** Chains the reference UI knows about (may be partially configured). */
export const ALL_CHAIN_CONFIGS: ChainRuntimeConfig[] = [
  buildChain(8453, 'Base', base, CONFIG.BASE_RPC_URL),
  buildChain(84532, 'Base Sepolia', baseSepolia, CONFIG.BASE_SEPOLIA_RPC_URL),
  buildChain(1, 'Ethereum', mainnet, CONFIG.ETHEREUM_RPC_URL),
]

export function getIndexerChainConfigs(): ChainRuntimeConfig[] {
  return ALL_CHAIN_CONFIGS.filter((c) => c.factoryAddress)
}

export function getChainConfig(chainId: number): ChainRuntimeConfig | undefined {
  return ALL_CHAIN_CONFIGS.find((c) => c.id === chainId)
}

export function getRpcUrl(chainId: number): string {
  const cfg = getChainConfig(chainId)
  if (!cfg) throw new Error(`Unknown chain ${chainId}`)
  return cfg.rpcUrl
}

export function getIndexerMaxBlocksPerRun(): bigint {
  return envBigint('INDEXER_MAX_BLOCKS_PER_RUN', 250_000n)
}

export function getIndexerLogChunk(): bigint {
  return envBigint('INDEXER_LOG_CHUNK', 50_000n)
}