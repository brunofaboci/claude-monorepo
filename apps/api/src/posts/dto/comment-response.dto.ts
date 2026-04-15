export class CommentAuthorDto {
  id: string;
  name: string;
}

export class CommentResponseDto {
  id: string;
  content: string;
  author: CommentAuthorDto;
  createdAt: Date;
}
