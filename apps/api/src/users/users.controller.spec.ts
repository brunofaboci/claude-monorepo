import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUser = {
  id: 'uuid-123',
  name: 'João Silva',
  email: 'joao@exemplo.com',
  passwordHash: 'hashed',
  createdAt: new Date('2024-01-01'),
};

const mockResponse = {
  setHeader: jest.fn(),
} as unknown as Response;

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  describe('POST / (create)', () => {
    it('should return the created user without passwordHash', async () => {
      usersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(
        {
          name: 'João Silva',
          email: 'joao@exemplo.com',
          password: 'senha12345',
        },
        mockResponse,
      );

      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
      });
      expect(Object.keys(result)).not.toContain('passwordHash');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Location',
        `/v1/users/${mockUser.id}`,
      );
    });

    it('should propagate ConflictException from service', async () => {
      usersService.create.mockRejectedValue(
        new ConflictException('Email already in use'),
      );

      await expect(
        controller.create(
          { name: 'João', email: 'joao@exemplo.com', password: 'senha12345' },
          mockResponse,
        ),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('GET /me', () => {
    it('should return the current user without passwordHash', () => {
      const result = controller.getMe({ user: mockUser });

      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
      });
      expect(Object.keys(result)).not.toContain('passwordHash');
    });
  });
});
