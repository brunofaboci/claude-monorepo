import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Button } from './Button'

const a11yConfig = {
  runOnly: { type: 'tag' as const, values: ['wcag2a', 'wcag2aa'] },
}

describe('Button — WCAG 2.1 AA', () => {
  it('primary variant has no violations', async () => {
    const { container } = render(<Button variant="primary">Entrar</Button>)
    expect(await axe(container, a11yConfig)).toHaveNoViolations()
  })

  it('ghost variant has no violations', async () => {
    const { container } = render(<Button variant="ghost">Cancelar</Button>)
    expect(await axe(container, a11yConfig)).toHaveNoViolations()
  })

  it('disabled state has no violations', async () => {
    const { container } = render(<Button disabled>Entrar</Button>)
    expect(await axe(container, a11yConfig)).toHaveNoViolations()
  })
})
