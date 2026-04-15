import type { ReactNode } from 'react'
import { Sidebar } from '../../organisms/Sidebar'

interface FeedTemplateProps {
  children: ReactNode
  onPublish?: () => void
}

export function FeedTemplate({ children, onPublish }: FeedTemplateProps) {
  return (
    <div className="min-h-screen bg-dark-bg flex">
      <Sidebar onPublish={onPublish} />
      <main className="flex-1 min-w-0 py-8 px-6">
        {children}
      </main>
    </div>
  )
}
