import type { HTMLAttributes } from 'react'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4'

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel
}

const sizeMap: Record<HeadingLevel, string> = {
  h1: 'text-3xl font-semibold',
  h2: 'text-2xl font-semibold',
  h3: 'text-xl font-semibold',
  h4: 'text-lg font-medium',
}

export function Heading({ as: Tag = 'h1', children, className = '', ...props }: HeadingProps) {
  return (
    <Tag className={`text-text-primary ${sizeMap[Tag]} ${className}`} {...props}>
      {children}
    </Tag>
  )
}
