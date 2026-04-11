import { AuthTemplate } from '../../components/templates/AuthTemplate'
import { SignupForm } from '../../components/organisms/SignupForm'

interface SignupFormData {
  name: string
  email: string
  password: string
  remember: boolean
}

export function SignupPage() {
  function handleSubmit(data: SignupFormData) {
    // TODO: integrate with API
    console.log('Signup attempt:', data)
  }

  return (
    <AuthTemplate bannerSrc="/banner-cadastro.png" bannerAlt="Code Connect — tela de cadastro">
      <SignupForm onSubmit={handleSubmit} />
    </AuthTemplate>
  )
}
