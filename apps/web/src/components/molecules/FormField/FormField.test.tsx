import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormField } from './FormField'

describe('FormField', () => {
  it('renders label and input', () => {
    render(<FormField id="email" label="Email" value="" onChange={() => {}} />)
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('calls onChange with input value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<FormField id="email" label="Email" value="" onChange={onChange} />)
    await user.type(screen.getByRole('textbox'), 'a')
    expect(onChange).toHaveBeenCalledWith('a')
  })
})
