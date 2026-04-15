import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FeedTemplate } from '../../components/templates/FeedTemplate'
import { Tag } from '../../components/atoms/Tag'
import { Avatar } from '../../components/atoms/Avatar'
import { MaterialIcon } from '../../components/atoms/MaterialIcon'
import { CommentSection } from '../../components/organisms/CommentSection'
import { useAuth } from '../../contexts/AuthContext'
import * as postsApi from '../../lib/posts-api'
import type { PostDetailResponse } from '../../lib/types'

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  const [post, setPost] = useState<PostDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    async function load() {
      setIsLoading(true)
      try {
        const data = await postsApi.getPost(id!)
        setPost(data)
      } catch {
        setNotFound(true)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [id])

  async function handleLike() {
    if (!post) return
    await postsApi.likePost(post.id)
    setPost((prev) =>
      prev ? { ...prev, isLikedByMe: true, likesCount: prev.likesCount + 1 } : prev
    )
  }

  async function handleUnlike() {
    if (!post) return
    await postsApi.unlikePost(post.id)
    setPost((prev) =>
      prev ? { ...prev, isLikedByMe: false, likesCount: prev.likesCount - 1 } : prev
    )
  }

  async function handleAddComment(content: string) {
    if (!post) return
    const comment = await postsApi.addComment(post.id, { content })
    setPost((prev) =>
      prev
        ? { ...prev, comments: [...prev.comments, comment], commentsCount: prev.commentsCount + 1 }
        : prev
    )
  }

  if (isLoading) {
    return (
      <FeedTemplate>
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="aspect-video bg-dark-surface rounded-xl" />
            <div className="h-8 bg-dark-surface rounded w-3/4" />
            <div className="h-4 bg-dark-surface rounded w-full" />
          </div>
        </div>
      </FeedTemplate>
    )
  }

  if (notFound || !post) {
    return (
      <FeedTemplate>
        <div className="max-w-2xl mx-auto text-center py-16">
          <p className="text-text-secondary text-lg">Post não encontrado.</p>
          <Link to="/feed" className="text-accent-green hover:underline mt-4 block">
            Voltar ao feed
          </Link>
        </div>
      </FeedTemplate>
    )
  }

  return (
    <FeedTemplate>
      <article className="max-w-2xl mx-auto">
        <Link to="/feed" className="inline-flex items-center gap-1 text-text-secondary hover:text-text-primary text-sm mb-6 transition-colors">
          <MaterialIcon name="arrow_back" className="text-base leading-none" />
          Voltar ao feed
        </Link>

        <div className="aspect-video bg-dark-surface rounded-xl overflow-hidden mb-6 flex items-center justify-center">
          {post.thumbnailUrl ? (
            <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-text-muted">
              <MaterialIcon name="code" className="text-6xl" />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <Tag key={tag.id} label={tag.name} variant="card" />
          ))}
        </div>

        <h1 className="text-text-primary font-bold text-3xl leading-snug mb-4">{post.title}</h1>

        <div className="flex items-center gap-3 mb-6">
          <Avatar name={post.author.name} size="md" />
          <div>
            <p className="text-text-primary text-sm font-medium">{post.author.name}</p>
            <p className="text-text-muted text-xs">
              {new Date(post.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <p className="text-text-secondary leading-relaxed whitespace-pre-wrap mb-6">
          {post.description}
        </p>

        <div className="flex items-center gap-4 mb-8 py-4 border-y border-dark-border/20">
          <button
            type="button"
            onClick={isAuthenticated ? (post.isLikedByMe ? handleUnlike : handleLike) : undefined}
            disabled={!isAuthenticated}
            aria-label={post.isLikedByMe ? 'Descurtir' : 'Curtir'}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              isAuthenticated ? 'cursor-pointer' : 'cursor-default'
            } ${post.isLikedByMe ? 'text-accent-green' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <MaterialIcon
              name={post.isLikedByMe ? 'favorite' : 'favorite_border'}
              className="text-xl leading-none"
            />
            <span>{post.likesCount} curtidas</span>
          </button>

          <div className="flex items-center gap-1.5 text-sm text-text-secondary">
            <MaterialIcon name="chat_bubble_outline" className="text-xl leading-none" />
            <span>{post.commentsCount} comentários</span>
          </div>
        </div>

        <CommentSection
          comments={post.comments}
          isAuthenticated={isAuthenticated}
          onAddComment={handleAddComment}
        />
      </article>
    </FeedTemplate>
  )
}
