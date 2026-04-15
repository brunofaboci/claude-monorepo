import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { Tag } from '../tags/entities/tag.entity';

const mockPost = {
  id: 'p1',
  title: 'Test Post',
  description: 'Test description',
  thumbnailUrl: null,
  authorId: 'u1',
  author: { id: 'u1', name: 'Test User' },
  tags: [],
  comments: [],
  likes: [],
  likesCount: 0,
  commentsCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const createQbMock = () => {
  const qb: any = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    loadRelationCountAndMap: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockResolvedValue(1),
    getMany: jest.fn().mockResolvedValue([mockPost]),
    getOne: jest.fn().mockResolvedValue({ ...mockPost, comments: [] }),
  };
  return qb;
};

describe('PostsService', () => {
  let service: PostsService;

  const qb = createQbMock();

  const mockPostRepo = {
    createQueryBuilder: jest.fn().mockReturnValue(qb),
    create: jest.fn().mockReturnValue(mockPost),
    save: jest.fn().mockResolvedValue(mockPost),
    findOne: jest.fn().mockResolvedValue(mockPost),
    findByIds: jest.fn().mockResolvedValue([]),
  };

  const mockCommentRepo = {
    create: jest.fn().mockReturnValue({
      id: 'c1',
      content: 'test',
      postId: 'p1',
      authorId: 'u1',
      createdAt: new Date(),
    }),
    save: jest.fn().mockResolvedValue({ id: 'c1' }),
    findOne: jest.fn().mockResolvedValue({
      id: 'c1',
      content: 'test',
      author: { id: 'u1', name: 'Test' },
      createdAt: new Date(),
    }),
  };

  const mockLikeRepo = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockReturnValue({ id: 'l1' }),
    save: jest.fn().mockResolvedValue({ id: 'l1' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  const mockTagRepo = {
    findByIds: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: mockPostRepo },
        { provide: getRepositoryToken(Comment), useValue: mockCommentRepo },
        { provide: getRepositoryToken(Like), useValue: mockLikeRepo },
        { provide: getRepositoryToken(Tag), useValue: mockTagRepo },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll returns paginated result', async () => {
    const result = await service.findAll({});
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('total');
  });

  it('findOne throws NotFoundException when post does not exist', async () => {
    qb.getOne.mockResolvedValueOnce(null);
    await expect(service.findOne('nonexistent')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('like throws ConflictException when already liked', async () => {
    mockLikeRepo.findOne.mockResolvedValueOnce({ id: 'l1' });
    await expect(service.like('p1', 'u1')).rejects.toThrow(ConflictException);
  });

  it('unlike throws NotFoundException when like does not exist', async () => {
    mockLikeRepo.findOne.mockResolvedValueOnce(null);
    await expect(service.unlike('p1', 'u1')).rejects.toThrow(NotFoundException);
  });
});
