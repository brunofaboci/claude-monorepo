import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthTemplate } from '../../components/templates/AuthTemplate'
import { SignupForm } from '../../components/organisms/SignupForm'
import { useAuth } from '../../contexts/AuthContext'
import { extractErrorMessage } from '../../lib/errors'

interface SignupFormData {
  name: string
  email: string
  password: string
  remember: boolean
}

export function SignupPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(data: SignupFormData) {
    setError(null)
    setIsSubmitting(true)
    try {
      await auth.register(data.name, data.email, data.password)
      await auth.login(data.email, data.password)
      navigate('/')
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthTemplate bannerSrc="/banner-cadastro.png" bannerAlt="Code Connect — tela de cadastro">
      <SignupForm onSubmit={handleSubmit} error={error} isSubmitting={isSubmitting} />
    </AuthTemplate>
  )
}
