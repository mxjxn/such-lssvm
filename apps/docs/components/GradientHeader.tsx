'use client'

import { useColorScheme } from '../contexts/ColorSchemeContext'

interface GradientHeaderProps {
  children: React.ReactNode
  className?: string
}

export function GradientHeader({ children, className = '' }: GradientHeaderProps) {
  const { colors } = useColorScheme()

  return (
    <h1
      className={`font-mono font-bold ${className}`}
      style={{
        background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.tertiary})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </h1>
  )
}

