import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { SessionResponseDto } from '../src/auth/dto/session-response.dto';
import { UserResponseDto } from '../src/users/dto/user-response.dto';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const user = {
    name: 'João Silva',
    email: 'joao@exemplo.com',
    password: 'senha12345',
  };

  let accessToken: string;

  describe('POST /v1/users', () => {
    it('201 — creates a user and does not expose passwordHash', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/users')
        .send(user)
        .expect(201);

      const body = res.body as UserResponseDto & { passwordHash?: string };
      expect(body.id).toBeDefined();
      expect(body.name).toBe(user.name);
      expect(body.email).toBe(user.email);
      expect(body.passwordHash).toBeUndefined();
      expect(res.headers['location']).toMatch(/\/v1\/users\/.+/);
    });

    it('409 — rejects duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/v1/users')
        .send(user)
        .expect(409);
    });

    it('400 — rejects invalid email', async () => {
      await request(app.getHttpServer())
        .post('/v1/users')
        .send({ ...user, email: 'not-an-email' })
        .expect(400);
    });

    it('400 — rejects password shorter than 8 chars', async () => {
      await request(app.getHttpServer())
        .post('/v1/users')
        .send({ ...user, email: 'outro@exemplo.com', password: '123' })
        .expect(400);
    });
  });

  describe('POST /v1/sessions', () => {
    it('401 — rejects wrong password', async () => {
      await request(app.getHttpServer())
        .post('/v1/sessions')
        .send({ email: user.email, password: 'senhaerrada' })
        .expect(401);
    });

    it('201 — returns accessToken on valid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/sessions')
        .send({ email: user.email, password: user.password })
        .expect(201);

      const body = res.body as SessionResponseDto;
      expect(body.accessToken).toBeDefined();
      expect(body.tokenType).toBe('Bearer');
      expect(body.expiresIn).toBe(3600);
      accessToken = body.accessToken;
    });
  });

  describe('GET /v1/users/me', () => {
    it('401 — rejects request without token', async () => {
      await request(app.getHttpServer()).get('/v1/users/me').expect(401);
    });

    it('200 — returns the current user with valid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const body = res.body as UserResponseDto & { passwordHash?: string };
      expect(body.email).toBe(user.email);
      expect(body.name).toBe(user.name);
      expect(body.passwordHash).toBeUndefined();
    });
  });
});
