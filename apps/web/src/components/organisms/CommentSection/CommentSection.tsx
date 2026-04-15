import { useState } from 'react'
import { Avatar } from '../../atoms/Avatar'
import { Button } from '../../atoms/Button'
import type { CommentResponse } from '../../../lib/types'

interface CommentSectionProps {
  comments: CommentResponse[]
  isAuthenticated: boolean
  onAddComment: (content: string) => Promise<void>
}

export function CommentSection({ comments, isAuthenticated, onAddComment }: CommentSectionProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setIsSubmitting(true)
    try {
      await onAddComment(content.trim())
      setContent('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section aria-label="Comentários" className="mt-8">
      <h2 className="text-text-primary font-semibold text-lg mb-4">
        Comentários ({comments.length})
      </h2>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva um comentário..."
            rows={3}
            className="w-full bg-dark-surface border border-dark-border/30 rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted text-sm resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-1 focus-visible:ring-offset-dark-bg"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !content.trim()} className="px-6 py-2 text-sm">
              {isSubmitting ? 'Enviando...' : 'Comentar'}
            </Button>
          </div>
        </form>
      )}

      {!isAuthenticated && (
        <p className="text-text-secondary text-sm mb-6">
          <a href="/login" className="text-accent-green hover:underline">Faça login</a> para comentar.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar name={comment.author.name} size="sm" />
            <div className="flex-1 bg-dark-surface rounded-lg px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-text-primary text-sm font-medium">{comment.author.name}</span>
                <span className="text-text-muted text-xs">
                  {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
