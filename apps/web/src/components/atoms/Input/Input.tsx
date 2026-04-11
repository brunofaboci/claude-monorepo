import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'password' | 'email'
}

export function Input({ type = 'text', className = '', ...props }: InputProps) {
  return (
    <input
      type={type}
      className={`w-full bg-dark-input rounded-[4px] px-4 py-3 text-dark-surface placeholder:text-dark-surface focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-1 focus-visible:ring-offset-dark-surface transition-colors text-sm ${className}`}
      {...props}
    />
  )
}
