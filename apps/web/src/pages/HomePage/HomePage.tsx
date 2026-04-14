import { Heading } from '../../components/atoms/Heading'
import { Button } from '../../components/atoms/Button'
import { useAuth } from '../../contexts/AuthContext'

export function HomePage() {
  const auth = useAuth()

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center gap-6 p-8">
      <Heading as="h1">Bem-vindo, {auth.user?.name}!</Heading>
      <p className="text-text-secondary text-lg">{auth.user?.email}</p>
      <Button variant="ghost" onClick={auth.logout}>
        Sair
      </Button>
    </div>
  )
}
