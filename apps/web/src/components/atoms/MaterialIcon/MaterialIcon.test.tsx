import { render, screen } from '@testing-library/react'
import { MaterialIcon } from './MaterialIcon'

describe('MaterialIcon', () => {
  it('renders icon name as text content', () => {
    render(<MaterialIcon name="home" />)
    expect(screen.getByText('home')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<MaterialIcon name="search" className="text-red-500" />)
    const el = screen.getByText('search')
    expect(el).toHaveClass('text-red-500')
  })
})
