import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders with label', () => {
    render(<Checkbox id="test" label="Remember me" checked={false} onChange={() => {}} />)
    expect(screen.getByText('Remember me')).toBeInTheDocument()
  })

  it('calls onChange when clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox id="test" label="Remember me" checked={false} onChange={onChange} />)
    await user.click(screen.getByText('Remember me'))
    expect(onChange).toHaveBeenCalledWith(true)
  })
})
