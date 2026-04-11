# Plan: Signup Page + Fine-Tuning (Figma hi-fi)

## Context
The login page exists and works. This plan aligns the existing theme/components with the Figma hi-fi design (node `155:3469`) and adds the signup page, reusing all existing atoms/molecules/templates.

---

## Phase 1 — Theme (2 files)

### `apps/web/index.html`
- Add Google Fonts `Prompt` link tag inside `<head>`:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&display=swap" rel="stylesheet">
  ```

### `apps/web/src/index.css`
Update `@theme` block — replace existing color tokens and font:

| Token | New value |
|---|---|
| `--color-dark-bg` | `#00090e` |
| `--color-dark-surface` | `#171d1f` |
| `--color-dark-input` | `#888888` |
| `--color-dark-border` | `#888888` |
| `--color-accent-green` | `#81fe88` |
| `--color-accent-green-hover` | `#71ee78` |
| `--color-text-primary` | `#e1e1e1` |
| `--font-sans` | `'Prompt', system-ui, -apple-system, sans-serif` |

Add new tokens:
- `--color-btn-text: #132e35`

Update `body` background: `#00090e`

---

## Phase 2 — Component Adjustments (8 files)

### `apps/web/src/components/templates/AuthTemplate/AuthTemplate.tsx`
- Wrap `children` slot div with card: add `bg-dark-surface border border-black rounded-[32px] px-16 py-14`
- Banner height: change `h-[580px]` → `h-[675px]`

### `apps/web/src/components/atoms/Button/Button.tsx`
- `primary` variant: `text-dark-bg` → `text-btn-text`
- Base classes: `rounded-xl` → `rounded-lg`

### `apps/web/src/components/atoms/Input/Input.tsx`
- `bg-dark-input` stays but now #888 (from theme)
- Add `text-dark-surface` for input text
- Change placeholder: `placeholder:text-text-muted` → `placeholder:text-dark-surface`
- Border radius: `rounded-lg` → `rounded-[4px]`
- Remove `border border-dark-border` (no visible border in Figma)

### `apps/web/src/components/atoms/Label/Label.tsx`
- Text color: `text-text-secondary` → `text-text-primary`
- Font size: `text-sm` → `text-lg`

### `apps/web/src/components/atoms/Heading/Heading.tsx`
- h1 size: `text-4xl font-bold` → `text-[31px] font-semibold`

### `apps/web/src/components/atoms/Divider/Divider.tsx`
- Text color: `text-text-muted` → `text-text-primary`
- Font size: `text-xs` → `text-[15px]`

### `apps/web/src/components/molecules/SocialLoginButton/SocialLoginButton.tsx`
- Remove the circle container `<div>` (the `w-12 h-12 rounded-full bg-dark-surface border...`)
- Render `<img>` directly inside the button
- Label: `text-text-secondary` → `text-text-primary`

### `apps/web/src/components/organisms/LoginForm/LoginForm.tsx`
- Subtitle `<p>`: change `text-accent-green text-sm` → `text-text-primary text-[22px]`
- Text: `"Boas-vindas! Faça seu login."` (already correct, keep)

---

## Phase 3 — New Components (5 files)

### `apps/web/src/components/organisms/SignupForm/SignupForm.tsx`
Reuse: `Heading`, `FormField`, `Checkbox`, `Button`, `Divider`, `SocialLoginButton`, `TextLink`

Fields:
- Nome (text, placeholder "Nome completo")
- Email (email, placeholder "Digite seu email")
- Senha (password, placeholder "******")
- Checkbox "Lembrar-me" (no "Esqueci a senha")
- Button "Cadastrar →" fullWidth primary
- Divider "ou entre com outras contas"
- Social: Github + Gmail
- Footer: "Já tem conta?" + TextLink "Faça seu login!" → `/login`

Props: `onSubmit: (data: { name, email, password, remember }) => void`

State: `name`, `email`, `password`, `remember` (all useState)

### `apps/web/src/components/organisms/SignupForm/index.ts`
Barrel export.

### `apps/web/src/components/organisms/SignupForm/SignupForm.test.tsx`
Tests:
1. Renders without crash
2. Calls onSubmit with correct data when form submitted (fill all fields + click button)

### `apps/web/src/pages/SignupPage/SignupPage.tsx`
Composes `AuthTemplate` + `SignupForm` — same banner (`/banner-login.png`)

### `apps/web/src/pages/SignupPage/index.ts`
Barrel export.

---

## Phase 4 — Routing

### `apps/web/src/App.tsx`
- Import `SignupPage`
- Add `<Route path="/signup" element={<SignupPage />} />`

---

## Verification
1. `pnpm web:dev` — `/login` and `/signup` render visually
2. Link "Crie seu cadastro" navigates to `/signup`, link "Faça seu login!" navigates to `/login`
3. `pnpm web:build` — no TypeScript/build errors
4. `pnpm web:test` — all tests pass (existing + new SignupForm tests)
