import type { Address } from 'viem'
import type { BondingCurveAddresses, ChainContractAddresses } from './addresses'

/**
 * Example deployment map — copy values from your own `DeployAll` broadcast output
 * into your app's `.env.local` (see `apps/web/.env.example`), not into this package.
 */
export const EXAMPLE_CONTRACT_ADDRESSES: Record<number, ChainContractAddresses> = {
  84532: {
    FACTORY: '0x0000000000000000000000000000000000000001' as Address,
    ROUTER: '0x0000000000000000000000000000000000000002' as Address,
  },
}

export const EXAMPLE_BONDING_CURVES: Record<number, BondingCurveAddresses> = {
  84532: {
    LINEAR: '0x0000000000000000000000000000000000000011' as Address,
    EXPONENTIAL: '0x0000000000000000000000000000000000000012' as Address,
    XYK: '0x0000000000000000000000000000000000000013' as Address,
    GDA: '0x0000000000000000000000000000000000000014' as Address,
  },
}