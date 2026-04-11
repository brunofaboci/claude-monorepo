import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Checkbox } from './Checkbox'

const a11yConfig = {
  runOnly: { type: 'tag' as const, values: ['wcag2a', 'wcag2aa'] },
}

describe('Checkbox — WCAG 2.1 AA', () => {
  it('unchecked state has no violations', async () => {
    const { container } = render(
      <Checkbox id="remember" label="Lembrar-me" checked={false} onChange={() => {}} />,
    )
    expect(await axe(container, a11yConfig)).toHaveNoViolations()
  })

  it('checked state has no violations', async () => {
    const { container } = render(
      <Checkbox id="remember" label="Lembrar-me" checked={true} onChange={() => {}} />,
    )
    expect(await axe(container, a11yConfig)).toHaveNoViolations()
  })
})
