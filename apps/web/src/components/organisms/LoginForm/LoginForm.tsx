import { useState } from 'react'
import { Heading } from '../../atoms/Heading'
import { Button } from '../../atoms/Button'
import { Divider } from '../../atoms/Divider'
import { TextLink } from '../../atoms/TextLink'
import { FormField } from '../../molecules/FormField'
import { RememberForgotRow } from '../../molecules/RememberForgotRow'
import { SocialLoginButton } from '../../molecules/SocialLoginButton'

interface LoginFormData {
  identifier: string
  password: string
  remember: boolean
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void
  error?: string | null
  isSubmitting?: boolean
}

export function LoginForm({ onSubmit, error, isSubmitting = false }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ identifier, password, remember }) }} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <Heading as="h1">Login</Heading>
        <p className="text-text-primary text-2xl">Boas-vindas! Faça seu login.</p>
      </div>

      <FormField
        id="identifier"
        label="Email ou usuário"
        type="text"
        placeholder="usuario123"
        value={identifier}
        onChange={setIdentifier}
      />

      <FormField
        id="password"
        label="Senha"
        type="password"
        placeholder="••••••"
        value={password}
        onChange={setPassword}
      />

      <RememberForgotRow
        checked={remember}
        onCheckedChange={setRemember}
        forgotHref="#"
      />

      {error && (
        <p role="alert" className="text-sm text-red-400">{error}</p>
      )}

      <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Entrando…' : 'Login →'}
      </Button>

      <Divider text="ou entre com outras contas" />

      <div className="flex items-center justify-center gap-6">
        <SocialLoginButton icon="/Github.png" label="Github" />
        <SocialLoginButton icon="/Gmail.png" label="Gmail" />
      </div>

      <p className="text-center text-sm text-text-secondary">
        Ainda não tem conta?{' '}
        <TextLink href="/signup" variant="accent">
          Crie seu cadastro!
        </TextLink>
      </p>
    </form>
  )
}
