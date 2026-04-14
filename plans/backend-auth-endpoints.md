# Plano: Backend de autenticação (cadastro + login JWT + /me)

## Context

Implementar 3 endpoints no NestJS 11 (`apps/api`):

1. **Cadastro** — recebe `name`, `email`, `password`.
2. **Login** — valida credenciais, retorna JWT.
3. **Obter usuário logado** — protegido por auth guard, retorna o usuário atual.

O backend hoje é apenas o scaffold do `nest new` (um `AppController` de exemplo, `AppModule` vazio, sem Swagger, sem `ValidationPipe`, sem prefix `/v1`). Tudo será construído do zero.

Restrições acordadas com o usuário:
- Rotas: `POST /v1/users`, `POST /v1/sessions`, `GET /v1/users/me` (RESTful, recursos como substantivos).
- Hash de senha: **bcrypt**.
- Módulos separados: `users/` + `auth/`.
- Config via `.env` usando `@nestjs/config`; `JWT_SECRET` no env, expiração `1h`.
- Armazenamento **em memória** (array dentro de `UsersService`). Sem ORM/banco.
- Swagger documentando inputs e outputs dos 3 endpoints.

---

## 1. Dependências a instalar

Editar [apps/api/package.json](../apps/api/package.json) e rodar `pnpm install` a partir da raiz (monorepo pnpm).

**`dependencies`:**
- `@nestjs/swagger`
- `@nestjs/jwt`
- `@nestjs/passport`
- `@nestjs/config`
- `passport`
- `passport-jwt`
- `bcrypt`
- `class-validator`
- `class-transformer`

**`devDependencies`:**
- `@types/passport-jwt`
- `@types/bcrypt`

---

## 2. Bootstrap e configuração global

### [apps/api/src/main.ts](../apps/api/src/main.ts) (editar)

Adicionar:
- `app.setGlobalPrefix('v1')` — prefixo de versionamento exigido pelo CLAUDE.md.
- `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))` — habilita validação de DTOs via `class-validator`.
- Setup do Swagger:
  ```ts
  const config = new DocumentBuilder()
    .setTitle('Claude AI API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));
  ```
  Swagger UI disponível em `http://localhost:3000/docs`.

### [apps/api/src/app.module.ts](../apps/api/src/app.module.ts) (editar)

- Importar `ConfigModule.forRoot({ isGlobal: true })`.
- Importar `UsersModule` e `AuthModule`.
- Remover `AppController`/`AppService` do scaffold (substituídos pelos novos módulos).

### `apps/api/.env` (criar) e `apps/api/.env.example` (criar)

```
JWT_SECRET=dev-only-change-me
JWT_EXPIRES_IN=1h
```
Adicionar `.env` ao `.gitignore` do app se ainda não estiver.

---

## 3. Módulo `users/`

Criar `apps/api/src/users/` com:

### `users.module.ts`
Exporta `UsersService` para que `AuthModule` possa injetá-lo.

### `users.service.ts`
Store em memória:
```ts
private readonly users: User[] = [];
```
Onde `User = { id: string; name: string; email: string; passwordHash: string; createdAt: Date }`.

Métodos:
- `create(dto: CreateUserDto): Promise<User>` — verifica email duplicado (lança `ConflictException` → **409**), faz `bcrypt.hash(password, 10)`, gera `id` via `randomUUID()` do `node:crypto` (sem dep nova), adiciona ao array e retorna o user.
- `findByEmail(email: string): User | undefined`
- `findById(id: string): User | undefined`

### `users.controller.ts`
- `@Controller('users')` (com prefix global vira `/v1/users`).
- `POST /` → `create(@Body() dto: CreateUserDto)` — retorna **201** com `UserResponseDto` (sem `passwordHash`). Adicionar header `Location: /v1/users/:id` via `@Res({ passthrough: true })` para cumprir a regra REST do CLAUDE.md.
- `GET /me` → protegido por `JwtAuthGuard`, devolve `UserResponseDto` do `req.user`. Decorado com `@ApiBearerAuth()`.

### `dto/create-user.dto.ts`
```ts
export class CreateUserDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString() @IsNotEmpty() @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 'joao@exemplo.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'senhaForte123', minLength: 8 })
  @IsString() @MinLength(8) @MaxLength(128)
  password!: string;
}
```

### `dto/user-response.dto.ts`
`id`, `name`, `email`, `createdAt` — todos com `@ApiProperty`. **Nunca** expor `passwordHash`. Criar função `toUserResponse(user: User): UserResponseDto` no próprio arquivo do DTO para centralizar a sanitização.

### Testes co-localizados
- `users.service.spec.ts` — cobre `create` (sucesso + conflito de email) e `findByEmail`/`findById`.
- `users.controller.spec.ts` — cobre `POST /users` e o fluxo do `GET /me` com `UsersService` mockado.

---

## 4. Módulo `auth/`

Criar `apps/api/src/auth/` seguindo o padrão da doc oficial do Nest (docs.nestjs.com/security/authentication).

### `auth.module.ts`
```ts
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN', '1h') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
```

### `auth.service.ts`
- `validateUser(email, password)` — `usersService.findByEmail`, `bcrypt.compare`, retorna `user` ou `null`.
- `login(user)` — assina `{ sub: user.id, email: user.email }` com `JwtService`, retorna:
  ```ts
  { accessToken: string, tokenType: 'Bearer', expiresIn: 3600 }
  ```

### `auth.controller.ts`
- `@Controller('sessions')` → rota `POST /v1/sessions`.
- `POST /` recebe `LoginDto`; se `validateUser` retornar `null`, lança `UnauthorizedException` (**401**). Sucesso retorna **201** com `SessionResponseDto`.

### `jwt.strategy.ts`
Padrão da doc do Nest:
```ts
super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
});

async validate(payload: { sub: string; email: string }) {
  const user = this.usersService.findById(payload.sub);
  if (!user) throw new UnauthorizedException();
  return user; // populado em req.user
}
```

### `jwt-auth.guard.ts`
```ts
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### `dto/login.dto.ts`
`email` (`@IsEmail`) + `password` (`@IsString @IsNotEmpty`), ambos com `@ApiProperty`.

### `dto/session-response.dto.ts`
`accessToken`, `tokenType`, `expiresIn`, todos com `@ApiProperty`.

### Testes co-localizados
- `auth.service.spec.ts` — `validateUser` com credencial válida, inválida (senha errada), usuário inexistente; `login` produz token.
- `auth.controller.spec.ts` — `POST /sessions` 201 / 401.
- `jwt.strategy.spec.ts` — `validate` retorna usuário / lança 401.

---

## 5. Teste E2E

### `apps/api/test/auth.e2e-spec.ts` (criar)

Fluxo completo com supertest (mesmo padrão do `app.e2e-spec.ts` existente):
1. `POST /v1/users` com payload válido → 201, body sem `passwordHash`.
2. `POST /v1/users` com mesmo email → 409.
3. `POST /v1/users` com email inválido → 400 (ValidationPipe).
4. `POST /v1/sessions` com senha errada → 401.
5. `POST /v1/sessions` com credencial correta → 201 com `accessToken`.
6. `GET /v1/users/me` sem token → 401.
7. `GET /v1/users/me` com `Authorization: Bearer <token>` → 200 com o usuário cadastrado.

Apagar/atualizar `apps/api/test/app.e2e-spec.ts` (o teste atual bate em `GET /` que deixará de existir).

---

## 6. Arquivos a modificar/criar — resumo

**Modificar:**
- [apps/api/package.json](../apps/api/package.json) — deps
- [apps/api/src/main.ts](../apps/api/src/main.ts) — prefix, ValidationPipe, Swagger
- [apps/api/src/app.module.ts](../apps/api/src/app.module.ts) — ConfigModule, UsersModule, AuthModule
- `apps/api/test/app.e2e-spec.ts` — remover ou substituir

**Remover** (scaffold não usado):
- `apps/api/src/app.controller.ts`
- `apps/api/src/app.controller.spec.ts`
- `apps/api/src/app.service.ts`

**Criar:**
- `apps/api/.env`, `apps/api/.env.example`
- `apps/api/src/users/` (module, controller, service, 2 DTOs, 2 specs)
- `apps/api/src/auth/` (module, controller, service, strategy, guard, 2 DTOs, 3 specs)
- `apps/api/test/auth.e2e-spec.ts`

---

## 7. Verificação end-to-end

Da raiz do monorepo:

1. `pnpm install` — instala as novas dependências.
2. `pnpm api:lint` — sem erros.
3. `pnpm api:test` — todos os specs verdes.
4. `cd apps/api && pnpm test:e2e` — fluxo register → login → me passa.
5. `pnpm api:dev` — sobe em `:3000`.
6. Abrir `http://localhost:3000/docs` — Swagger UI mostra os 3 endpoints com schemas de request/response e botão "Authorize" (Bearer).
7. Teste manual via curl:
   ```bash
   curl -X POST http://localhost:3000/v1/users \
     -H 'Content-Type: application/json' \
     -d '{"name":"João","email":"joao@ex.com","password":"senha12345"}'
   # → 201 + UserResponseDto

   TOKEN=$(curl -s -X POST http://localhost:3000/v1/sessions \
     -H 'Content-Type: application/json' \
     -d '{"email":"joao@ex.com","password":"senha12345"}' | jq -r .accessToken)

   curl http://localhost:3000/v1/users/me -H "Authorization: Bearer $TOKEN"
   # → 200 + UserResponseDto
   ```

---

## 8. Observações e premissas

- Como o store é em memória, todo restart do servidor zera os usuários — esperado nesta fase.
- Commits seguirão Conventional Commits com scope `api` (ex.: `feat(api): add POST /v1/users endpoint`, `feat(api): add JWT authentication`, `test(api): add e2e auth flow`). Recomendação: 3–4 commits lógicos em vez de um só, para facilitar review.
- Quando migrar para banco real, `UsersService` é o único lugar que muda: trocar o array por um repositório; controllers, DTOs, guard e strategy permanecem idênticos.
