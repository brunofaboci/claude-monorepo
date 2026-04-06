import { Checkbox } from '../../atoms/Checkbox'
import { TextLink } from '../../atoms/TextLink'

interface RememberForgotRowProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  forgotHref?: string
}

export function RememberForgotRow({ checked, onCheckedChange, forgotHref = '#' }: RememberForgotRowProps) {
  return (
    <div className="flex items-center justify-between">
      <Checkbox id="remember-me" label="Lembrar-me" checked={checked} onChange={onCheckedChange} />
      <TextLink href={forgotHref} variant="default">
        Esqueci a senha
      </TextLink>
    </div>
  )
}
