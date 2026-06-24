@AGENTS.md

# CLAUDE.md

## Repository

GitHub: https://github.com/slac-jaytang/my-project
Branch: master

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Next.js version

This project uses **Next.js 16.2.9** with **React 19.2.4**. AGENTS.md (above) warns this version has breaking changes from prior conventions. Before writing Next-specific code (routing, server/client components, fonts, navigation, metadata, etc.), consult `node_modules/next/dist/docs/01-app/` rather than relying on memory.

## Commands

- `npm run dev` — start dev server at http://localhost:3000
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint (uses `eslint-config-next` core-web-vitals + typescript)

No test runner is configured.

## Architecture

Expense Tracker — a fully **client-side** SPA. There is no backend, no API routes, and no database; all data lives in `localStorage` under the key `expense-tracker-data`.

### Data layer

`lib/storage.ts` exports a single `useExpenses()` hook that owns all persistence. Every page/component that touches expense data goes through this hook — there is no shared store, context provider, or server cache. Each consumer mounts its own copy of the hook, reads from localStorage on first effect, and writes back synchronously on mutation. Consequence: two mounted components do **not** share state in memory; cross-component updates rely on remount or navigation re-reading localStorage.

`Expense` shape (`lib/types.ts`): `{ id, date, amount, category, description, createdAt }`. `Category` is a fixed union of six values declared in `lib/types.ts` and mirrored in `lib/constants.ts` (CATEGORIES, CATEGORY_COLORS, CATEGORY_BG). When adding a category, update all three.

### Routing (App Router)

- `app/page.tsx` — redirects to `/dashboard`
- `app/dashboard/page.tsx` — summary cards + chart + recent list
- `app/expenses/page.tsx` — full list with filters/search
- `app/expenses/new/page.tsx` — create form
- `app/expenses/[id]/edit/page.tsx` — edit form

All pages that read/write expenses are `'use client'` because the data hook depends on `localStorage`/`useEffect`. The root layout (`app/layout.tsx`) is a server component and wraps every page in `<Nav />` + a centered `<main>`.

### Forms

`components/ExpenseForm.tsx` is shared by new + edit. Uses `react-hook-form` with a `zod` schema (defined inline) via `@hookform/resolvers/zod`. The category enum in the zod schema must match `Category` in `lib/types.ts`.

### Styling

Tailwind v4 via `@tailwindcss/postcss`. Geist font loaded in `app/layout.tsx` via `next/font/google` exposed as the `--font-geist` CSS variable.

### Path alias

`@/*` maps to the project root (see `tsconfig.json`). Import as `@/lib/...`, `@/components/...`.

### Loading state convention

Because the data hook hydrates from localStorage in an effect, every page that uses it renders a spinner gated on `loaded` before reading `expenses`. Preserve this pattern when adding new pages — reading expenses pre-hydration returns `[]` and will flash empty states.
