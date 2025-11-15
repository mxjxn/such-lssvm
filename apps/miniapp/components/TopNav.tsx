'use client'

import { usePathname, useRouter, useParams } from 'next/navigation'

export function TopNav() {
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()

  // Determine back button destination based on current route
  const getBackDestination = () => {
    if (pathname.startsWith('/buy/') || pathname.startsWith('/sell/')) {
      // Buy/Sell pages -> back to pool page
      const chainId = params.chainId as string
      const poolAddress = params.poolAddress as string
      return `/pool/${chainId}/${poolAddress}`
    } else if (pathname.startsWith('/pool/')) {
      // Pool page -> back to home
      return '/'
    }
    // Home page or other pages -> no back button
    return null
  }

  const backDestination = getBackDestination()

  if (!backDestination) {
    return null
  }

  return (
    <nav className="border-b bg-white sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <button
          onClick={() => router.push(backDestination)}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          <span>←</span>
          <span>Back</span>
        </button>
      </div>
    </nav>
  )
}

