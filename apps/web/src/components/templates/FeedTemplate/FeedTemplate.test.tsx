import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { FeedTemplate } from './FeedTemplate'

vi.mock('../../organisms/Sidebar', () => ({
  Sidebar: () => <aside>Sidebar</aside>,
}))

describe('FeedTemplate', () => {
  it('renders children', () => {
    render(
      <MemoryRouter>
        <FeedTemplate>
          <p>Conteúdo principal</p>
        </FeedTemplate>
      </MemoryRouter>
    )
    expect(screen.getByText('Conteúdo principal')).toBeInTheDocument()
  })

  it('renders sidebar', () => {
    render(
      <MemoryRouter>
        <FeedTemplate>
          <p>Conteúdo</p>
        </FeedTemplate>
      </MemoryRouter>
    )
    expect(screen.getByText('Sidebar')).toBeInTheDocument()
  })
})
