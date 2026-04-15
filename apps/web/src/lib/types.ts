export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface SessionResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface UserResponse {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface ApiError {
  message: string | string[]
  statusCode: number
  error?: string
}

export interface TagResponse {
  id: string
  name: string
}

export interface PostAuthor {
  id: string
  name: string
}

export interface PostResponse {
  id: string
  title: string
  description: string
  thumbnailUrl: string | null
  author: PostAuthor
  tags: TagResponse[]
  likesCount: number
  commentsCount: number
  isLikedByMe: boolean
  createdAt: string
}

export interface CommentResponse {
  id: string
  content: string
  author: PostAuthor
  createdAt: string
}

export interface PostDetailResponse extends PostResponse {
  comments: CommentResponse[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface CreatePostRequest {
  title: string
  description: string
  thumbnailUrl?: string
  tagIds?: string[]
}

export interface CreateCommentRequest {
  content: string
}
