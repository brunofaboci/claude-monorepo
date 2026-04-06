import type { ReactNode } from 'react'

interface AuthTemplateProps {
  bannerSrc: string
  bannerAlt: string
  children: ReactNode
}

export function AuthTemplate({ bannerSrc, bannerAlt, children }: AuthTemplateProps) {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
      <div className="flex w-full max-w-4xl gap-10 items-center">
        {/* Left column — banner */}
        <div className="hidden lg:block lg:w-[45%] shrink-0">
          <div className="relative rounded-2xl overflow-hidden h-[580px]">
            <img
              src={bannerSrc}
              alt={bannerAlt}
              className="w-full h-full object-cover"
            />
            {/* code connect logo overlay */}
            <div className="absolute bottom-6 left-6 flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect width="32" height="32" rx="6" fill="#39e87a" fillOpacity="0.15" />
                <path d="M8 12L14 16L8 20" stroke="#39e87a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 20H24" stroke="#39e87a" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-white font-semibold text-sm leading-tight">
                code<br />connect
              </span>
            </div>
          </div>
        </div>

        {/* Right column — form slot */}
        <div className="flex-1 flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  )
}
