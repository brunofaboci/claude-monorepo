import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Heading } from './Heading'

const a11yConfig = {
  runOnly: { type: 'tag' as const, values: ['wcag2a', 'wcag2aa'] },
}

describe('Heading — WCAG 2.1 AA', () => {
  it('h1 has no violations', async () => {
    const { container } = render(<Heading as="h1">Login</Heading>)
    expect(await axe(container, a11yConfig)).toHaveNoViolations()
  })

  it('h2 has no violations', async () => {
    const { container } = render(<Heading as="h2">Seção</Heading>)
    expect(await axe(container, a11yConfig)).toHaveNoViolations()
  })
})
