# ♻️ Recycle Athens

**[recycleathens.com](https://recycleathens.com)**

A community tool for Athens-Clarke County, GA residents to find out how to properly dispose of any item. Search a curated database of ACC-specific disposal rules, with AI-powered fallback for items not yet cataloged.

## Features

- **Instant search** — Type any item and get ACC-specific disposal instructions
- **Fuzzy matching** — Handles typos and alternative names ("styrofoam" → polystyrene)
- **AI fallback** — Items not in the database get AI-generated answers based on ACC rules, clearly labeled as unverified
- **Learning loop** — Unmatched searches are logged and surfaced in an admin review queue
- **Report issues** — Users can flag incorrect or outdated information directly from search results
- **Last verified dates** — Each item shows when it was last checked against ACC guidelines, with staleness warnings after 6 months
- **Admin panel** — Full CRUD for items, review queue for AI-generated answers, issue reports, site settings, and dashboard stats
- **Privacy-first analytics** — Drop-in support for Umami, Plausible, Fathom, or any script-tag analytics provider
- **Mobile-first** — Designed for use standing at your trash can

## Tech Stack

- **Next.js 15** (App Router, standalone output for Docker)
- **TypeScript**
- **tRPC** (end-to-end typesafe API)
- **Prisma** (PostgreSQL)
- **Tailwind CSS**
- **Fuse.js** (client-side fuzzy search)
- **OpenAI-compatible API** (AI fallback — works with OpenRouter, Ollama, OpenAI, etc.)
- **Docker** (production deployment)

## Quick Start

### Docker Compose (recommended)

```bash
git clone https://github.com/MaliciousMango1/recyclingapp.git
cd athens-recycling-guide

cp .env.example .env
# Edit .env — set AI_API_KEY and ADMIN_PASSWORD at minimum

docker compose up -d
```

This starts Postgres, runs migrations, seeds 40+ curated items, and serves the app at `http://localhost:3000`. The admin panel is at `/admin`.

### Local Development

```bash
npm install
cp .env.example .env
# Edit .env

npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

## Configuration

All configuration is via environment variables. See `.env.example` for the full list.

### Required

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AI_API_BASE_URL` | OpenAI-compatible API endpoint |
| `AI_API_KEY` | API key for the AI provider |
| `AI_MODEL` | Model identifier (e.g. `minimax/m2.7`) |
| `ADMIN_PASSWORD` | Password for the `/admin` panel |

### AI Provider Examples

| Provider | `AI_API_BASE_URL` | `AI_MODEL` |
|---|---|---|
| OpenRouter | `https://openrouter.ai/api/v1` | `minimax/m2.7` |
| Ollama (local) | `http://localhost:11434/v1` | `llama3.2` |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` |

### Analytics (optional)

Works with any script-tag analytics provider. Leave both blank to disable.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_ANALYTICS_SCRIPT_URL` | URL to the tracking script |
| `NEXT_PUBLIC_ANALYTICS_SITE_ID` | Your site/website ID |

**Examples:**

- **Umami:** `SCRIPT_URL=https://your-umami.com/script.js` / `SITE_ID=your-website-id`
- **Plausible:** `SCRIPT_URL=https://plausible.io/js/script.js` (no SITE_ID needed)
- **Fathom:** `SCRIPT_URL=https://cdn.usefathom.com/script.js` / `SITE_ID=your-site-id`

## Admin Panel

Navigate to `/admin` and enter your `ADMIN_PASSWORD`.

**Dashboard** — Stats at a glance: total items, match rate, AI fallback usage, open reports, and top searches over the last 7 days.

**Items** — Search, filter, create, edit, and delete curated items. Each item has a name, aliases (alternative search terms), disposal category, instructions, tips, material group, source URL, and a verified/last-verified date.

**Review Queue** — Shows searches that missed the curated database and hit the AI fallback, grouped by frequency. Promote popular searches to verified items with one click, or dismiss irrelevant ones.

**Reports** — User-submitted issue reports about incorrect or outdated information. Resolve or delete them as you address the feedback.

**Settings** — Site-wide toggles that take effect immediately without redeployment. Currently includes show/hide verified dates on search results.

## Project Structure

```
src/
├── app/
│   ├── about/page.tsx          # About page with legal disclaimer
│   ├── admin/page.tsx          # Admin panel (dashboard, items, queue, reports, settings)
│   ├── api/trpc/[trpc]/        # tRPC HTTP handler
│   ├── layout.tsx              # Root layout with providers + analytics
│   └── page.tsx                # Home page with search
├── components/
│   ├── admin/                  # Admin panel components
│   │   ├── admin-auth-context  # Client-side auth state
│   │   ├── admin-dashboard     # Stats overview
│   │   ├── admin-items-list    # Item CRUD table
│   │   ├── admin-login         # Login screen
│   │   ├── admin-reports       # Issue reports management
│   │   ├── admin-settings      # Site-wide toggles
│   │   ├── item-form           # Create/edit item form
│   │   └── review-queue        # AI search review queue
│   ├── analytics.tsx           # Generic analytics script loader
│   ├── providers.tsx           # tRPC + React Query provider
│   ├── report-issue-button.tsx # Inline issue report form
│   ├── search-bar.tsx          # Search input with suggestions
│   └── search-result.tsx       # Result display with verified dates
├── lib/
│   ├── categories.ts           # Category colors, labels, config
│   └── trpc.ts                 # tRPC client
├── server/
│   ├── api/
│   │   ├── admin-auth.ts       # Admin auth middleware
│   │   ├── ai-fallback.ts      # AI disposal advice service
│   │   ├── root.ts             # Root tRPC router
│   │   ├── trpc.ts             # tRPC initialization
│   │   └── routers/
│   │       ├── admin.ts        # Admin CRUD, queue, reports, settings
│   │       └── items.ts        # Public search, browse, report, settings
│   └── db/index.ts             # Prisma client singleton
└── env.ts                      # Environment variable validation

prisma/
├── schema.prisma               # Database schema
└── seed.ts                     # Seed data (40+ curated items)
```

## How Search Works

1. **Exact match** — Checks item name, slug, and aliases
2. **Fuzzy match** — Uses Fuse.js to find close matches (handles typos)
3. **AI fallback** — Sends the query to an LLM with ACC-specific context, returns a labeled "AI-generated" answer
4. **No match** — Shows suggestions and directs user to call ACC Solid Waste

AI-generated answers are clearly flagged and logged for admin review. Over time, popular AI searches get promoted to verified items, improving the match rate.

## CI/CD

The included GitHub Actions workflow (`.github/workflows/ci.yml`) runs lint and type-check on PRs, then builds and pushes a Docker image to Docker Hub on merge to `main`.

Required GitHub Actions secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

## Data Sources

- [ACC Solid Waste Department](https://www.accgov.com/solidwaste)
- [ACC Recycling Program](https://www.accgov.com/7618/Recycling)
- [CHaRM Facility](https://www.accgov.com/charm)

## Disclaimer

This is not an official Athens-Clarke County government website. See the [About page](https://recycleathens.com/about) for full disclaimer. When in doubt, call ACC Solid Waste at 706-613-3512.

## Contributing

Know of an item that's missing or has wrong instructions? Open an issue or PR to expand the seed data. The goal is to cover every common item Athens residents encounter.

## License

MIT
