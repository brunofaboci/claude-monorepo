import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  fullWidth?: boolean
}

export function Button({ variant = 'primary', fullWidth = false, children, className = '', ...props }: ButtonProps) {
  const base = 'py-3 px-6 rounded-xl font-semibold text-base transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
  const fullWidthClass = fullWidth ? 'w-full' : ''

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-accent-green text-dark-bg hover:bg-accent-green-hover active:scale-[0.98]',
    ghost: 'bg-transparent border border-dark-border text-text-primary hover:border-accent-green',
  }

  return (
    <button className={`${base} ${fullWidthClass} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
