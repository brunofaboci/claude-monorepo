interface TagProps {
  label: string
  onRemove?: () => void
  variant?: 'filter' | 'card'
}

export function Tag({ label, onRemove, variant = 'card' }: TagProps) {
  const base = 'inline-flex items-center gap-1 rounded-full text-xs font-medium px-3 py-1 transition-colors'
  const styles = {
    card: 'bg-dark-bg text-text-secondary border border-dark-border',
    filter: 'bg-accent-green/10 text-accent-green border border-accent-green/30',
  }

  return (
    <span className={`${base} ${styles[variant]}`}>
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover filtro ${label}`}
          className="ml-1 hover:text-text-primary transition-colors cursor-pointer"
        >
          ×
        </button>
      )}
    </span>
  )
}
