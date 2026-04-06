# Plano: Página de Login

## Contexto
O app web (`apps/web`) está com o template padrão do Vite. Precisamos criar a página de login seguindo o design fornecido (screenshot), usando Atomic Design e Tailwind CSS. A página de cadastro futura vai compartilhar o mesmo layout base (template), então a arquitetura precisa prever reuso.

## Fase 1: Dependências e Configuração

### Instalar pacotes
```bash
pnpm --filter web add -D tailwindcss @tailwindcss/vite
pnpm --filter web add react-router-dom
pnpm --filter web add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @types/react-router-dom
```

### Configurar Tailwind v4 + Vitest
- **`apps/web/vite.config.ts`** — adicionar plugin `@tailwindcss/vite` + config do Vitest
- **`apps/web/src/index.css`** — substituir completamente com `@import "tailwindcss"` + `@theme` com cores do design (dark theme)
- **`apps/web/src/test/setup.ts`** — criar com `import '@testing-library/jest-dom'`
- **`apps/web/package.json`** — adicionar script `"test": "vitest run"`
- **Deletar** `apps/web/src/App.css`

### Cores do tema (extraídas do screenshot)
```css
@theme {
  --color-dark-bg: #1a1a2e;
  --color-dark-surface: #16213e;
  --color-dark-input: #2a2a4a;
  --color-dark-border: #3a3a5a;
  --color-accent-green: #00e887;
  --color-text-primary: #ffffff;
  --color-text-secondary: #9ca3af;
  --color-text-muted: #6b7280;
}
```

## Fase 2: Componentes (Atomic Design)

### Atoms (`src/components/atoms/`)
| Componente | Responsabilidade |
|---|---|
| **Button** | Botão com variantes `primary` (verde gradiente) e `ghost` |
| **Input** | Input de texto dark-themed (text, password, email) |
| **Checkbox** | Checkbox estilizado com label |
| **Label** | Label de formulário |
| **Heading** | Heading configurável (h1-h6) |
| **TextLink** | Link estilizado com variantes `default` e `accent` (verde) |
| **Divider** | Linha horizontal com texto centralizado ("ou entre com outras contas") |

### Molecules (`src/components/molecules/`)
| Componente | Composição |
|---|---|
| **FormField** | Label + Input |
| **SocialLoginButton** | Imagem + label text, clicável |
| **RememberForgotRow** | Checkbox "Lembrar-me" + TextLink "Esqueci a senha" |

### Organisms (`src/components/organisms/`)
| Componente | Composição |
|---|---|
| **LoginForm** | Heading + subtitle + FormFields + RememberForgotRow + Button + Divider + SocialLoginButtons + signup link. Gerencia estado do form e recebe `onSubmit` callback |

### Templates (`src/components/templates/`)
| Componente | Responsabilidade |
|---|---|
| **AuthTemplate** | Layout duas colunas reutilizável. Props: `bannerSrc`, `bannerAlt`, `children`. Esquerda: banner com logo "code connect" overlay. Direita: slot para conteúdo (form). **Chave do reuso** — signup usa o mesmo template com banner e form diferentes |

### Pages (`src/pages/`)
| Componente | Responsabilidade |
|---|---|
| **LoginPage** | Compõe AuthTemplate + LoginForm. Único lugar que faz data fetching |

## Fase 3: Routing

Reescrever `App.tsx`:
```tsx
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
</BrowserRouter>
```

## Fase 4: Limpeza
- Deletar `App.css`, `assets/react.svg`, `assets/vite.svg`, `assets/hero.png`
- Remover `#root` styles do `index.css`

## Ordem de Implementação
1. Instalar dependências
2. Configurar Tailwind v4 + Vitest + index.css
3. Criar estrutura de pastas
4. Atoms (todos em paralelo — sem dependências internas)
5. Molecules (dependem de atoms)
6. Organisms (LoginForm)
7. Templates (AuthTemplate)
8. Pages (LoginPage)
9. Routing (App.tsx)
10. Testes dos componentes
11. Limpeza de arquivos antigos

## Estratégia de Reuso para Cadastro (futuro)
Quando a página de cadastro for necessária:
1. Criar `organisms/SignupForm` com os campos diferentes
2. Criar `pages/SignupPage` usando `AuthTemplate` com banner diferente + `SignupForm`
3. Adicionar rota `/signup` no App.tsx
4. Zero alterações no template

## Verificação
1. `pnpm web:dev` — página de login renderiza no browser
2. Visual match com o screenshot fornecido
3. `pnpm web:build` — build sem erros
4. `cd apps/web && pnpm test` — todos os testes passam
5. Responsividade: em telas pequenas, banner esconde e form ocupa tela inteira
