import { http } from './axios'
import type {
  PostResponse,
  PostDetailResponse,
  PaginatedResponse,
  TagResponse,
  CreatePostRequest,
  CreateCommentRequest,
  CommentResponse,
} from './types'

export interface GetPostsParams {
  search?: string
  tags?: string
  sort?: 'recent' | 'popular'
  page?: number
  limit?: number
}

export function getPosts(params?: GetPostsParams): Promise<PaginatedResponse<PostResponse>> {
  return http.get<PaginatedResponse<PostResponse>>('/posts', { params }).then((r) => r.data)
}

export function getPost(id: string): Promise<PostDetailResponse> {
  return http.get<PostDetailResponse>(`/posts/${id}`).then((r) => r.data)
}

export function createPost(data: CreatePostRequest): Promise<PostResponse> {
  return http.post<PostResponse>('/posts', data).then((r) => r.data)
}

export function likePost(postId: string): Promise<void> {
  return http.post(`/posts/${postId}/likes`).then(() => undefined)
}

export function unlikePost(postId: string): Promise<void> {
  return http.delete(`/posts/${postId}/likes`).then(() => undefined)
}

export function addComment(postId: string, data: CreateCommentRequest): Promise<CommentResponse> {
  return http.post<CommentResponse>(`/posts/${postId}/comments`, data).then((r) => r.data)
}

export function getTags(): Promise<TagResponse[]> {
  return http.get<TagResponse[]>('/tags').then((r) => r.data)
}
