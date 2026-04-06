import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('renders without crashing', () => {
    render(<LoginForm onSubmit={() => {}} />)
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
  })

  it('calls onSubmit with form data when submitted', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} />)

    await user.type(screen.getByPlaceholderText('usuario123'), 'testuser')
    await user.type(screen.getByPlaceholderText('••••••'), 'secret123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      identifier: 'testuser',
      password: 'secret123',
      remember: false,
    })
  })
})
