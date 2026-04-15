import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NavItem } from './NavItem'

describe('NavItem', () => {
  it('renders label and icon', () => {
    render(
      <MemoryRouter>
        <NavItem to="/feed" icon="home" label="Feed" />
      </MemoryRouter>
    )
    expect(screen.getByText('Feed')).toBeInTheDocument()
    expect(screen.getByText('home')).toBeInTheDocument()
  })

  it('renders as a link pointing to the given route', () => {
    render(
      <MemoryRouter>
        <NavItem to="/feed" icon="home" label="Feed" />
      </MemoryRouter>
    )
    expect(screen.getByRole('link')).toHaveAttribute('href', '/feed')
  })
})
