import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { SignupForm } from './SignupForm'

const a11yConfig = {
  runOnly: { type: 'tag' as const, values: ['wcag2a', 'wcag2aa'] },
}

describe('SignupForm — WCAG 2.1 AA', () => {
  it('has no violations', async () => {
    const { container } = render(<SignupForm onSubmit={() => {}} />)
    expect(await axe(container, a11yConfig)).toHaveNoViolations()
  })
})
