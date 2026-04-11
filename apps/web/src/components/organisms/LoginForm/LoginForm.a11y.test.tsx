import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { LoginForm } from './LoginForm'

const a11yConfig = {
  runOnly: { type: 'tag' as const, values: ['wcag2a', 'wcag2aa'] },
}

describe('LoginForm — WCAG 2.1 AA', () => {
  it('has no violations', async () => {
    const { container } = render(<LoginForm onSubmit={() => {}} />)
    expect(await axe(container, a11yConfig)).toHaveNoViolations()
  })
})
