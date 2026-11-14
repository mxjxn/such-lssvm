'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { parseWordmarkParam, WORDMARK_FONTS } from '@/lib/wordmarkFonts'

const LINK_ID = 'sm-wordmark-preview-font'
const STYLE_ID = 'sm-wordmark-preview-style'

/**
 * Harmless preview hook: `?wordmark=<id>` swaps `.sm-wordmark` font only.
 * Default (no / unknown param) leaves Comic Neue Bold untouched.
 */
export function WordmarkFontSwitcher() {
  const searchParams = useSearchParams()
  const raw = searchParams.get('wordmark')

  useEffect(() => {
    const id = parseWordmarkParam(raw)
    const existingLink = document.getElementById(LINK_ID)
    const existingStyle = document.getElementById(STYLE_ID)

    if (!id || id === 'comic-neue') {
      existingLink?.remove()
      existingStyle?.remove()
      document.documentElement.removeAttribute('data-wordmark')
      return
    }

    const spec = WORDMARK_FONTS[id]
    document.documentElement.setAttribute('data-wordmark', id)

    if (spec.google) {
      let link = existingLink as HTMLLinkElement | null
      if (!link) {
        link = document.createElement('link')
        link.id = LINK_ID
        link.rel = 'stylesheet'
        document.head.appendChild(link)
      }
      link.href = `https://fonts.googleapis.com/css2?family=${spec.google}&display=swap`
    } else {
      existingLink?.remove()
    }

    let style = existingStyle as HTMLStyleElement | null
    if (!style) {
      style = document.createElement('style')
      style.id = STYLE_ID
      document.head.appendChild(style)
    }
    style.textContent = `
      html[data-wordmark="${id}"] .sm-wordmark {
        font-family: ${spec.family} !important;
        font-weight: ${spec.weight} !important;
      }
    `

    return () => {
      // leave stylesheet while navigating with same param; cleanup on unmount
    }
  }, [raw])

  useEffect(() => {
    return () => {
      document.getElementById(LINK_ID)?.remove()
      document.getElementById(STYLE_ID)?.remove()
      document.documentElement.removeAttribute('data-wordmark')
    }
  }, [])

  return null
}
