import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a user and hash the password', async () => {
      const user = await service.create({
        name: 'João Silva',
        email: 'joao@exemplo.com',
        password: 'senha12345',
      });

      expect(user.id).toBeDefined();
      expect(user.name).toBe('João Silva');
      expect(user.email).toBe('joao@exemplo.com');
      expect(user.passwordHash).not.toBe('senha12345');
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should throw ConflictException when email already exists', async () => {
      await service.create({
        name: 'João',
        email: 'joao@exemplo.com',
        password: 'senha12345',
      });

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
      await service.create({
        name: 'Maria',
        email: 'maria@exemplo.com',
        password: 'senha12345',
      });

      const found = service.findByEmail('maria@exemplo.com');
      expect(found).toBeDefined();
      expect(found!.email).toBe('maria@exemplo.com');
    });

    it('should return undefined for unknown email', () => {
      expect(service.findByEmail('naoexiste@exemplo.com')).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should return the user with matching id', async () => {
      const created = await service.create({
        name: 'Pedro',
        email: 'pedro@exemplo.com',
        password: 'senha12345',
      });

      const found = service.findById(created.id);
      expect(found).toBeDefined();
      expect(found!.id).toBe(created.id);
    });

    it('should return undefined for unknown id', () => {
      expect(
        service.findById('00000000-0000-0000-0000-000000000000'),
      ).toBeUndefined();
    });
  });
});
