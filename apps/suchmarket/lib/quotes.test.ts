import { describe, expect, it } from 'vitest'
import {
  applySlippageBuy,
  applySlippageSell,
  buildBuyBreakdown,
  buildSellBreakdown,
  explainLinearCurve,
  formatEth,
  formatFeeBps,
} from './quotes'

describe('slippage', () => {
  it('increases buy max by bps', () => {
    expect(applySlippageBuy(1_000_000n, 100)).toBe(1_010_000n) // 1%
  })

  it('decreases sell min by bps', () => {
    expect(applySlippageSell(1_000_000n, 100)).toBe(990_000n)
  })
})

describe('breakdowns', () => {
  it('builds buy breakdown with fees', () => {
    const b = buildBuyBreakdown(1_000_000_000_000_000_000n, 10_000_000_000_000_000n, 5_000_000_000_000_000n, 50)
    expect(b.total).toBe(1_000_000_000_000_000_000n)
    expect(b.protocolFee).toBe(10_000_000_000_000_000n)
    expect(b.royaltyAmount).toBe(5_000_000_000_000_000n)
    expect(b.poolComponent).toBe(985_000_000_000_000_000n)
    expect(b.withSlippage).toBe(applySlippageBuy(b.total, 50))
  })

  it('builds sell breakdown', () => {
    const b = buildSellBreakdown(900_000_000_000_000_000n, 10_000_000_000_000_000n, 5_000_000_000_000_000n, 100)
    expect(b.withSlippage).toBe(applySlippageSell(b.total, 100))
  })
})

describe('formatting', () => {
  it('formats eth without trailing zeros', () => {
    expect(formatEth(1_500_000_000_000_000_000n, 4)).toBe('1.5')
    expect(formatEth(1_000_000_000_000_000_000n, 4)).toBe('1')
  })

  it('formats fee from 1e18 scale', () => {
    // 1% = 0.01e18
    expect(formatFeeBps(10_000_000_000_000_000n)).toBe('1%')
  })
})

describe('plain language', () => {
  it('explains linear curve for artists', () => {
    const text = explainLinearCurve('0.05', '0.001')
    expect(text).toContain('linear')
    expect(text).toContain('0.05')
    expect(text).toContain('0.001')
  })
})
