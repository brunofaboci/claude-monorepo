# Plano: Integração Frontend ↔ Backend com Axios

## Prompt
```bash
@apps/api/package.json é o nosso backend.
temos swagger e endpoints de autenticacao.
precisamos integrar com esse backend, use axios pra isso.
```

## Contexto

O frontend (apps/web) tem páginas de Login e Signup prontas visualmente, mas sem integração com a API. Os handlers de submit apenas fazem `console.log`. O backend (apps/api) já tem endpoints de autenticação funcionais (JWT). Precisamos conectar os dois usando axios.

## Endpoints do Backend

| Método | Rota | Body | Resposta | Auth |
|--------|------|------|----------|------|
| POST | `/v1/sessions` | `{email, password}` | `{accessToken, tokenType, expiresIn}` | Não |
| POST | `/v1/users` | `{name, email, password}` | `{id, name, email, createdAt}` | Não |
| GET | `/v1/users/me` | — | `{id, name, email, createdAt}` | Bearer |

## Plano de Implementação

### 1. Instalar axios
```bash
pnpm --filter web add axios
```

### 2. Criar `apps/web/src/lib/types.ts` — Tipos da API
Tipos que espelham os DTOs do backend: `LoginRequest`, `RegisterRequest`, `SessionResponse`, `UserResponse`, `ApiError`.

### 3. Criar `apps/web/src/lib/axios.ts` — Instância HTTP
- Base URL: `import.meta.env.VITE_API_URL ?? 'http://localhost:3000/v1'`
- Request interceptor: anexa `Authorization: Bearer <token>` do localStorage
- Response interceptor: em caso de 401, limpa token e redireciona para `/login`

### 4. Criar `apps/web/src/lib/errors.ts` — Helper de erros
- `extractErrorMessage(error: unknown): string` — extrai mensagem do formato de erro do NestJS (string ou array)

### 5. Criar `apps/web/src/lib/auth-api.ts` — Funções da API
- `login(data: LoginRequest): Promise<SessionResponse>`
- `register(data: RegisterRequest): Promise<UserResponse>`
- `getMe(): Promise<UserResponse>`

### 6. Criar `apps/web/src/contexts/AuthContext.tsx` — Estado de autenticação
- **State**: `user`, `token`, `isAuthenticated`, `isLoading`
- **Actions**: `login(email, password)`, `register(name, email, password)`, `logout()`
- No mount: verifica token no localStorage, chama `getMe()` para validar
- `isLoading` previne flash da tela de login durante validação inicial
- Erros propagam para as pages (não são capturados no context)
- Hook `useAuth()` exportado do mesmo arquivo

### 7. Criar guards de rota — `apps/web/src/components/guards/`
- **ProtectedRoute.tsx**: redireciona para `/login` se não autenticado; mostra loading enquanto `isLoading`
- **GuestRoute.tsx**: redireciona para `/` se já autenticado

### 8. Modificar LoginForm e SignupForm — Adicionar props de feedback
- Novas props opcionais: `error?: string | null`, `isSubmitting?: boolean`
- Renderizar mensagem de erro acima do botão submit
- Desabilitar botão durante submissão

**Arquivos:**
- `apps/web/src/components/organisms/LoginForm/LoginForm.tsx`
- `apps/web/src/components/organisms/SignupForm/SignupForm.tsx`

### 9. Modificar LoginPage e SignupPage — Integrar com AuthContext
- Usar `useAuth()` para chamar `login`/`register`
- Estado local de `error` e `isSubmitting`
- **LoginPage**: mapear `identifier` → `email` (o form usa "identifier", a API espera "email")
- **SignupPage**: após registro, fazer login automaticamente
- Navegar para `/` em caso de sucesso

**Arquivos:**
- `apps/web/src/pages/LoginPage/LoginPage.tsx`
- `apps/web/src/pages/SignupPage/SignupPage.tsx`

### 10. Criar HomePage mínima — `apps/web/src/pages/HomePage/`
- Exibe "Bem-vindo, {user.name}" e email usando `useAuth()`
- Botão de logout que chama `auth.logout()`
- Usa atoms existentes (Heading, Button)

### 11. Atualizar App.tsx — AuthProvider + Guards + Rotas
```tsx
<BrowserRouter>
  <AuthProvider>
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </AuthProvider>
</BrowserRouter>
```

### 12. Testes
Novos testes co-localizados para:
- `lib/axios.test.ts`, `lib/auth-api.test.ts`
- `contexts/AuthContext.test.tsx`
- `components/guards/ProtectedRoute.test.tsx`, `GuestRoute.test.tsx`
- `pages/HomePage/HomePage.test.tsx`

Atualizar testes existentes:
- `LoginForm.test.tsx` — testar exibição de erro e estado disabled
- `SignupForm.test.tsx` — idem

## Arquivos Novos
```
apps/web/src/
  lib/
    types.ts
    axios.ts
    errors.ts
    auth-api.ts
  contexts/
    AuthContext.tsx
  components/guards/
    ProtectedRoute.tsx
    GuestRoute.tsx
  pages/HomePage/
    HomePage.tsx
    HomePage.test.tsx
    index.ts
```

## Arquivos Modificados
```
apps/web/package.json                          (axios adicionado)
apps/web/src/App.tsx                           (AuthProvider, guards, rotas)
apps/web/src/components/organisms/LoginForm/LoginForm.tsx
apps/web/src/components/organisms/SignupForm/SignupForm.tsx
apps/web/src/pages/LoginPage/LoginPage.tsx
apps/web/src/pages/SignupPage/SignupPage.tsx
```

## Verificação
1. `pnpm web:build` — deve compilar sem erros
2. Subir backend: `pnpm api:dev`
3. Subir frontend: `pnpm web:dev`
4. Testar fluxo de cadastro → login → ver dados do usuário → logout
5. Testar acesso direto a `/` sem token → redireciona para `/login`
6. Testar acesso a `/login` com token válido → redireciona para `/`
7. `pnpm web:test` — todos os testes passam
