import { vi, describe, it, expect, beforeEach } from 'vitest'
import { http } from './axios'
import { login, register, getMe } from './auth-api'

vi.mock('./axios', () => ({
  http: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

const mockedHttp = vi.mocked(http)

describe('auth-api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('login posts to /sessions and returns data', async () => {
    const session = { accessToken: 'tok', tokenType: 'Bearer', expiresIn: 3600 }
    mockedHttp.post.mockResolvedValueOnce({ data: session })
    const result = await login({ email: 'a@a.com', password: '123' })
    expect(mockedHttp.post).toHaveBeenCalledWith('/sessions', { email: 'a@a.com', password: '123' })
    expect(result).toEqual(session)
  })

  it('register posts to /users and returns data', async () => {
    const user = { id: '1', name: 'Ana', email: 'a@a.com', createdAt: '2024-01-01' }
    mockedHttp.post.mockResolvedValueOnce({ data: user })
    const result = await register({ name: 'Ana', email: 'a@a.com', password: '123' })
    expect(mockedHttp.post).toHaveBeenCalledWith('/users', { name: 'Ana', email: 'a@a.com', password: '123' })
    expect(result).toEqual(user)
  })

  it('getMe gets /users/me and returns data', async () => {
    const user = { id: '1', name: 'Ana', email: 'a@a.com', createdAt: '2024-01-01' }
    mockedHttp.get.mockResolvedValueOnce({ data: user })
    const result = await getMe()
    expect(mockedHttp.get).toHaveBeenCalledWith('/users/me')
    expect(result).toEqual(user)
  })
})
