import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { SocialLoginButton } from './SocialLoginButton'

const a11yConfig = {
  runOnly: { type: 'tag' as const, values: ['wcag2a', 'wcag2aa'] },
}

describe('SocialLoginButton — WCAG 2.1 AA', () => {
  it('has no violations', async () => {
    const { container } = render(
      <SocialLoginButton icon="/Github.png" label="Github" />,
    )
    expect(await axe(container, a11yConfig)).toHaveNoViolations()
  })
})
