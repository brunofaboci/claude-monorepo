import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { FeedPage } from './FeedPage'

vi.mock('../../lib/posts-api', () => ({
  getPosts: vi.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 }),
  getTags: vi.fn().mockResolvedValue([]),
  likePost: vi.fn(),
  unlikePost: vi.fn(),
  createPost: vi.fn(),
}))

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn().mockReturnValue({ isAuthenticated: false }),
}))

vi.mock('../../components/organisms/Sidebar', () => ({
  Sidebar: () => <aside>Sidebar</aside>,
}))

describe('FeedPage', () => {
  it('renders search input', async () => {
    render(
      <MemoryRouter>
        <FeedPage />
      </MemoryRouter>
    )
    expect(screen.getByPlaceholderText(/buscar posts/i)).toBeInTheDocument()
  })

  it('renders sort tabs', async () => {
    render(
      <MemoryRouter>
        <FeedPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Recentes')).toBeInTheDocument()
    expect(screen.getByText('Populares')).toBeInTheDocument()
  })
})
