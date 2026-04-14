import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockUser = {
  id: 'uuid-123',
  name: 'João Silva',
  email: 'joao@exemplo.com',
  passwordHash: 'hashed',
  createdAt: new Date(),
};

const mockSession = {
  accessToken: 'signed-token',
  tokenType: 'Bearer',
  expiresIn: 3600,
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  describe('POST / (login)', () => {
    it('should return a session when credentials are valid', async () => {
      authService.validateUser.mockResolvedValue(mockUser);
      authService.login.mockReturnValue(mockSession);

      const result = await controller.login({
        email: 'joao@exemplo.com',
        password: 'senha12345',
      });

      expect(result).toEqual(mockSession);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(
        controller.login({ email: 'joao@exemplo.com', password: 'errada' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
