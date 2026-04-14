import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { JwtStrategy } from './jwt.strategy';

const mockUser = {
  id: 'uuid-123',
  name: 'João Silva',
  email: 'joao@exemplo.com',
  passwordHash: 'hashed',
  createdAt: new Date(),
};

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UsersService,
          useValue: { findById: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { getOrThrow: jest.fn().mockReturnValue('test-secret') },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    usersService = module.get(UsersService);
  });

  describe('validate', () => {
    it('should return the user when payload is valid', () => {
      usersService.findById.mockReturnValue(mockUser);

      const result = strategy.validate({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toBe(mockUser);
    });

    it('should throw UnauthorizedException when user is not found', () => {
      usersService.findById.mockReturnValue(undefined);

      expect(() =>
        strategy.validate({ sub: 'invalid-id', email: 'test@test.com' }),
      ).toThrow(UnauthorizedException);
    });
  });
});
