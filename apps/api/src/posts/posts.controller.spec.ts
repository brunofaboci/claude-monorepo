import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
  let controller: PostsController;

  const mockPost = {
    id: 'p1',
    title: 'Test Post',
    description: 'Test description for the post',
    thumbnailUrl: null,
    author: { id: 'u1', name: 'Test User' },
    tags: [],
    likesCount: 0,
    commentsCount: 0,
    isLikedByMe: false,
    createdAt: new Date(),
  };

  const mockService = {
    findAll: jest
      .fn()
      .mockResolvedValue({ data: [mockPost], total: 1, page: 1, limit: 12 }),
    findOne: jest.fn().mockResolvedValue({ ...mockPost, comments: [] }),
    create: jest.fn().mockResolvedValue(mockPost),
    like: jest.fn().mockResolvedValue(undefined),
    unlike: jest.fn().mockResolvedValue(undefined),
    addComment: jest.fn().mockResolvedValue({
      id: 'c1',
      content: 'test',
      author: mockPost.author,
      createdAt: new Date(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [{ provide: PostsService, useValue: mockService }],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll returns paginated posts', async () => {
    const result = await controller.findAll({} as any, { user: null } as any);
    expect(result).toHaveProperty('data');
    expect(result.data).toHaveLength(1);
  });

  it('findOne returns a single post', async () => {
    const result = await controller.findOne('p1', { user: null } as any);
    expect(result).toHaveProperty('id', 'p1');
  });

  it('like calls service', async () => {
    await controller.like('p1', { user: { id: 'u1' } } as any);
    expect(mockService.like).toHaveBeenCalledWith('p1', 'u1');
  });

  it('unlike calls service', async () => {
    await controller.unlike('p1', { user: { id: 'u1' } } as any);
    expect(mockService.unlike).toHaveBeenCalledWith('p1', 'u1');
  });
});
