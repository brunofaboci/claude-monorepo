import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Input } from './Input'

const a11yConfig = {
  runOnly: { type: 'tag' as const, values: ['wcag2a', 'wcag2aa'] },
}

describe('Input — WCAG 2.1 AA', () => {
  it('text input with aria-label has no violations', async () => {
    const { container } = render(<Input aria-label="Email" type="text" />)
    expect(await axe(container, a11yConfig)).toHaveNoViolations()
  })

  it('password input with aria-label has no violations', async () => {
    const { container } = render(<Input aria-label="Senha" type="password" />)
    expect(await axe(container, a11yConfig)).toHaveNoViolations()
  })

  it('input WITHOUT a label has a violation', async () => {
    const { container } = render(<Input type="text" />)
    const results = await axe(container, a11yConfig)
    expect(results.violations.length).toBeGreaterThan(0)
  })
})
