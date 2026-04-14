export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface SessionResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface UserResponse {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface ApiError {
  message: string | string[]
  statusCode: number
  error?: string
}
