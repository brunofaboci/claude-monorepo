interface CheckboxProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Checkbox({ id, label, checked, onChange }: CheckboxProps) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none">
      <div className="relative flex items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className="w-4 h-4 rounded border border-dark-border bg-dark-input peer-checked:bg-accent-green peer-checked:border-accent-green peer-focus-visible:ring-2 peer-focus-visible:ring-accent-green peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-dark-surface transition-colors flex items-center justify-center">
          {checked && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" className="stroke-dark-bg" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-sm text-text-secondary">{label}</span>
    </label>
  )
}
