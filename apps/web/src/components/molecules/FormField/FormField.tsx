import { Label } from '../../atoms/Label'
import { Input } from '../../atoms/Input'

interface FormFieldProps {
  id: string
  label: string
  type?: 'text' | 'password' | 'email'
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

export function FormField({ id, label, type = 'text', placeholder, value, onChange }: FormFieldProps) {
  return (
    <div className="flex flex-col">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
