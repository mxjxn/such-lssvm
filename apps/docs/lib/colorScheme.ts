/**
 * Color Scheme System
 * 
 * Provides HSL-based color scheme with hue rotation.
 * All colors maintain consistent relationships as hue rotates.
 */

export interface ColorScheme {
  primary: string;
  secondary: string;
  tertiary: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  backgroundGradient: string;
  text: string;
  border: string;
  accent: string;
}

/**
 * Normalize hue to 0-360 range
 */
function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360;
}

/**
 * Convert HSL to CSS color string
 */
function hsl(h: number, s: number, l: number): string {
  return `hsl(${normalizeHue(h)}, ${s}%, ${l}%)`;
}

/**
 * Generate color scheme from base hue
 */
export function generateColorScheme(baseHue: number): ColorScheme {
  return {
    primary: hsl(baseHue, 70, 60),
    secondary: hsl(baseHue + 60, 70, 60),
    tertiary: hsl(baseHue + 120, 70, 60),
    success: hsl(baseHue + 90, 70, 60),
    warning: hsl(baseHue + 30, 70, 60),
    error: hsl(baseHue - 30, 70, 60),
    background: hsl(baseHue, 20, 8),
    backgroundGradient: `linear-gradient(135deg, ${hsl(baseHue, 20, 8)}, ${hsl(baseHue, 20, 12)})`,
    text: hsl(baseHue, 10, 85),
    border: hsl(baseHue, 30, 25),
    accent: hsl(baseHue, 80, 50),
  };
}

/**
 * Default hue value
 */
export const DEFAULT_HUE = 200;

