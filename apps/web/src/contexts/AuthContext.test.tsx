import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext'
import * as authApi from '../lib/auth-api'

vi.mock('../lib/auth-api')

const mockedAuthApi = vi.mocked(authApi)

function TestConsumer() {
  const auth = useAuth()
  return (
    <div>
      <span data-testid="status">{auth.isAuthenticated ? 'authenticated' : 'guest'}</span>
      <span data-testid="user">{auth.user?.name ?? ''}</span>
      <button onClick={() => auth.login('a@a.com', 'pass')}>login</button>
      <button onClick={auth.logout}>logout</button>
    </div>
  )
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>,
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('starts as guest when no token in localStorage', async () => {
    mockedAuthApi.getMe.mockRejectedValue(new Error('no token'))
    renderWithProvider()
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('guest'))
  })

  it('validates stored token on mount and sets user', async () => {
    localStorage.setItem('token', 'valid-token')
    mockedAuthApi.getMe.mockResolvedValue({ id: '1', name: 'Ana', email: 'a@a.com', createdAt: '2024' })
    renderWithProvider()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('Ana'))
    expect(screen.getByTestId('status').textContent).toBe('authenticated')
  })

  it('clears token if getMe fails on mount', async () => {
    localStorage.setItem('token', 'expired')
    mockedAuthApi.getMe.mockRejectedValue(new Error('401'))
    renderWithProvider()
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('guest'))
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('login stores token and sets user', async () => {
    // no token in localStorage → getMe is not called on mount
    mockedAuthApi.login.mockResolvedValue({ accessToken: 'tok', tokenType: 'Bearer', expiresIn: 3600 })
    mockedAuthApi.getMe.mockResolvedValue({ id: '1', name: 'Ana', email: 'a@a.com', createdAt: '2024' })
    renderWithProvider()
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('guest'))

    await userEvent.click(screen.getByRole('button', { name: 'login' }))
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('authenticated'))
    expect(localStorage.getItem('token')).toBe('tok')
  })

  it('logout clears token and user', async () => {
    localStorage.setItem('token', 'tok')
    mockedAuthApi.getMe.mockResolvedValue({ id: '1', name: 'Ana', email: 'a@a.com', createdAt: '2024' })
    renderWithProvider()
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('authenticated'))

    await userEvent.click(screen.getByRole('button', { name: 'logout' }))
    expect(screen.getByTestId('status').textContent).toBe('guest')
    expect(localStorage.getItem('token')).toBeNull()
  })
})
