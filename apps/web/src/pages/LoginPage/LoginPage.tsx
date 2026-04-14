import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthTemplate } from '../../components/templates/AuthTemplate'
import { LoginForm } from '../../components/organisms/LoginForm'
import { useAuth } from '../../contexts/AuthContext'
import { extractErrorMessage } from '../../lib/errors'

interface LoginFormData {
  identifier: string
  password: string
  remember: boolean
}

export function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(data: LoginFormData) {
    setError(null)
    setIsSubmitting(true)
    try {
      await auth.login(data.identifier, data.password)
      navigate('/')
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthTemplate bannerSrc="/banner-login.png" bannerAlt="Code Connect — mulher trabalhando com tecnologia">
      <LoginForm onSubmit={handleSubmit} error={error} isSubmitting={isSubmitting} />
    </AuthTemplate>
  )
}
