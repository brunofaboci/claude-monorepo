import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi, describe, it, expect } from 'vitest'
import { ProtectedRoute } from './ProtectedRoute'
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
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div>protected content</div>} />
        </Route>
        <Route path="/login" element={<div>login page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  it('renders outlet when authenticated', () => {
    setup(true)
    expect(screen.getByText('protected content')).toBeInTheDocument()
  })

  it('redirects to /login when not authenticated', () => {
    setup(false)
    expect(screen.getByText('login page')).toBeInTheDocument()
  })

  it('renders nothing while loading', () => {
    setup(false, true)
    expect(screen.queryByText('protected content')).not.toBeInTheDocument()
    expect(screen.queryByText('login page')).not.toBeInTheDocument()
  })
})
