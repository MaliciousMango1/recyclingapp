# ♻️ Recycle Athens

**[recycleathens.com](https://recycleathens.com)**

A community tool that helps Athens-Clarke County, GA residents figure out how to dispose of anything. Search a curated database of ACC-specific rules, with AI fallback for items we haven't cataloged yet.

## Features

- **Search** with fuzzy matching and AI fallback for unknown items
- **Admin panel** at `/admin` — manage items, review AI-generated answers, handle user reports, site settings
- **Verified dates** on items with staleness warnings
- **Issue reporting** so users can flag outdated info
- **Analytics** — drop-in support for Umami, Plausible, Fathom, etc.

## Tech Stack

Next.js 15, TypeScript, tRPC, Prisma (PostgreSQL), Tailwind CSS, Fuse.js, Docker

## Quick Start

### Docker Compose

```bash
git clone https://github.com/MaliciousMango1/recyclingapp.git
cd athens-recycling-guide
cp .env.example .env
# Edit .env — set AI_API_KEY and ADMIN_PASSWORD at minimum
docker compose up -d
```

App runs at `localhost:3000`. Admin panel at `/admin`.

### Local Dev

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

## Configuration

See `.env.example` for all options. The key ones:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AI_API_BASE_URL` | OpenAI-compatible endpoint (OpenRouter, Ollama, OpenAI) |
| `AI_API_KEY` | API key for AI provider |
| `AI_MODEL` | Model ID (e.g. `minimax/m2.7`) |
| `ADMIN_PASSWORD` | Password for `/admin` |
| `NEXT_PUBLIC_ANALYTICS_SCRIPT_URL` | Analytics script URL (optional) |
| `NEXT_PUBLIC_ANALYTICS_SITE_ID` | Analytics site ID (optional) |

## How Search Works

1. Exact match against name, slug, and aliases
2. Fuzzy match via Fuse.js
3. AI fallback with ACC-specific context (clearly labeled)
4. No match — shows suggestions + ACC contact info

Unmatched AI searches are logged in the admin review queue. Popular ones get promoted to verified items over time.

## Data Sources

- [ACC Solid Waste Department](https://www.accgov.com/solidwaste)
- [ACC Recycling Program](https://www.accgov.com/7618/Recycling)
- [CHaRM Facility](https://www.accgov.com/charm)

## Disclaimer

Not an official ACC government site. See [recycleathens.com/about](https://recycleathens.com/about) for details. When in doubt, call ACC Solid Waste at 706-613-3512.

## Contributing

Missing item or wrong instructions? Open an issue or PR.
