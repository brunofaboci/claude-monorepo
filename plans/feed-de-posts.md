# Plano: Feed de Posts

## Prompt
```bash
https://www.figma.com/design/EZlRk4Xi70UaUOuXkQpdCU/CodeConnect---Acervo---Fa%C3%A7a-uma-c%C3%B3pia---Community-?node-id=155-3099&t=g3HaqDI1KWQz4iDG-4

implemente essa pagina de feed de posts.
crie os modelos no backend + migrations necessarias

implemente um seed gerando posts mockados e implemente uma solucao para quando o thumbnail de um post nao exista, tipo um placeholder.

frontend: atencao! - siga as regras atuais. reaproveite componentes ja existentes se possivel.
usuarios nao logados podem ver o feed, mas nao podem comentar nem curtir um post.
usuarios logados podem criar posts, curtir e comentar livremente.
a pagina de feed e detalhes de um post possuem elementos parecidos, use layouts para reaproveita-los.
no menu lateral, existe um link que muda de acordo com o status do usuario logado: login/sair, dependendo do estado da sessao atual.

a parte de filtro é um full text search e funciona do lado do backend.
```

## Contexto

O projeto precisa de uma funcionalidade de feed de posts baseada no design do Figma. A pagina mostra um sidebar lateral com navegacao + area principal com busca full-text, filtros por tags, ordenacao por tabs (Recentes/Populares), e um grid 2-colunas de cards de posts. Usuarios nao logados podem visualizar o feed, mas so logados podem curtir, comentar e criar posts. O link "Sair/Login" no sidebar muda conforme o estado de autenticacao.

**Figma**: https://www.figma.com/design/EZlRk4Xi70UaUOuXkQpdCU/CodeConnect---Acervo---Fa%C3%A7a-uma-c%C3%B3pia---Community-?node-id=155-3099

**Decisoes confirmadas com o usuario**:
- Tabs: Recentes / Populares (sort por data vs curtidas)
- Publicar: Abre modal de criacao de post
- Post detail: Card expandido com thumbnail grande + conteudo completo + comentarios

---

## Fase 1: Backend — Entidades e Modulos

### 1.1 Entidades (TypeORM, synchronize:true gera as tabelas automaticamente)

**`apps/api/src/posts/entities/post.entity.ts`** — Post
- `id` (uuid PK), `title` (varchar), `description` (text), `thumbnailUrl` (varchar, nullable), `authorId` (uuid FK->users), `author` (ManyToOne->User), `tags` (ManyToMany->Tag via `post_tags`), `comments` (OneToMany->Comment), `likes` (OneToMany->Like), `createdAt`, `updatedAt`

**`apps/api/src/posts/entities/comment.entity.ts`** — Comment
- `id` (uuid PK), `content` (text), `postId` (uuid FK), `post` (ManyToOne->Post), `authorId` (uuid FK), `author` (ManyToOne->User), `createdAt`

**`apps/api/src/posts/entities/like.entity.ts`** — Like
- `id` (uuid PK), `postId` (uuid FK), `post` (ManyToOne->Post), `userId` (uuid FK), `user` (ManyToOne->User), `createdAt`
- Unique constraint em `(postId, userId)`

**`apps/api/src/tags/entities/tag.entity.ts`** — Tag
- `id` (uuid PK), `name` (varchar, unique), `posts` (ManyToMany->Post, lado inverso)

### 1.2 Modulos

**`apps/api/src/posts/posts.module.ts`** — registra Post, Comment, Like no TypeOrmModule.forFeature; importa UsersModule e TagsModule

**`apps/api/src/tags/tags.module.ts`** — registra Tag no TypeOrmModule.forFeature; exporta TagsService

**`apps/api/src/app.module.ts`** — adicionar PostsModule e TagsModule nos imports

---

## Fase 2: Backend — DTOs, Services, Controllers

### 2.1 DTOs

| Arquivo | Campos |
|---------|--------|
| `posts/dto/create-post.dto.ts` | title, description, thumbnailUrl?, tagIds? |
| `posts/dto/post-response.dto.ts` | id, title, description, thumbnailUrl, author{id,name}, tags[], likesCount, commentsCount, isLikedByMe, createdAt |
| `posts/dto/post-query.dto.ts` | search?, tags? (comma-sep), sort? (recent/popular), page?, limit? |
| `posts/dto/create-comment.dto.ts` | content |
| `posts/dto/comment-response.dto.ts` | id, content, author{id,name}, createdAt |
| `tags/dto/tag-response.dto.ts` | id, name |

### 2.2 OptionalJwtAuthGuard

**`apps/api/src/auth/optional-jwt-auth.guard.ts`** — estende JwtAuthGuard, override `handleRequest` para retornar null ao inves de lancar excecao quando token ausente/invalido. Permite endpoints publicos terem `req.user` populado opcionalmente.

### 2.3 Services

**PostsService** (`posts/posts.service.ts`):
- `findAll(query, userId?)` — QueryBuilder com full-text search via `to_tsvector('portuguese', title || ' ' || description) @@ plainto_tsquery('portuguese', :search)`. Filtra por tags, ordena por recent/popular, pagina.
- `findOne(id, userId?)` — Post com relations (author, tags, comments.author). Inclui likesCount, commentsCount, isLikedByMe.
- `create(dto, authorId)` — Cria post, associa tags, retorna.
- `like(postId, userId)` / `unlike(postId, userId)` — Gerencia likes com constraint unica.
- `addComment(postId, userId, dto)` — Cria comentario.

**TagsService** (`tags/tags.service.ts`):
- `findAll()` — todas as tags ordenadas por nome.

### 2.4 Controllers

**PostsController** (`posts/posts.controller.ts`):

| Metodo | Rota | Guard | Descricao |
|--------|------|-------|-----------|
| GET | `/posts` | OptionalJwtAuthGuard | Lista posts (publico, isLikedByMe se logado) |
| GET | `/posts/:id` | OptionalJwtAuthGuard | Detalhe do post (publico) |
| POST | `/posts` | JwtAuthGuard | Criar post (201 + Location) |
| POST | `/posts/:id/likes` | JwtAuthGuard | Curtir post (201) |
| DELETE | `/posts/:id/likes` | JwtAuthGuard | Descurtir (204) |
| POST | `/posts/:id/comments` | JwtAuthGuard | Comentar (201) |

**TagsController** (`tags/tags.controller.ts`):

| Metodo | Rota | Guard | Descricao |
|--------|------|-------|-----------|
| GET | `/tags` | Nenhum | Lista todas as tags |

### 2.5 Testes unitarios

- `posts/posts.service.spec.ts`, `posts/posts.controller.spec.ts`
- `tags/tags.service.spec.ts`, `tags/tags.controller.spec.ts`

### 2.6 CORS

Verificar se CORS esta habilitado em `main.ts` para permitir requisicoes do frontend. Adicionar `app.enableCors()` se necessario.

---

## Fase 3: Backend — Seed Script

**`apps/api/src/seed.ts`** — script standalone que:
1. Cria 3-5 usuarios com senhas hasheadas
2. Cria 8-10 tags (Front-end, React, TypeScript, Acessibilidade, Node.js, CSS, UX, DevOps, etc.)
3. Cria 15-20 posts com titulos/descricoes variados, tags aleatorias, alguns sem thumbnail (testa placeholder)
4. Cria likes e comentarios aleatorios

**Scripts**:
- `apps/api/package.json`: adicionar `"seed": "ts-node src/seed.ts"`
- root `package.json`: adicionar `"api:seed": "pnpm --filter api seed"`

---

## Fase 4: Frontend — Atoms, Molecules, Organisms e Template

### 4.1 Requisitos Previos

- Adicionar fonte Material Symbols Outlined em `apps/web/index.html`
- Adicionar token `--color-dark-input-light: #bcbcbc` em index.css (cinza claro do Figma para texto de cards)

### 4.2 Novos Atoms

| Componente | Props | Descricao |
|-----------|-------|-----------|
| `atoms/MaterialIcon/` | name, className? | Renderiza icone Material Symbols |
| `atoms/Tag/` | label, onRemove?, variant?(filter/card) | Chip de tag, com ou sem botao de remover |
| `atoms/Avatar/` | src?, name, size? | Avatar circular com fallback de iniciais |

Reutilizar: `Button` (variant ghost para "Publicar"), `Input` (base para busca), `TextLink` ("Limpar tudo"), `Heading`.

### 4.3 Novas Molecules

| Componente | Descricao |
|-----------|-----------|
| `molecules/FilterTagList/` | Linha de Tags com remocao + "Limpar tudo" (TextLink) |
| `molecules/PostCardFooter/` | Icones de acao (like, share, comment + contagens) + Avatar + @username do autor |
| `molecules/NavItem/` | Item de nav do sidebar: MaterialIcon + label, usa NavLink do react-router para estado ativo |

### 4.4 Novos Organisms

| Componente | Descricao |
|-----------|-----------|
| `organisms/PostCard/` | Card completo: thumbnail (ou placeholder com icone "code"), titulo, descricao, tags, footer. Clicavel -> `/posts/:id` |
| `organisms/Sidebar/` | Logo, botao "Publicar" (ghost, abre modal de criacao — so se logado), nav links (Feed, Perfil, Sobre nos), link contextual Login/Sair via `useAuth()` |
| `organisms/CommentSection/` | Lista de comentarios + formulario de novo comentario (se logado) |
| `organisms/CreatePostModal/` | Modal/dialog para criar post: titulo, descricao, thumbnail URL (opcional), selecao de tags. Chamado pelo botao "Publicar" do Sidebar. |

### 4.5 Novo Template

**`templates/FeedTemplate/`** — Layout 2 colunas: Sidebar fixo a esquerda + area de conteudo principal (children). Slot-based, sem data fetching. Reutilizado por FeedPage e PostDetailPage.

### 4.6 Testes

Cada componente tera `ComponentName.test.tsx` co-localizado com testes de renderizacao e comportamento principal.

---

## Fase 5: Frontend — API, Pages e Rotas

### 5.1 Camada de API

**`apps/web/src/lib/types.ts`** — adicionar tipos: PostResponse, PostDetailResponse, CommentResponse, TagResponse, PaginatedResponse, CreatePostRequest, CreateCommentRequest

**`apps/web/src/lib/posts-api.ts`** — funcoes: getPosts, getPost, createPost, likePost, unlikePost, addComment, getTags (todas usando `http` do axios.ts)

### 5.2 Pages

**`pages/FeedPage/`** — Busca posts e tags. Gerencia estado de busca, filtros ativos, ordenacao (tabs **Recentes/Populares**). Renderiza FeedTemplate com SearchInput + FilterTagList + tabs + grid de PostCards (2 colunas). Inclui **modal de criacao de post** (aberto pelo botao "Publicar" do sidebar). O modal tem campos: titulo, descricao, thumbnail URL (opcional), selecao de tags.

**`pages/PostDetailPage/`** — Usa `useParams()` para `:id`. Busca post unico. Renderiza FeedTemplate com **card expandido**: thumbnail grande no topo, titulo, descricao completa, tags, acoes (like/share), e **secao de comentarios** abaixo (CommentSection).

### 5.3 Rotas (App.tsx)

```
/feed           → FeedPage (publico)
/posts/:id      → PostDetailPage (publico)
/login          → LoginPage (GuestRoute)
/signup         → SignupPage (GuestRoute)
/               → Navigate to /feed
*               → Navigate to /feed
```

Remover ou redirecionar HomePage para /feed. Feed e a nova pagina principal.

### 5.4 Interceptor Axios

Modificar o interceptor 401 em `axios.ts`: remover o `window.location.href = '/login'` automatico. Apenas limpar o token e rejeitar a promise. Paginas publicas nao devem redirecionar em 401.

---

## Fase 6: Verificacao

### Como testar

1. `docker-compose up` (PostgreSQL)
2. `pnpm api:seed` (popular dados)
3. `pnpm dev` (subir ambos apps)
4. Abrir `http://localhost:5173/feed` sem login → deve ver o feed, cards, busca
5. Tentar curtir/comentar sem login → deve ser impedido (redirect para login ou mensagem)
6. Fazer login → voltar ao feed → curtir, comentar, criar post
7. Testar busca full-text digitando termos
8. Testar filtro por tags e "Limpar tudo"
9. Clicar em card → pagina de detalhe com comentarios
10. Verificar link Sair no sidebar (logado) vs Login (deslogado)
11. `pnpm test` — rodar todos os testes
12. `pnpm lint` — verificar lint

### Arquivos criticos a modificar

- `apps/api/src/app.module.ts` — registrar novos modulos
- `apps/web/src/App.tsx` — novas rotas
- `apps/web/src/lib/axios.ts` — fix interceptor 401
- `apps/web/index.html` — fonte Material Symbols
- `apps/web/src/index.css` — token adicional se necessario
- root `package.json` — script api:seed
