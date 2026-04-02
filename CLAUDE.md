# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build production bundle
npm run lint     # Run ESLint
npm start        # Start production server
```

## Architecture

**Next.js 14 App Router** portfolio site with TypeScript and Tailwind CSS.

### Content Pattern

Each section (research, art, exhibitions, performances, design) follows the same pattern:
- `app/[section]/data.ts` — content data (title, year, description, credits, image arrays, Vimeo/YouTube IDs)
- `app/[section]/page.tsx` — listing page
- `app/[section]/[slug]/page.tsx` — dynamic detail page driven by `data.ts`

Images live in `public/img/[section]/[number].png`. Vimeo and YouTube IDs are stored directly in `data.ts` and rendered via `components/VideoFeed.tsx`.

### Styling

- Tailwind CSS with two CSS custom properties: `--bg: #e8e4df` and `--fg: #111111`
- Custom fonts from `public/fonts/`: **Bit** (monospace, used in nav) and **Mondwest** (serif, body text), both defined in `app/globals.css`

### Key Components

- `components/Nav.tsx` — collapsible navigation with 6 top-level sections and current-page asterisk indicators
- `components/VideoFeed.tsx` — Vimeo/YouTube embed component

### Path Alias

`@/*` maps to the project root (configured in `tsconfig.json`).
