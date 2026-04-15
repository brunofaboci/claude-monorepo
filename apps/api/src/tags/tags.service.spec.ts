import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';

describe('TagsService', () => {
  let service: TagsService;

  const mockTags: Tag[] = [
    { id: '1', name: 'CSS', posts: [] },
    { id: '2', name: 'React', posts: [] },
  ];

  const mockRepo = {
    find: jest.fn().mockResolvedValue(mockTags),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        { provide: getRepositoryToken(Tag), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll returns tags sorted by name', async () => {
    const result = await service.findAll();
    expect(result).toEqual([
      { id: '1', name: 'CSS' },
      { id: '2', name: 'React' },
    ]);
  });
});
