import { AuthTemplate } from '../../components/templates/AuthTemplate'
import { LoginForm } from '../../components/organisms/LoginForm'

interface LoginFormData {
  identifier: string
  password: string
  remember: boolean
}

export function LoginPage() {
  function handleSubmit(data: LoginFormData) {
    // TODO: integrate with API
    console.log('Login attempt:', data)
  }

  return (
    <AuthTemplate bannerSrc="/banner-login.png" bannerAlt="Code Connect — mulher trabalhando com tecnologia">
      <LoginForm onSubmit={handleSubmit} />
    </AuthTemplate>
  )
}
