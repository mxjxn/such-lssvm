import { describe, expect, it } from 'vitest'
import { parseWordmarkParam, WORDMARK_FONTS } from './wordmarkFonts'

describe('parseWordmarkParam', () => {
  it('accepts known ids and underscores', () => {
    expect(parseWordmarkParam('fredoka')).toBe('fredoka')
    expect(parseWordmarkParam('baloo_2')).toBe('baloo-2')
    expect(parseWordmarkParam('Luckiest-Guy')).toBe('luckiest-guy')
  })

  it('rejects unknown / empty', () => {
    expect(parseWordmarkParam(null)).toBeNull()
    expect(parseWordmarkParam('')).toBeNull()
    expect(parseWordmarkParam('comic')).toBeNull()
  })

  it('covers comparison set', () => {
    expect(Object.keys(WORDMARK_FONTS).sort()).toEqual(
      [
        'bagel-fat-one',
        'baloo-2',
        'chewy',
        'comic-neue',
        'dela-gothic-one',
        'fredoka',
        'lilita-one',
        'luckiest-guy',
        'rubik-mono-one',
      ].sort(),
    )
  })
})
