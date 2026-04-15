import { MaterialIcon } from '../../atoms/MaterialIcon'
import { Avatar } from '../../atoms/Avatar'

interface PostCardFooterProps {
  author: { id: string; name: string }
  likesCount: number
  commentsCount: number
  isLikedByMe: boolean
  isAuthenticated: boolean
  onLike?: () => void
  onUnlike?: () => void
}

export function PostCardFooter({
  author,
  likesCount,
  commentsCount,
  isLikedByMe,
  isAuthenticated,
  onLike,
  onUnlike,
}: PostCardFooterProps) {
  function handleLikeClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) return
    if (isLikedByMe) {
      onUnlike?.()
    } else {
      onLike?.()
    }
  }

  return (
    <div className="flex items-center justify-between mt-4 pt-3 border-t border-dark-border/30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleLikeClick}
          disabled={!isAuthenticated}
          aria-label={isLikedByMe ? 'Descurtir' : 'Curtir'}
          className={`flex items-center gap-1 text-xs transition-colors ${
            isAuthenticated ? 'cursor-pointer' : 'cursor-default'
          } ${isLikedByMe ? 'text-accent-green' : 'text-text-secondary hover:text-text-primary'}`}
        >
          <MaterialIcon
            name={isLikedByMe ? 'favorite' : 'favorite_border'}
            className="text-base leading-none"
          />
          <span>{likesCount}</span>
        </button>

        <div className="flex items-center gap-1 text-xs text-text-secondary">
          <MaterialIcon name="chat_bubble_outline" className="text-base leading-none" />
          <span>{commentsCount}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Avatar name={author.name} size="sm" />
        <span className="text-xs text-dark-input-light">@{author.name.toLowerCase().replace(/\s+/g, '')}</span>
      </div>
    </div>
  )
}
