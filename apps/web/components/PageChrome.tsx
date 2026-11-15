import { ReactNode } from 'react'

interface PageChromeProps {
  children: ReactNode
  title?: string
  subtitle?: string
  className?: string
}

export function PageChrome({ children, title, subtitle, className = '' }: PageChromeProps) {
  return (
    <div className={`min-h-screen bg-paper ${className}`}>
      <div className="sm-container py-8 md:py-12">
        {(title || subtitle) && (
          <header className="mb-8">
            {title && <h1 className="sm-heading text-2xl md:text-3xl">{title}</h1>}
            {subtitle && <p className="mt-2 text-sm text-mute">{subtitle}</p>}
          </header>
        )}
        <div className="sm-card p-6 md:p-8">{children}</div>
      </div>
    </div>
  )
}