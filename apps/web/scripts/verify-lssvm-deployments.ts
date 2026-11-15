/**
 * Smoke-check factory + router + bonding curves for a chain via public RPC.
 *
 * Usage:
 *   NEXT_PUBLIC_FACTORY_ADDRESS_84532=0x... ... pnpm --filter @lssvm/web exec tsx scripts/verify-lssvm-deployments.ts 84532
 */
import { createPublicClient, http, type Address } from 'viem'
import { base, baseSepolia, mainnet } from 'viem/chains'
import { CONFIG, getConfiguredBondingCurves } from '../lib/config'

const chains = { 8453: base, 84532: baseSepolia, 1: mainnet } as const

function pickFactory(chainId: number): Address | null {
  if (chainId === 8453 && CONFIG.FACTORY_ADDRESS_8453) return CONFIG.FACTORY_ADDRESS_8453
  if (chainId === 84532 && CONFIG.FACTORY_ADDRESS_84532) return CONFIG.FACTORY_ADDRESS_84532
  if (chainId === 1 && CONFIG.FACTORY_ADDRESS_1) return CONFIG.FACTORY_ADDRESS_1
  const env = process.env[`NEXT_PUBLIC_FACTORY_ADDRESS_${chainId}`]?.trim()
  return env && env !== '0x0000000000000000000000000000000000000000' ? (env as Address) : null
}

function pickRouter(chainId: number): Address | null {
  if (chainId === 8453 && CONFIG.ROUTER_ADDRESS_8453) return CONFIG.ROUTER_ADDRESS_8453
  if (chainId === 84532 && CONFIG.ROUTER_ADDRESS_84532) return CONFIG.ROUTER_ADDRESS_84532
  if (chainId === 1 && CONFIG.ROUTER_ADDRESS_1) return CONFIG.ROUTER_ADDRESS_1
  const env = process.env[`NEXT_PUBLIC_ROUTER_ADDRESS_${chainId}`]?.trim()
  return env && env !== '0x0000000000000000000000000000000000000000' ? (env as Address) : null
}

async function main() {
  const chainId = Number(process.argv[2] || '84532')
  const viemChain = chains[chainId as keyof typeof chains]
  if (!viemChain) throw new Error(`Unsupported chain id ${chainId}`)

  const factory = pickFactory(chainId)
  const router = pickRouter(chainId)
  const curves = getConfiguredBondingCurves(chainId)

  if (!factory || !router) {
    console.error('Set NEXT_PUBLIC_FACTORY_ADDRESS_* and NEXT_PUBLIC_ROUTER_ADDRESS_* first')
    process.exit(1)
  }

  const rpc =
    chainId === 8453
      ? CONFIG.BASE_RPC_URL
      : chainId === 84532
        ? CONFIG.BASE_SEPOLIA_RPC_URL
        : CONFIG.ETHEREUM_RPC_URL

  const client = createPublicClient({ chain: viemChain, transport: http(rpc) })

  const factoryCode = await client.getBytecode({ address: factory })
  const routerCode = await client.getBytecode({ address: router })
  console.log('Factory', factory, factoryCode ? 'has code' : 'MISSING')
  console.log('Router', router, routerCode ? 'has code' : 'MISSING')

  for (const [name, addr] of Object.entries(curves)) {
    if (!addr) continue
    const code = await client.getBytecode({ address: addr })
    console.log(`Curve ${name}`, addr, code ? 'has code' : 'MISSING')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})