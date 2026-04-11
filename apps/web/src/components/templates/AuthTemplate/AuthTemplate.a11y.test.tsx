import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AuthTemplate } from './AuthTemplate'

const a11yConfig = {
  runOnly: { type: 'tag' as const, values: ['wcag2a', 'wcag2aa'] },
}

describe('AuthTemplate — WCAG 2.1 AA', () => {
  it('has no violations', async () => {
    const { container } = render(
      <AuthTemplate bannerSrc="/banner-login.png" bannerAlt="Banner de autenticação">
        <p>Conteúdo do formulário</p>
      </AuthTemplate>,
    )
    expect(await axe(container, a11yConfig)).toHaveNoViolations()
  })

  it('has no violations when bannerAlt is empty (imagem decorativa)', async () => {
    const { container } = render(
      <AuthTemplate bannerSrc="/banner-login.png" bannerAlt="">
        <p>Conteúdo do formulário</p>
      </AuthTemplate>,
    )
    expect(await axe(container, a11yConfig)).toHaveNoViolations()
  })
})
