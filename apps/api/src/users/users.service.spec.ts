import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const mockUser: User = {
  id: 'uuid-123',
  name: 'João Silva',
  email: 'joao@exemplo.com',
  passwordHash: '$2b$10$hashedpassword',
  createdAt: new Date(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a user and hash the password', async () => {
      repo.findOneBy.mockResolvedValue(null);
      repo.create.mockReturnValue(mockUser);
      repo.save.mockResolvedValue(mockUser);

      const user = await service.create({
        name: 'João Silva',
        email: 'joao@exemplo.com',
        password: 'senha12345',
      });

      expect(user.id).toBeDefined();
      expect(user.name).toBe('João Silva');
      expect(user.email).toBe('joao@exemplo.com');
      expect(repo.save).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException when email already exists', async () => {
      repo.findOneBy.mockResolvedValue(mockUser);

      await expect(
        service.create({
          name: 'Outro',
          email: 'joao@exemplo.com',
          password: 'outrasenha',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findByEmail', () => {
    it('should return the user with matching email', async () => {
      repo.findOneBy.mockResolvedValue(mockUser);

      const found = await service.findByEmail('joao@exemplo.com');
      expect(found).toBe(mockUser);
    });

    it('should return null for unknown email', async () => {
      repo.findOneBy.mockResolvedValue(null);

      const found = await service.findByEmail('naoexiste@exemplo.com');
      expect(found).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return the user with matching id', async () => {
      repo.findOneBy.mockResolvedValue(mockUser);

      const found = await service.findById('uuid-123');
      expect(found).toBe(mockUser);
    });

    it('should return null for unknown id', async () => {
      repo.findOneBy.mockResolvedValue(null);

      const found = await service.findById('00000000-0000-0000-0000-000000000000');
      expect(found).toBeNull();
    });
  });
});
