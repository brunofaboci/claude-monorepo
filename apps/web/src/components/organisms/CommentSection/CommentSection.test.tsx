import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommentSection } from './CommentSection'
import type { CommentResponse } from '../../../lib/types'

const comments: CommentResponse[] = [
  {
    id: 'c1',
    content: 'Ótimo post!',
    author: { id: 'u1', name: 'Ana Souza' },
    createdAt: new Date().toISOString(),
  },
]

describe('CommentSection', () => {
  it('renders existing comments', () => {
    render(
      <CommentSection comments={comments} isAuthenticated={false} onAddComment={async () => {}} />
    )
    expect(screen.getByText('Ótimo post!')).toBeInTheDocument()
    expect(screen.getByText('Ana Souza')).toBeInTheDocument()
  })

  it('shows textarea when authenticated', () => {
    render(
      <CommentSection comments={[]} isAuthenticated={true} onAddComment={async () => {}} />
    )
    expect(screen.getByPlaceholderText(/escreva um comentário/i)).toBeInTheDocument()
  })

  it('shows login prompt when not authenticated', () => {
    render(
      <CommentSection comments={[]} isAuthenticated={false} onAddComment={async () => {}} />
    )
    expect(screen.getByText(/faça login/i)).toBeInTheDocument()
  })

  it('calls onAddComment when form submitted', async () => {
    const user = userEvent.setup()
    const onAddComment = vi.fn().mockResolvedValue(undefined)
    render(
      <CommentSection comments={[]} isAuthenticated={true} onAddComment={onAddComment} />
    )
    await user.type(screen.getByPlaceholderText(/escreva um comentário/i), 'Meu comentário')
    await user.click(screen.getByRole('button', { name: /comentar/i }))
    expect(onAddComment).toHaveBeenCalledWith('Meu comentário')
  })
})
