import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi, describe, it, expect } from 'vitest'
import { GuestRoute } from './GuestRoute'
import * as AuthContextModule from '../../contexts/AuthContext'

vi.mock('../../contexts/AuthContext', async (importOriginal) => {
  const actual = await importOriginal<typeof AuthContextModule>()
  return { ...actual, useAuth: vi.fn() }
})

const mockedUseAuth = vi.mocked(AuthContextModule.useAuth)

function setup(isAuthenticated: boolean, isLoading = false) {
  mockedUseAuth.mockReturnValue({
    isAuthenticated,
    isLoading,
    user: null,
    token: null,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  })
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<div>login page</div>} />
        </Route>
        <Route path="/" element={<div>home page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('GuestRoute', () => {
  it('renders outlet when not authenticated', () => {
    setup(false)
    expect(screen.getByText('login page')).toBeInTheDocument()
  })

  it('redirects to / when already authenticated', () => {
    setup(true)
    expect(screen.getByText('home page')).toBeInTheDocument()
  })

  it('renders nothing while loading', () => {
    setup(false, true)
    expect(screen.queryByText('login page')).not.toBeInTheDocument()
    expect(screen.queryByText('home page')).not.toBeInTheDocument()
  })
})
