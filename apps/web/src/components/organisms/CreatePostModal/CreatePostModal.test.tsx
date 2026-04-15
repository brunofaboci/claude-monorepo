import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreatePostModal } from './CreatePostModal'
import type { TagResponse } from '../../../lib/types'

const tags: TagResponse[] = [{ id: 't1', name: 'React' }]

describe('CreatePostModal', () => {
  it('renders form fields', () => {
    render(<CreatePostModal tags={tags} onClose={() => {}} onSubmit={async () => {}} />)
    expect(screen.getByPlaceholderText(/título do post/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/descreva o conteúdo/i)).toBeInTheDocument()
  })

  it('calls onClose when Cancelar clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<CreatePostModal tags={[]} onClose={onClose} onSubmit={async () => {}} />)
    await user.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onSubmit with correct data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<CreatePostModal tags={[]} onClose={() => {}} onSubmit={onSubmit} />)

    await user.type(screen.getByPlaceholderText(/título do post/i), 'Meu Título')
    await user.type(screen.getByPlaceholderText(/descreva o conteúdo/i), 'Minha descrição completa aqui')
    await user.click(screen.getByRole('button', { name: /publicar/i }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Meu Título', description: 'Minha descrição completa aqui' })
    )
  })
})
