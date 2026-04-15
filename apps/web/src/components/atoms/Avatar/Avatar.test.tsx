import { render, screen } from '@testing-library/react'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders image when src is provided', () => {
    render(<Avatar src="https://example.com/avatar.jpg" name="Ana Souza" />)
    expect(screen.getByRole('img', { name: 'Ana Souza' })).toBeInTheDocument()
  })

  it('renders initials fallback when no src', () => {
    render(<Avatar name="Ana Souza" />)
    expect(screen.getByText('AS')).toBeInTheDocument()
  })

  it('renders single initial for single name', () => {
    render(<Avatar name="Ana" />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })
})
