import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { TextLink } from './TextLink'

const a11yConfig = {
  runOnly: { type: 'tag' as const, values: ['wcag2a', 'wcag2aa'] },
}

describe('TextLink — WCAG 2.1 AA', () => {
  it('link with href has no violations', async () => {
    const { container } = render(<TextLink href="/signup">Crie seu cadastro</TextLink>)
    expect(await axe(container, a11yConfig)).toHaveNoViolations()
  })

  // Nota: axe-core não flagra <a> sem href como violação WCAG (é tratado como
  // elemento não-interativo), mas é uma má prática — prefira sempre usar href.
  it('link sem href não gera violação axe (mas é má prática)', async () => {
    const { container } = render(<TextLink>Crie seu cadastro</TextLink>)
    expect(await axe(container, a11yConfig)).toHaveNoViolations()
  })

  it('accent variant with href has no violations', async () => {
    const { container } = render(
      <TextLink href="/login" variant="accent">Faça seu login!</TextLink>,
    )
    expect(await axe(container, a11yConfig)).toHaveNoViolations()
  })
})
