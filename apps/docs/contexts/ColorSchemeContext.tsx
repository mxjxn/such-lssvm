'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { generateColorScheme, ColorScheme, DEFAULT_HUE } from '../lib/colorScheme'

interface ColorSchemeContextType {
  hue: number
  setHue: (hue: number) => void
  colors: ColorScheme
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(undefined)

const STORAGE_KEY = 'lssvm-docs-hue'

export function ColorSchemeProvider({ children }: { children: ReactNode }) {
  const [hue, setHueState] = useState<number>(DEFAULT_HUE)
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = parseInt(stored, 10)
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 360) {
        setHueState(parsed)
      }
    }
  }, [])

  // Update localStorage when hue changes
  const setHue = (newHue: number) => {
    const normalized = Math.max(0, Math.min(360, newHue))
    setHueState(normalized)
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, normalized.toString())
    }
  }

  const colors = generateColorScheme(hue)

  // Apply CSS variables to root immediately and on color changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      root.style.setProperty('--color-primary', colors.primary)
      root.style.setProperty('--color-secondary', colors.secondary)
      root.style.setProperty('--color-tertiary', colors.tertiary)
      root.style.setProperty('--color-success', colors.success)
      root.style.setProperty('--color-warning', colors.warning)
      root.style.setProperty('--color-error', colors.error)
      root.style.setProperty('--color-background', colors.background)
      root.style.setProperty('--color-background-gradient', colors.backgroundGradient)
      root.style.setProperty('--color-text', colors.text)
      root.style.setProperty('--color-border', colors.border)
      root.style.setProperty('--color-accent', colors.accent)
    }
  }, [colors])

  // Also set initial values on mount (before colors are calculated)
  useEffect(() => {
    if (typeof document !== 'undefined' && !mounted) {
      const initialColors = generateColorScheme(hue)
      const root = document.documentElement
      root.style.setProperty('--color-primary', initialColors.primary)
      root.style.setProperty('--color-secondary', initialColors.secondary)
      root.style.setProperty('--color-tertiary', initialColors.tertiary)
      root.style.setProperty('--color-success', initialColors.success)
      root.style.setProperty('--color-warning', initialColors.warning)
      root.style.setProperty('--color-error', initialColors.error)
      root.style.setProperty('--color-background', initialColors.background)
      root.style.setProperty('--color-background-gradient', initialColors.backgroundGradient)
      root.style.setProperty('--color-text', initialColors.text)
      root.style.setProperty('--color-border', initialColors.border)
      root.style.setProperty('--color-accent', initialColors.accent)
    }
  }, [hue, mounted])

  return (
    <ColorSchemeContext.Provider value={{ hue, setHue, colors }}>
      {children}
    </ColorSchemeContext.Provider>
  )
}

export function useColorScheme(): ColorSchemeContextType {
  const context = useContext(ColorSchemeContext)
  if (context === undefined) {
    throw new Error('useColorScheme must be used within a ColorSchemeProvider')
  }
  return context
}

