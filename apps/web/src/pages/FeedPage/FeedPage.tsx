import { useEffect, useState, useCallback } from 'react'
import { FeedTemplate } from '../../components/templates/FeedTemplate'
import { PostCard } from '../../components/organisms/PostCard'
import { CreatePostModal } from '../../components/organisms/CreatePostModal'
import { FilterTagList } from '../../components/molecules/FilterTagList'
import { useAuth } from '../../contexts/AuthContext'
import * as postsApi from '../../lib/posts-api'
import type { PostResponse, TagResponse } from '../../lib/types'

type SortOption = 'recent' | 'popular'

export function FeedPage() {
  const { isAuthenticated } = useAuth()
  const [posts, setPosts] = useState<PostResponse[]>([])
  const [tags, setTags] = useState<TagResponse[]>([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeTagFilters, setActiveTagFilters] = useState<string[]>([])
  const [sort, setSort] = useState<SortOption>('recent')
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    postsApi.getTags().then(setTags).catch(() => {})
  }, [])

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await postsApi.getPosts({
        search: debouncedSearch || undefined,
        tags: activeTagFilters.length > 0 ? activeTagFilters.join(',') : undefined,
        sort,
        page: 1,
        limit: 20,
      })
      setPosts(result.data)
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch, activeTagFilters, sort])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  async function handleLike(postId: string) {
    await postsApi.likePost(postId)
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, isLikedByMe: true, likesCount: p.likesCount + 1 } : p
      )
    )
  }

  async function handleUnlike(postId: string) {
    await postsApi.unlikePost(postId)
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, isLikedByMe: false, likesCount: p.likesCount - 1 } : p
      )
    )
  }

  async function handleCreatePost(data: {
    title: string
    description: string
    thumbnailUrl?: string
    tagIds: string[]
  }) {
    await postsApi.createPost(data)
    setShowCreateModal(false)
    fetchPosts()
  }

  function addTagFilter(tagName: string) {
    if (!activeTagFilters.includes(tagName)) {
      setActiveTagFilters((prev) => [...prev, tagName])
    }
  }

  return (
    <FeedTemplate onPublish={() => setShowCreateModal(true)}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar posts..."
            className="w-full bg-dark-surface border border-dark-border/30 rounded-xl px-5 py-3 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-green"
          />
        </div>

        {activeTagFilters.length > 0 && (
          <div className="mb-4">
            <FilterTagList
              tags={activeTagFilters}
              onRemove={(tag) => setActiveTagFilters((prev) => prev.filter((t) => t !== tag))}
              onClearAll={() => setActiveTagFilters([])}
            />
          </div>
        )}

        <div className="flex items-center gap-4 mb-6 border-b border-dark-border/20">
          {(['recent', 'popular'] as SortOption[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSort(option)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                sort === option
                  ? 'border-accent-green text-accent-green'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {option === 'recent' ? 'Recentes' : 'Populares'}
            </button>
          ))}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => addTagFilter(tag.name)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                  activeTagFilters.includes(tag.name)
                    ? 'bg-accent-green/10 text-accent-green border-accent-green/30'
                    : 'text-text-secondary border-dark-border/30 hover:border-dark-border'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-dark-surface rounded-xl aspect-[4/3] animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-text-secondary">
            <p className="text-lg">Nenhum post encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isAuthenticated={isAuthenticated}
                onLike={handleLike}
                onUnlike={handleUnlike}
              />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreatePostModal
          tags={tags}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePost}
        />
      )}
    </FeedTemplate>
  )
}
