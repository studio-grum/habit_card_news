# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

Personal developer blog backed by **Notion as a CMS**. Notion pages are fetched via `@notionhq/client`, filtered to `Status = 발행됨` (published), and rendered as a statically generated Next.js site deployed on Vercel. See `docs/PRD.md` for the full spec and `docs/ROADMAP.md` for current phase status.

## Commands

```bash
npm run dev          # dev server (Turbopack)
npm run build        # production build (Turbopack)
npm run check-all    # typecheck + lint + format:check (run before committing)
npm run lint:fix     # auto-fix ESLint issues
npm run format       # format all files with Prettier
npx shadcn@latest add <component>  # add a shadcn/ui component to src/components/ui/
```

There are no tests yet. `check-all` is the required pre-commit gate (enforced by Husky + lint-staged).

## Architecture

### Notion Data Layer (to be built in `src/lib/notion.ts`)

The planned Notion API layer:

- `fetchPages()` — queries the database, filters `Status = 발행됨`, sorts by `Published` descending
- `fetchPageContent(pageId)` — fetches block children for a page
- Types live in `src/lib/types/notion.ts` (`Post`, `Block`, `Category`, `Tag`)

Add `NOTION_API_KEY` and `NOTION_DATABASE_ID` to `.env.local`, then extend `src/lib/env.ts` (which uses Zod for env validation) to include them.

### Rendering Strategy

- **SSG + ISR**: pages use `generateStaticParams` + `export const revalidate = 3600`
- **Server Components by default** — add `'use client'` only for interactivity (search filtering, theme toggle)
- Notion blocks are rendered by `components/blog/NotionRenderer.tsx` (to be built); supported block types: paragraph, H1–H3, code, quote, ordered/unordered list, image

### Route Structure

```
app/
├── page.tsx                    # home — post list grid with category filter + search
├── posts/[slug]/page.tsx       # post detail with NotionRenderer + prev/next nav
└── category/[category]/page.tsx  # filtered post list by category
```

### Key Conventions

- **Path aliases only** — always use `@/components/...`, `@/lib/...`, never relative `../` imports
- **Named exports** for components, default exports for page files (`page.tsx`, `layout.tsx`)
- **File naming**: kebab-case (`post-card.tsx`), component names PascalCase (`PostCard`)
- **Color system**: use semantic CSS variables (`bg-background`, `text-foreground`, `text-muted-foreground`) — never hardcode Tailwind color values like `bg-gray-100`
- **Class merging**: always use `cn()` from `@/lib/utils` (wraps `clsx` + `tailwind-merge`)
- **Component size**: keep files under 300 lines; split if larger

### Environment Variables

```bash
# .env.local
NOTION_API_KEY=secret_...
NOTION_DATABASE_ID=...
NEXT_PUBLIC_APP_URL=http://localhost:3000   # optional
```

`src/lib/env.ts` validates env vars with Zod at startup — add any new vars there.

## Tech Stack

- Next.js 15.5.3 App Router + Turbopack, React 19, TypeScript 5
- TailwindCSS v4 + shadcn/ui (new-york style) + `next-themes` for dark mode
- React Hook Form + Zod for forms; `sonner` for toasts
- `prettier-plugin-tailwindcss` auto-sorts Tailwind classes on save
