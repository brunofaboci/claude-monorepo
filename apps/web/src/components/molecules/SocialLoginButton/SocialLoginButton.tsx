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
      aria-label={`Entrar com ${label}`}
      className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
    >
      <img src={icon} alt="" className="w-8 h-8 object-contain" />
      <span className="text-xs text-text-primary">{label}</span>
    </button>
  )
}
