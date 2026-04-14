import { http } from './axios'
import type { LoginRequest, RegisterRequest, SessionResponse, UserResponse } from './types'

export async function login(data: LoginRequest): Promise<SessionResponse> {
  const response = await http.post<SessionResponse>('/sessions', data)
  return response.data
}

export async function register(data: RegisterRequest): Promise<UserResponse> {
  const response = await http.post<UserResponse>('/users', data)
  return response.data
}

export async function getMe(): Promise<UserResponse> {
  const response = await http.get<UserResponse>('/users/me')
  return response.data
}
