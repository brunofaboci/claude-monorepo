import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import * as authApi from '../lib/auth-api'
import { extractErrorMessage } from '../lib/errors'
import type { UserResponse } from '../lib/types'

interface AuthContextValue {
  user: UserResponse | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function validateToken() {
      const stored = localStorage.getItem('token')
      if (!stored) {
        setIsLoading(false)
        return
      }
      try {
        const me = await authApi.getMe()
        setUser(me)
        setToken(stored)
      } catch {
        localStorage.removeItem('token')
        setToken(null)
      } finally {
        setIsLoading(false)
      }
    }
    validateToken()
  }, [])

  async function login(email: string, password: string) {
    const session = await authApi.login({ email, password })
    localStorage.setItem('token', session.accessToken)
    setToken(session.accessToken)
    const me = await authApi.getMe()
    setUser(me)
  }

  async function register(name: string, email: string, password: string) {
    await authApi.register({ name, email, password })
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

// Re-export for convenience in tests
export { extractErrorMessage }
