# Plano: Substituir array in-memory por PostgreSQL com TypeORM

## Prompt
```bash
@apps/api/src/users/users.service.ts possui uma lista de usuarios em memoria.

precisamos de um banco de dados para persistir esses dados - use postgresql.
escolha o ORM mais adequado e justifique sua escolhe, alem disso, aponte outras ORMs que foram consideradas.
troque o array de usuarios por esse mecanismo.
atenção: para o postgres, crie um docker-compose na raiz do projeto ja montando o volume para mantermos os dados persistidos.
```

## Context

O `UsersService` em `apps/api/src/users/users.service.ts` armazena usuários em um array `User[]` na memória. Isso significa que os dados são perdidos a cada reinício do servidor. O objetivo é persistir os usuários em um banco PostgreSQL, usando um ORM adequado, e fornecer a infraestrutura Docker necessária para o banco.

---

## Escolha do ORM: TypeORM

**Justificativa:**
- Integração first-class com NestJS via `@nestjs/typeorm` — usa o padrão de módulos (`TypeOrmModule.forRoot()`, `TypeOrmModule.forFeature()`) que o CLAUDE.md exige
- Entidades são classes com decorators, alinhado ao estilo do projeto (já usa `emitDecoratorMetadata`, `experimentalDecorators`, class-validator, class-transformer)
- O `User` interface mapeia diretamente para `@Entity()` + `@Column()` + `@PrimaryGeneratedColumn('uuid')`
- Suporte nativo a PostgreSQL, migrations, e Repository pattern

**Alternativas consideradas:**
- **Prisma** — excelente type safety via cliente gerado, mas usa schema próprio (`.prisma`) e não segue o padrão de módulos/decorators do NestJS. Exigiria um `PrismaService` wrapper customizado. Menos idiomático para este projeto.
- **MikroORM** — boa alternativa com pacote `@mikro-orm/nestjs`. Menor adoção no ecossistema NestJS comparado ao TypeORM. Funcionaria, mas adiciona fricção de onboarding.
- **Drizzle** — leve e type-safe, mas muito novo, sem módulo oficial NestJS, e usa padrão funcional (sem decorators) que conflita com o estilo do projeto.

---

## Plano de implementação

### 1. Docker Compose + infraestrutura

**Criar** `docker-compose.yml` na raiz do projeto:
- Serviço `postgres` com imagem `postgres:16-alpine`
- Porta `5432:5432`
- Volume nomeado `pgdata` montado em `/var/lib/postgresql/data`
- Healthcheck com `pg_isready`
- Variáveis: `POSTGRES_USER=claude_user`, `POSTGRES_PASSWORD=claude_pass`, `POSTGRES_DB=claude_dev`

**Criar** `docker/init-test-db.sql` — script de inicialização para criar o banco de testes (`claude_test`)

**Atualizar** `apps/api/.env` e `apps/api/.env.example` — adicionar variáveis `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`

### 2. Instalar dependências

```bash
cd apps/api && pnpm add @nestjs/typeorm typeorm pg
```

### 3. Converter entidade User (interface → classe TypeORM)

**Arquivo:** `apps/api/src/users/entities/user.entity.ts`

- Trocar `interface` por `class` com decorators `@Entity('users')`, `@PrimaryGeneratedColumn('uuid')`, `@Column()`, `@CreateDateColumn()`
- Coluna `email` com `unique: true`
- Nomes de colunas em snake_case no banco (`password_hash`, `created_at`)

### 4. Configurar módulos

**`apps/api/src/app.module.ts`** — adicionar `TypeOrmModule.forRootAsync()` usando `ConfigService` para ler variáveis `DB_*`. Usar `autoLoadEntities: true` e `synchronize: true` (dev only).

**`apps/api/src/users/users.module.ts`** — adicionar `TypeOrmModule.forFeature([User])` nos imports.

### 5. Reescrever UsersService

**Arquivo:** `apps/api/src/users/users.service.ts`

- Injetar `Repository<User>` via `@InjectRepository(User)`
- Remover array `users: User[]`
- `create()` → `this.usersRepository.create()` + `this.usersRepository.save()`
- `findByEmail()` → `async`, retorna `Promise<User | null>` via `findOneBy({ email })`
- `findById()` → `async`, retorna `Promise<User | null>` via `findOneBy({ id })`
- Remover import de `randomUUID` (UUID gerado pelo banco)

### 6. Migração sync → async nos consumidores

Apenas **2 pontos** precisam de alteração:

| Arquivo | Mudança |
|---------|---------|
| `auth/auth.service.ts:16` | Adicionar `await` em `this.usersService.findByEmail(email)` |
| `auth/jwt.strategy.ts:25-30` | Tornar `validate()` async, adicionar `await` em `findById()` |

Ambos os contextos já suportam async (NestJS pipeline e Passport strategy).

### 7. Atualizar testes

**Testes unitários que NÃO precisam de mudança:**
- `users.controller.spec.ts` — já mocka UsersService com `mockResolvedValue`
- `auth.controller.spec.ts` — já mocka AuthService com `mockResolvedValue`

**Testes unitários que PRECISAM de mudança:**

| Arquivo | Mudanças |
|---------|----------|
| `auth/auth.service.spec.ts` | `mockReturnValue` → `mockResolvedValue`, `undefined` → `null` |
| `auth/jwt.strategy.spec.ts` | Tornar testes `async`, `mockReturnValue` → `mockResolvedValue`, `expect(() => ...).toThrow()` → `await expect(...).rejects.toThrow()`, `undefined` → `null` |
| `users/users.service.spec.ts` | Reescrever completamente — mockar `Repository<User>` via `getRepositoryToken(User)` em vez de usar implementação real |

**Teste E2E (`test/auth.e2e-spec.ts`):**
- Adicionar cleanup no `afterAll`: obter `DataSource` e chamar `synchronize(true)` para limpar tabelas entre execuções
- Requer `docker compose up -d` antes de rodar E2E

---

## Arquivos a criar/modificar

| Ação | Arquivo |
|------|---------|
| Criar | `docker-compose.yml` (raiz) |
| Criar | `docker/init-test-db.sql` |
| Modificar | `apps/api/package.json` (via pnpm add) |
| Modificar | `apps/api/.env` |
| Modificar | `apps/api/.env.example` |
| Modificar | `apps/api/src/users/entities/user.entity.ts` |
| Modificar | `apps/api/src/app.module.ts` |
| Modificar | `apps/api/src/users/users.module.ts` |
| Modificar | `apps/api/src/users/users.service.ts` |
| Modificar | `apps/api/src/auth/auth.service.ts` |
| Modificar | `apps/api/src/auth/jwt.strategy.ts` |
| Modificar | `apps/api/src/users/users.service.spec.ts` |
| Modificar | `apps/api/src/auth/auth.service.spec.ts` |
| Modificar | `apps/api/src/auth/jwt.strategy.spec.ts` |
| Modificar | `apps/api/test/auth.e2e-spec.ts` |

---

## Verificação

1. `docker compose up -d` — subir o PostgreSQL
2. `pnpm api:build` — compilar sem erros
3. `pnpm api:test` — todos os testes unitários passando
4. `pnpm api:dev` — servidor inicia e conecta ao banco
5. Testar manualmente via Swagger (`/docs`):
   - POST `/v1/users` — criar usuário
   - POST `/v1/sessions` — fazer login
   - GET `/v1/users/me` — verificar usuário autenticado
   - Reiniciar o servidor e verificar que o usuário persiste
6. `cd apps/api && pnpm test:e2e` — E2E passando contra banco de testes
