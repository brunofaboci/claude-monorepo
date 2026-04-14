import axios from 'axios'
import { extractErrorMessage } from './errors'

describe('extractErrorMessage', () => {
  it('extracts string message from axios error', () => {
    const err = new axios.AxiosError('Request failed', undefined, undefined, undefined, {
      data: { message: 'Credenciais inválidas', statusCode: 401 },
      status: 401,
      statusText: 'Unauthorized',
      headers: {},
      config: {} as never,
    })
    expect(extractErrorMessage(err)).toBe('Credenciais inválidas')
  })

  it('extracts first item from array message', () => {
    const err = new axios.AxiosError('Request failed', undefined, undefined, undefined, {
      data: { message: ['Campo obrigatório', 'Email inválido'], statusCode: 400 },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
    })
    expect(extractErrorMessage(err)).toBe('Campo obrigatório')
  })

  it('falls back to error.message when no response data', () => {
    const err = new axios.AxiosError('Network Error')
    expect(extractErrorMessage(err)).toBe('Network Error')
  })

  it('handles plain Error', () => {
    expect(extractErrorMessage(new Error('Oops'))).toBe('Oops')
  })

  it('handles unknown value', () => {
    expect(extractErrorMessage('string error')).toBe('Erro desconhecido')
  })
})
