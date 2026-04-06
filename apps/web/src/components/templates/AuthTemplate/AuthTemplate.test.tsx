import { render, screen } from '@testing-library/react'
import { AuthTemplate } from './AuthTemplate'

describe('AuthTemplate', () => {
  it('renders banner image', () => {
    render(
      <AuthTemplate bannerSrc="/banner.png" bannerAlt="Test banner">
        <div>Form content</div>
      </AuthTemplate>
    )
    expect(screen.getByAltText('Test banner')).toBeInTheDocument()
  })

  it('renders children in the right column', () => {
    render(
      <AuthTemplate bannerSrc="/banner.png" bannerAlt="Test banner">
        <div>Form content</div>
      </AuthTemplate>
    )
    expect(screen.getByText('Form content')).toBeInTheDocument()
  })
})
