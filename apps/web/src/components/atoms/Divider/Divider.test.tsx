import { render, screen } from '@testing-library/react'
import { Divider } from './Divider'

describe('Divider', () => {
  it('renders without text', () => {
    const { container } = render(<Divider />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders text when provided', () => {
    render(<Divider text="ou continue com" />)
    expect(screen.getByText('ou continue com')).toBeInTheDocument()
  })
})
