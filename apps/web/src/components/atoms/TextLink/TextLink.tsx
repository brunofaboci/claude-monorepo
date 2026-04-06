import type { AnchorHTMLAttributes } from 'react'

type TextLinkVariant = 'default' | 'accent'

interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: TextLinkVariant
}

export function TextLink({ variant = 'default', children, className = '', ...props }: TextLinkProps) {
  const variants: Record<TextLinkVariant, string> = {
    default: 'text-text-secondary hover:text-text-primary',
    accent: 'text-accent-green font-bold hover:underline',
  }

  return (
    <a className={`text-sm transition-colors cursor-pointer ${variants[variant]} ${className}`} {...props}>
      {children}
    </a>
  )
}
