import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { FormField } from './FormField'

const a11yConfig = {
  runOnly: { type: 'tag' as const, values: ['wcag2a', 'wcag2aa'] },
}

describe('FormField — WCAG 2.1 AA', () => {
  it('text field has no violations', async () => {
    const { container } = render(
      <FormField id="name" label="Nome" type="text" value="" onChange={() => {}} />,
    )
    expect(await axe(container, a11yConfig)).toHaveNoViolations()
  })

  it('email field has no violations', async () => {
    const { container } = render(
      <FormField id="email" label="Email" type="email" value="" onChange={() => {}} />,
    )
    expect(await axe(container, a11yConfig)).toHaveNoViolations()
  })

  it('password field has no violations', async () => {
    const { container } = render(
      <FormField id="password" label="Senha" type="password" value="" onChange={() => {}} />,
    )
    expect(await axe(container, a11yConfig)).toHaveNoViolations()
  })
})
