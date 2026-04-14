import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect } from 'vitest'
import { HomePage } from './HomePage'
import * as AuthContextModule from '../../contexts/AuthContext'

vi.mock('../../contexts/AuthContext', async (importOriginal) => {
  const actual = await importOriginal<typeof AuthContextModule>()
  return { ...actual, useAuth: vi.fn() }
})

const mockedUseAuth = vi.mocked(AuthContextModule.useAuth)

describe('HomePage', () => {
  it('renders welcome message with user name and email', () => {
    const logout = vi.fn()
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1', name: 'Ana', email: 'ana@example.com', createdAt: '2024' },
      token: 'tok',
      login: vi.fn(),
      register: vi.fn(),
      logout,
    })
    render(<HomePage />)
    expect(screen.getByRole('heading', { name: /bem-vindo, ana/i })).toBeInTheDocument()
    expect(screen.getByText('ana@example.com')).toBeInTheDocument()
  })

  it('calls logout when Sair button is clicked', async () => {
    const logout = vi.fn()
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1', name: 'Ana', email: 'ana@example.com', createdAt: '2024' },
      token: 'tok',
      login: vi.fn(),
      register: vi.fn(),
      logout,
    })
    render(<HomePage />)
    await userEvent.click(screen.getByRole('button', { name: /sair/i }))
    expect(logout).toHaveBeenCalledTimes(1)
  })
})
