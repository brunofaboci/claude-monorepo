import { useState } from 'react'
import { Button } from '../../atoms/Button'
import { Tag } from '../../atoms/Tag'
import type { TagResponse } from '../../../lib/types'

interface CreatePostModalProps {
  tags: TagResponse[]
  onClose: () => void
  onSubmit: (data: { title: string; description: string; thumbnailUrl?: string; tagIds: string[] }) => Promise<void>
}

export function CreatePostModal({ tags, onClose, onSubmit }: CreatePostModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleTag(tagId: string) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        thumbnailUrl: thumbnailUrl.trim() || undefined,
        tagIds: selectedTagIds,
      })
      onClose()
    } catch {
      setError('Erro ao criar post. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Criar post"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-dark-surface rounded-xl w-full max-w-lg shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border/20">
          <h2 className="text-text-primary font-semibold text-lg">Novo post</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="text-text-secondary hover:text-text-primary text-2xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-4">
          <div className="flex flex-col gap-1">
            <label className="text-text-secondary text-sm">Título *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do post"
              required
              className="w-full bg-dark-bg border border-dark-border/30 rounded-lg px-4 py-2 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-green"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-text-secondary text-sm">Descrição *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o conteúdo do post..."
              required
              rows={4}
              className="w-full bg-dark-bg border border-dark-border/30 rounded-lg px-4 py-2 text-text-primary placeholder:text-text-muted text-sm resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-green"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-text-secondary text-sm">URL da thumbnail (opcional)</label>
            <input
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://..."
              type="url"
              className="w-full bg-dark-bg border border-dark-border/30 rounded-lg px-4 py-2 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-green"
            />
          </div>

          {tags.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-text-secondary text-sm">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className="cursor-pointer"
                    aria-pressed={selectedTagIds.includes(tag.id)}
                  >
                    <Tag
                      label={tag.name}
                      variant={selectedTagIds.includes(tag.id) ? 'filter' : 'card'}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim() || !description.trim()}>
              {isSubmitting ? 'Publicando...' : 'Publicar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
