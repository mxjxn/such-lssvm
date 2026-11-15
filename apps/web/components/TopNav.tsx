'use client'

import { usePathname, useRouter } from 'next/navigation'

export function TopNav() {
  const pathname = usePathname()
  const router = useRouter()

  const getBackDestination = () => {
    if (pathname.startsWith('/pool/')) return '/explore'
    if (
      pathname.startsWith('/browse/') ||
      pathname.startsWith('/pools/') ||
      pathname.startsWith('/create')
    ) {
      return '/explore'
    }
    return null
  }

  const backDestination = getBackDestination()
  if (!backDestination) return null

  return (
    <nav className="border-b border-line bg-white sticky top-[4rem] z-30">
      <div className="sm-container py-2">
        <button
          onClick={() => router.push(backDestination)}
          className="text-xs text-mute hover:text-ink flex items-center gap-2 transition-colors"
        >
          <span aria-hidden>‹</span>
          <span>Back</span>
        </button>
      </div>
    </nav>
  )
}