import { useNavigate } from 'react-router-dom'
import { Button } from '../../atoms/Button'
import { NavItem } from '../../molecules/NavItem'
import { useAuth } from '../../../contexts/AuthContext'

interface SidebarProps {
  onPublish?: () => void
}

export function Sidebar({ onPublish }: SidebarProps) {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  function handleAuthAction() {
    if (isAuthenticated) {
      logout()
      navigate('/login')
    } else {
      navigate('/login')
    }
  }

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col gap-6 py-8 px-4">
      <div className="flex items-center gap-2 px-4">
        <span className="text-accent-green font-bold text-xl">{'</>'}</span>
        <span className="text-text-primary font-bold text-xl">CodeConnect</span>
      </div>

      {isAuthenticated && (
        <Button variant="ghost" onClick={onPublish} className="w-full justify-start gap-2">
          + Publicar
        </Button>
      )}

      <nav className="flex flex-col gap-1">
        <NavItem to="/feed" icon="home" label="Feed" />
        <NavItem to="/profile" icon="person" label="Perfil" />
        <NavItem to="/about" icon="info" label="Sobre nós" />
      </nav>

      <div className="mt-auto px-4">
        <button
          type="button"
          onClick={handleAuthAction}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <span>{isAuthenticated ? 'Sair' : 'Entrar'}</span>
        </button>
      </div>
    </aside>
  )
}
