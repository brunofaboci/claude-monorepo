import { TagResponseDto } from '../../tags/dto/tag-response.dto';

export class PostAuthorDto {
  id: string;
  name: string;
}

export class PostResponseDto {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  author: PostAuthorDto;
  tags: TagResponseDto[];
  likesCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  createdAt: Date;
}
