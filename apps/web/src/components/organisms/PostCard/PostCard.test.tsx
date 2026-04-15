import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PostCard } from './PostCard'
import type { PostResponse } from '../../../lib/types'

const post: PostResponse = {
  id: '1',
  title: 'Meu Post de Teste',
  description: 'Descrição do post de teste com conteúdo relevante.',
  thumbnailUrl: null,
  author: { id: 'u1', name: 'Ana Souza' },
  tags: [{ id: 't1', name: 'React' }],
  likesCount: 3,
  commentsCount: 1,
  isLikedByMe: false,
  createdAt: new Date().toISOString(),
}

describe('PostCard', () => {
  it('renders title and description', () => {
    render(
      <MemoryRouter>
        <PostCard post={post} isAuthenticated={false} onLike={() => {}} onUnlike={() => {}} />
      </MemoryRouter>
    )
    expect(screen.getByText('Meu Post de Teste')).toBeInTheDocument()
    expect(screen.getByText(/Descrição do post/)).toBeInTheDocument()
  })

  it('renders placeholder when no thumbnail', () => {
    render(
      <MemoryRouter>
        <PostCard post={post} isAuthenticated={false} onLike={() => {}} onUnlike={() => {}} />
      </MemoryRouter>
    )
    expect(screen.getByText('code')).toBeInTheDocument()
  })

  it('renders tag', () => {
    render(
      <MemoryRouter>
        <PostCard post={post} isAuthenticated={false} onLike={() => {}} onUnlike={() => {}} />
      </MemoryRouter>
    )
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('links to post detail page', () => {
    render(
      <MemoryRouter>
        <PostCard post={post} isAuthenticated={false} onLike={() => {}} onUnlike={() => {}} />
      </MemoryRouter>
    )
    expect(screen.getByRole('link')).toHaveAttribute('href', '/posts/1')
  })
})
