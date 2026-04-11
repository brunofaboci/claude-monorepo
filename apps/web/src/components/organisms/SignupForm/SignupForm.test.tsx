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
})
