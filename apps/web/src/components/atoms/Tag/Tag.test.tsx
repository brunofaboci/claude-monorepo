import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tag } from './Tag'

describe('Tag', () => {
  it('renders label', () => {
    render(<Tag label="React" />)
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('shows remove button when onRemove is provided', () => {
    render(<Tag label="React" onRemove={() => {}} />)
    expect(screen.getByRole('button', { name: /remover filtro react/i })).toBeInTheDocument()
  })

  it('calls onRemove when remove button clicked', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<Tag label="React" onRemove={onRemove} />)
    await user.click(screen.getByRole('button'))
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('does not show remove button without onRemove', () => {
    render(<Tag label="React" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
