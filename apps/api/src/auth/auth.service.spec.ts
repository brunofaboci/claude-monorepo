import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

const mockUser = {
  id: 'uuid-123',
  name: 'João Silva',
  email: 'joao@exemplo.com',
  passwordHash: '',
  createdAt: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeAll(async () => {
    mockUser.passwordHash = await bcrypt.hash('senha12345', 10);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: { findByEmail: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('signed-token') },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  describe('validateUser', () => {
    it('should return the user when credentials are valid', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser(
        'joao@exemplo.com',
        'senha12345',
      );
      expect(result).toBe(mockUser);
    });

    it('should return null when password is wrong', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser(
        'joao@exemplo.com',
        'senhaerrada',
      );
      expect(result).toBeNull();
    });

    it('should return null when user does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(
        'naoexiste@exemplo.com',
        'senha12345',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a session with accessToken', () => {
      const result = service.login(mockUser);

      expect(result.accessToken).toBe('signed-token');
      expect(result.tokenType).toBe('Bearer');
      expect(result.expiresIn).toBe(3600);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });
  });
});
