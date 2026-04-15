import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PostCardFooter } from './PostCardFooter'

const author = { id: '1', name: 'Ana Souza' }

describe('PostCardFooter', () => {
  it('renders likes and comments count', () => {
    render(
      <PostCardFooter
        author={author}
        likesCount={5}
        commentsCount={3}
        isLikedByMe={false}
        isAuthenticated={true}
      />
    )
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('calls onLike when authenticated and not liked', async () => {
    const user = userEvent.setup()
    const onLike = vi.fn()
    render(
      <PostCardFooter
        author={author}
        likesCount={0}
        commentsCount={0}
        isLikedByMe={false}
        isAuthenticated={true}
        onLike={onLike}
      />
    )
    await user.click(screen.getByRole('button', { name: /curtir/i }))
    expect(onLike).toHaveBeenCalledTimes(1)
  })

  it('does not call onLike when not authenticated', async () => {
    const user = userEvent.setup()
    const onLike = vi.fn()
    render(
      <PostCardFooter
        author={author}
        likesCount={0}
        commentsCount={0}
        isLikedByMe={false}
        isAuthenticated={false}
        onLike={onLike}
      />
    )
    await user.click(screen.getByRole('button', { name: /curtir/i }))
    expect(onLike).not.toHaveBeenCalled()
  })
})
