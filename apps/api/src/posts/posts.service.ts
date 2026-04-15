import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { Tag } from '../tags/entities/tag.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { PostQueryDto } from './dto/post-query.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  async findAll(
    query: PostQueryDto,
    userId?: string,
  ): Promise<{
    data: PostResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { search, tags, sort = 'recent', page = 1, limit = 12 } = query;

    const qb = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 'tag')
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments');

    if (search) {
      qb.andWhere(
        `to_tsvector('portuguese', post.title || ' ' || post.description) @@ plainto_tsquery('portuguese', :search)`,
        { search },
      );
    }

    if (tags) {
      const tagNames = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      if (tagNames.length > 0) {
        qb.andWhere('tag.name IN (:...tagNames)', { tagNames });
      }
    }

    if (sort === 'popular') {
      qb.addSelect(
        (subQb) =>
          subQb
            .select('COUNT(l.id)', 'lcount')
            .from('likes', 'l')
            .where('l.post_id = post.id'),
        'likes_count',
      ).orderBy('likes_count', 'DESC');
    } else {
      qb.orderBy('post.createdAt', 'DESC');
    }

    const total = await qb.getCount();
    const posts = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    let likedPostIds = new Set<string>();
    if (userId) {
      const likes = await this.likesRepository.find({
        where: { userId },
        select: ['postId'],
      });
      likedPostIds = new Set(likes.map((l) => l.postId));
    }

    const data = posts.map((post) =>
      this.toPostResponseDto(post, likedPostIds.has(post.id)),
    );

    return { data, total, page, limit };
  }

  async findOne(
    id: string,
    userId?: string,
  ): Promise<PostResponseDto & { comments: CommentResponseDto[] }> {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.comments', 'comment')
      .leftJoinAndSelect('comment.author', 'commentAuthor')
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments')
      .where('post.id = :id', { id })
      .getOne();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let isLikedByMe = false;
    if (userId) {
      const like = await this.likesRepository.findOne({
        where: { postId: id, userId },
      });
      isLikedByMe = !!like;
    }

    const comments = (post.comments ?? []).map((c) => ({
      id: c.id,
      content: c.content,
      author: { id: c.author.id, name: c.author.name },
      createdAt: c.createdAt,
    }));

    return {
      ...this.toPostResponseDto(post, isLikedByMe),
      comments,
    };
  }

  async create(dto: CreatePostDto, authorId: string): Promise<PostResponseDto> {
    const post = this.postsRepository.create({
      title: dto.title,
      description: dto.description,
      thumbnailUrl: dto.thumbnailUrl ?? null,
      authorId,
    });

    if (dto.tagIds && dto.tagIds.length > 0) {
      const tags = await this.tagsRepository.findByIds(dto.tagIds);
      post.tags = tags;
    } else {
      post.tags = [];
    }

    const saved = await this.postsRepository.save(post);
    const full = await this.postsRepository.findOne({
      where: { id: saved.id },
      relations: ['author', 'tags'],
    });

    return this.toPostResponseDto(full!, false);
  }

  async like(postId: string, userId: string): Promise<void> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.likesRepository.findOne({
      where: { postId, userId },
    });
    if (existing) throw new ConflictException('Already liked');

    const like = this.likesRepository.create({ postId, userId });
    await this.likesRepository.save(like);
  }

  async unlike(postId: string, userId: string): Promise<void> {
    const like = await this.likesRepository.findOne({
      where: { postId, userId },
    });
    if (!like) throw new NotFoundException('Like not found');
    await this.likesRepository.remove(like);
  }

  async addComment(
    postId: string,
    userId: string,
    dto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const comment = this.commentsRepository.create({
      content: dto.content,
      postId,
      authorId: userId,
    });
    const saved = await this.commentsRepository.save(comment);
    const full = await this.commentsRepository.findOne({
      where: { id: saved.id },
      relations: ['author'],
    });

    return {
      id: full!.id,
      content: full!.content,
      author: { id: full!.author.id, name: full!.author.name },
      createdAt: full!.createdAt,
    };
  }

  private toPostResponseDto(
    post: Post & { likesCount?: number; commentsCount?: number },
    isLikedByMe: boolean,
  ): PostResponseDto {
    return {
      id: post.id,
      title: post.title,
      description: post.description,
      thumbnailUrl: post.thumbnailUrl,
      author: { id: post.author.id, name: post.author.name },
      tags: (post.tags ?? []).map((t) => ({ id: t.id, name: t.name })),
      likesCount: (post as any).likesCount ?? 0,
      commentsCount: (post as any).commentsCount ?? 0,
      isLikedByMe,
      createdAt: post.createdAt,
    };
  }
}
