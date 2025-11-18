'use client'

import { useColorScheme } from '../contexts/ColorSchemeContext'

export function HueSlider() {
  const { hue, setHue } = useColorScheme()

  return (
    <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--color-text)' }}>
      <label htmlFor="hue-slider" className="min-w-[35px] uppercase">
        HUE
      </label>
      <input
        type="range"
        id="hue-slider"
        min="0"
        max="360"
        value={hue}
        step="1"
        onChange={(e) => setHue(parseInt(e.target.value, 10))}
        className="flex-1 h-1"
      />
      <span className="min-w-[30px] text-right tabular-nums font-mono">{hue}</span>
    </div>
  )
}

