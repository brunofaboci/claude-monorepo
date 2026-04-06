import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'password' | 'email'
}

export function Input({ type = 'text', className = '', ...props }: InputProps) {
  return (
    <input
      type={type}
      className={`w-full bg-dark-input border border-dark-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green transition-colors text-sm ${className}`}
      {...props}
    />
  )
}
