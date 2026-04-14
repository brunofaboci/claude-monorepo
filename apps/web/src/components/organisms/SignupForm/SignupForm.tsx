import { useState } from 'react'
import { Heading } from '../../atoms/Heading'
import { Button } from '../../atoms/Button'
import { Checkbox } from '../../atoms/Checkbox'
import { Divider } from '../../atoms/Divider'
import { TextLink } from '../../atoms/TextLink'
import { FormField } from '../../molecules/FormField'
import { SocialLoginButton } from '../../molecules/SocialLoginButton'

interface SignupFormData {
  name: string
  email: string
  password: string
  remember: boolean
}

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => void
  error?: string | null
  isSubmitting?: boolean
}

export function SignupForm({ onSubmit, error, isSubmitting = false }: SignupFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ name, email, password, remember }) }} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <Heading as="h1">Cadastro</Heading>
        <p className="text-text-primary text-2xl">Olá! Preencha seus dados.</p>
      </div>

      <FormField
        id="name"
        label="Nome"
        type="text"
        placeholder="Nome completo"
        value={name}
        onChange={setName}
      />

      <FormField
        id="email"
        label="Email"
        type="email"
        placeholder="Digite seu email"
        value={email}
        onChange={setEmail}
      />

      <FormField
        id="password"
        label="Senha"
        type="password"
        placeholder="******"
        value={password}
        onChange={setPassword}
      />

      <Checkbox id="remember-me" label="Lembrar-me" checked={remember} onChange={setRemember} />

      {error && (
        <p role="alert" className="text-sm text-red-400">{error}</p>
      )}

      <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Cadastrando…' : 'Cadastrar →'}
      </Button>

      <Divider text="ou entre com outras contas" />

      <div className="flex items-center justify-center gap-6">
        <SocialLoginButton icon="/Github.png" label="Github" />
        <SocialLoginButton icon="/Gmail.png" label="Gmail" />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-lg text-text-primary">Já tem conta?</span>
        <TextLink href="/login" variant="accent" className="text-lg">
          Faça seu login!
        </TextLink>
      </div>
    </form>
  )
}
