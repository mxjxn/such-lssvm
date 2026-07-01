import type { Metadata } from 'next'
import { Cinzel, Cormorant_Garamond, Playfair_Display, Italiana } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { SiteHeader } from '@/components/SiteHeader'
import { TopNav } from '@/components/TopNav'
import { SiteFooter } from '@/components/SiteFooter'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const italiana = Italiana({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-italiana',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Suchmarket — Fine Art Liquidity Exchange',
  description:
    'A hyper-maximalist salon for trading NFTs through LSSVM liquidity pools on Base',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${playfair.variable} ${italiana.variable}`}
    >
      <body data-theme="suchmarket" className="font-body min-h-screen flex flex-col bg-obsidian text-champagne antialiased">
        <Providers>
          <SiteHeader />
          <TopNav />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}
