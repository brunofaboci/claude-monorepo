interface DividerProps {
  text?: string
}

export function Divider({ text }: DividerProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-px bg-dark-border" />
      {text && <span className="text-xs text-text-muted whitespace-nowrap">{text}</span>}
      <div className="flex-1 h-px bg-dark-border" />
    </div>
  )
}
