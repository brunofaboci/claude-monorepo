import { NavLink } from 'react-router-dom'
import { MaterialIcon } from '../../atoms/MaterialIcon'

interface NavItemProps {
  to: string
  icon: string
  label: string
}

export function NavItem({ to, icon, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-accent-green/10 text-accent-green'
            : 'text-text-secondary hover:text-text-primary hover:bg-dark-surface'
        }`
      }
    >
      <MaterialIcon name={icon} className="text-xl leading-none" />
      {label}
    </NavLink>
  )
}
