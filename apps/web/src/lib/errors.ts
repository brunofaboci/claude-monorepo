import axios from 'axios'
import type { ApiError } from './types'

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined
    if (data?.message) {
      return Array.isArray(data.message) ? data.message[0] : data.message
    }
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Erro desconhecido'
}
