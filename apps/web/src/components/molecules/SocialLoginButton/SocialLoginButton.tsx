interface SocialLoginButtonProps {
  icon: string
  label: string
  onClick?: () => void
}

export function SocialLoginButton({ icon, label, onClick }: SocialLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity group"
    >
      <div className="w-12 h-12 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center group-hover:border-accent-green transition-colors">
        <img src={icon} alt={label} className="w-6 h-6 object-contain" />
      </div>
      <span className="text-xs text-text-secondary">{label}</span>
    </button>
  )
}
