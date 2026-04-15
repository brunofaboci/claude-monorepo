import { Link } from 'react-router-dom'
import { MaterialIcon } from '../../atoms/MaterialIcon'
import { Tag } from '../../atoms/Tag'
import { PostCardFooter } from '../../molecules/PostCardFooter'
import type { PostResponse } from '../../../lib/types'

interface PostCardProps {
  post: PostResponse
  isAuthenticated: boolean
  onLike: (postId: string) => void
  onUnlike: (postId: string) => void
}

export function PostCard({ post, isAuthenticated, onLike, onUnlike }: PostCardProps) {
  return (
    <Link
      to={`/posts/${post.id}`}
      className="block bg-dark-surface rounded-xl overflow-hidden border border-dark-border/20 hover:border-dark-border/50 transition-colors"
    >
      <div className="aspect-video bg-dark-bg flex items-center justify-center overflow-hidden">
        {post.thumbnailUrl ? (
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-text-muted">
            <MaterialIcon name="code" className="text-5xl" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-text-primary font-semibold text-lg leading-snug mb-2 line-clamp-2">
          {post.title}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 mb-3">
          {post.description}
        </p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Tag key={tag.id} label={tag.name} variant="card" />
            ))}
          </div>
        )}

        <PostCardFooter
          author={post.author}
          likesCount={post.likesCount}
          commentsCount={post.commentsCount}
          isLikedByMe={post.isLikedByMe}
          isAuthenticated={isAuthenticated}
          onLike={() => onLike(post.id)}
          onUnlike={() => onUnlike(post.id)}
        />
      </div>
    </Link>
  )
}
