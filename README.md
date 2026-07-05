# CSV Parser

Client-side CSV parser built with Nuxt 3, Vue 3, and TypeScript. Upload a CSV file, then view, sort, filter, paginate, and export your data — all in the browser. No backend required.

## Tech Stack

- **Nuxt 3** — Vue 3 framework with Nitro SSR/prerendering
- **Pinia** — State management
- **TanStack Vue Table** — Headless table with sorting, filtering, pagination
- **Papa Parse** — CSV parsing with Web Worker support
- **Tailwind CSS** — Utility-first styling
- **Biome** — Linting and formatting

## Architecture

- `/` — Home page: drag-and-drop CSV upload with progress bar. **Prerendered at build time** (static HTML via `nuxt generate`).
- `/results` — Results page: interactive data table with sorting, filtering, column visibility toggling, pagination, and CSV export. **Client-side only** (SPA), since data is parsed in the browser.

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

Starts the dev server at `http://localhost:3000`.

## Build

```bash
pnpm build
```

Runs `nuxt generate` to statically prerender the home page and produce a deployable static site in `.output/public/`.

## Preview

```bash
pnpm preview
```

Serves the generated static site locally.

## Lint & Format

```bash
pnpm lint      # Check
pnpm format    # Auto-fix
```
