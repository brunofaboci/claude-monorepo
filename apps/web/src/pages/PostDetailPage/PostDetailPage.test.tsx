import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PostDetailPage } from './PostDetailPage'

vi.mock('../../lib/posts-api', () => ({
  getPost: vi.fn().mockResolvedValue({
    id: 'p1',
    title: 'Post Detalhado',
    description: 'Conteúdo completo do post.',
    thumbnailUrl: null,
    author: { id: 'u1', name: 'Ana Souza' },
    tags: [],
    likesCount: 2,
    commentsCount: 1,
    isLikedByMe: false,
    createdAt: new Date().toISOString(),
    comments: [
      { id: 'c1', content: 'Ótimo!', author: { id: 'u2', name: 'Bruno' }, createdAt: new Date().toISOString() },
    ],
  }),
  likePost: vi.fn(),
  unlikePost: vi.fn(),
  addComment: vi.fn(),
}))

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn().mockReturnValue({ isAuthenticated: false }),
}))

vi.mock('../../components/organisms/Sidebar', () => ({
  Sidebar: () => <aside>Sidebar</aside>,
}))

describe('PostDetailPage', () => {
  it('renders post title after loading', async () => {
    render(
      <MemoryRouter initialEntries={['/posts/p1']}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetailPage />} />
        </Routes>
      </MemoryRouter>
    )
    expect(await screen.findByText('Post Detalhado')).toBeInTheDocument()
  })

  it('renders comment', async () => {
    render(
      <MemoryRouter initialEntries={['/posts/p1']}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetailPage />} />
        </Routes>
      </MemoryRouter>
    )
    expect(await screen.findByText('Ótimo!')).toBeInTheDocument()
  })
})
