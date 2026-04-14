import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignupForm } from './SignupForm'

describe('SignupForm', () => {
  it('renders without crashing', () => {
    render(<SignupForm onSubmit={() => {}} />)
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument()
  })

  it('calls onSubmit with form data when submitted', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<SignupForm onSubmit={onSubmit} />)

    await user.type(screen.getByPlaceholderText('Nome completo'), 'João Silva')
    await user.type(screen.getByPlaceholderText('Digite seu email'), 'joao@example.com')
    await user.type(screen.getByPlaceholderText('******'), 'senha123')
    await user.click(screen.getByRole('button', { name: /cadastrar/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'senha123',
      remember: false,
    })
  })

  it('displays error message when error prop is provided', () => {
    render(<SignupForm onSubmit={() => {}} error="Email já cadastrado" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Email já cadastrado')
  })

  it('disables submit button and shows loading text when isSubmitting', () => {
    render(<SignupForm onSubmit={() => {}} isSubmitting />)
    const btn = screen.getByRole('button', { name: /cadastrando/i })
    expect(btn).toBeDisabled()
  })
})
