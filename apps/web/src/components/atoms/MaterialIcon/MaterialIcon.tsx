interface MaterialIconProps {
  name: string
  className?: string
}

export function MaterialIcon({ name, className = '' }: MaterialIconProps) {
  return (
    <span className={`material-symbols-outlined select-none ${className}`}>
      {name}
    </span>
  )
}
