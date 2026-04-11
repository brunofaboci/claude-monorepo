# Plano: Página de Cadastro + Ajustes Finos (Figma)

## Contexto
A página de login já existe e funciona. Agora precisamos:
1. **Ajustar o tema e componentes existentes** para alinhar com o design de alta fidelidade do Figma (node `155:3469`)
2. **Criar a página de cadastro** reaproveitando AuthTemplate e atoms/molecules existentes

O Figma hi-fi usa cores, fontes e estilos diferentes do que foi implementado inicialmente. As diferenças são detalhadas abaixo.

## Fase 1: Ajustes de Tema (index.css)

**Arquivo:** `apps/web/src/index.css`

Atualizar cores e fonte para match exato com o Figma:

| Token atual | Valor atual | Valor Figma | Nome Figma |
|---|---|---|---|
| `--color-dark-bg` | `#12121f` | `#00090e` | Grafite |
| `--color-dark-surface` | `#1a1a2e` | `#171d1f` | Cinza Escuro |
| `--color-dark-input` | `#1e1e35` | `#888888` | Cinza Médio |
| `--color-dark-border` | `#2e2e4a` | `#888888` | Cinza Médio |
| `--color-accent-green` | `#39e87a` | `#81fe88` | Verde destaque |
| `--color-text-primary` | `#ffffff` | `#e1e1e1` | Offwhite |

**Novos tokens:**
- `--color-btn-text: #132e35` (Verde petróleo — cor do texto do botão primário)
- `--color-accent-green-hover: #71ee78`

**Fonte:** Adicionar Google Font `Prompt` no `index.html` e atualizar `--font-sans`.

**Body bg:** atualizar para `#00090e`

## Fase 2: Ajustes Finos nos Componentes Existentes

### AuthTemplate (`templates/AuthTemplate/AuthTemplate.tsx`)
- Envolver o conteúdo em um card visível: `bg-dark-surface border border-black rounded-[32px] px-16 py-14`
- Banner height ajustar para `h-[675px]` (Figma)

### Button (`atoms/Button/Button.tsx`)
- `primary` variant: `text-btn-text` em vez de `text-dark-bg`
- Border radius: `rounded-lg` (8px) em vez de `rounded-xl`

### Input (`atoms/Input/Input.tsx`)
- Background: `bg-dark-input` (agora #888)
- Text color: `text-dark-surface` (texto escuro no input claro)
- Placeholder: `placeholder:text-dark-surface`
- Border radius: `rounded-[4px]` em vez de `rounded-lg`
- Remover border (input Figma não tem borda visível)

### Label (`atoms/Label/Label.tsx`)
- Text color: `text-text-primary` em vez de `text-text-secondary`
- Font size: `text-lg` (18px Figma) em vez de `text-sm`

### Heading (`atoms/Heading/Heading.tsx`)
- h1: `text-[31px] font-semibold` (Figma: Subtitle Large Semibold 31px)

### Divider (`atoms/Divider/Divider.tsx`)
- Text: `text-text-primary` em vez de `text-text-muted` (Figma: #e1e1e1)
- Font size: `text-[15px]` (Paragraph Small)

### SocialLoginButton (`molecules/SocialLoginButton/SocialLoginButton.tsx`)
- Remover bg/border do círculo (Figma não tem container visual)
- Label color: `text-text-primary` em vez de `text-text-secondary`

### LoginForm (`organisms/LoginForm/LoginForm.tsx`)
- Subtitle: `text-[22px]` (Figma: Paragraph Large 22px), remover `text-sm`
- Subtitle color: `text-text-primary` em vez de `text-accent-green`
- Ajustar texto do subtitle para "Boas-vindas! Faça seu login."

## Fase 3: Página de Cadastro (Novos Componentes)

### SignupForm organism (`organisms/SignupForm/`)
Baseado no Figma node `155:3469`. Campos:
- **Nome** (text) — placeholder "Nome completo"
- **Email** (email) — placeholder "Digite seu email"
- **Senha** (password) — placeholder "******"
- **Checkbox** "Lembrar-me" (sem "Esqueci a senha")
- **Botão** "Cadastrar →"
- **Divider** "ou entre com outras contas"
- **Social** Github + Gmail
- **Footer** "Já tem conta?" + link "Faça seu login!" → `/login`

Reutiliza: `Heading`, `FormField`, `Checkbox`, `Button`, `Divider`, `SocialLoginButton`, `TextLink`

### SignupPage page (`pages/SignupPage/`)
- Compõe `AuthTemplate` + `SignupForm`
- Usa o **mesmo banner** (`/banner-login.png`) — Figma mostra mesma imagem

### Routing (App.tsx)
- Adicionar `<Route path="/signup" element={<SignupPage />} />`

## Fase 4: Testes

### Novos testes:
- `organisms/SignupForm/SignupForm.test.tsx` — renderiza sem crash + submit com dados

### Testes existentes:
- Atualizar se necessário (ex: se placeholders mudarem)

## Arquivos a Modificar

| Arquivo | Ação |
|---|---|
| `apps/web/index.html` | Adicionar `<link>` Google Fonts Prompt |
| `apps/web/src/index.css` | Atualizar cores e font-family |
| `apps/web/src/components/templates/AuthTemplate/AuthTemplate.tsx` | Card wrapper |
| `apps/web/src/components/atoms/Button/Button.tsx` | text-btn-text, rounded-lg |
| `apps/web/src/components/atoms/Input/Input.tsx` | bg/text/placeholder/border-radius |
| `apps/web/src/components/atoms/Label/Label.tsx` | text color + size |
| `apps/web/src/components/atoms/Heading/Heading.tsx` | h1 size 31px semibold |
| `apps/web/src/components/atoms/Divider/Divider.tsx` | text color + size |
| `apps/web/src/components/molecules/SocialLoginButton/SocialLoginButton.tsx` | Remover circle container |
| `apps/web/src/components/organisms/LoginForm/LoginForm.tsx` | subtitle styling |
| `apps/web/src/App.tsx` | Adicionar rota /signup |

## Arquivos Novos

| Arquivo | Descrição |
|---|---|
| `apps/web/src/components/organisms/SignupForm/SignupForm.tsx` | Form de cadastro |
| `apps/web/src/components/organisms/SignupForm/index.ts` | Barrel export |
| `apps/web/src/components/organisms/SignupForm/SignupForm.test.tsx` | Teste |
| `apps/web/src/pages/SignupPage/SignupPage.tsx` | Página de cadastro |
| `apps/web/src/pages/SignupPage/index.ts` | Barrel export |

## Verificação
1. `pnpm web:dev` — login e cadastro renderizam em `/login` e `/signup`
2. Visual match com Figma hi-fi (node 155:3469)
3. Links "Crie seu cadastro" → `/signup` e "Faça seu login" → `/login` navegam corretamente
4. `pnpm web:build` — sem erros
5. `pnpm web:test` — todos os testes passam (existentes + novos)
