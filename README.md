# Recycle Athens

**[recycleathens.com](https://recycleathens.com)**

Helps Athens-Clarke County, GA residents figure out how to dispose of anything. Curated database of ACC-specific rules with AI fallback for unknown items.

## Tech Stack

Next.js 15, TypeScript, tRPC, Prisma (PostgreSQL), Tailwind CSS, Docker

## Setup

```bash
git clone https://github.com/MaliciousMango1/recyclingapp.git
cd recyclingapp
cp docker-compose.example.yml docker-compose.yml
# Edit docker-compose.yml with your values
docker compose up -d
```

## Auth

Google OAuth with invite-only registration. Two roles:

- **Admin** — full access including user management and invite codes
- **Editor** — everything except user management

First sign-in from the seed admin email is auto-promoted. Everyone else needs an invite code generated from the admin panel.

## Configuration

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `AUTH_TRUST_HOST` | Set to `true` behind a reverse proxy |
| `AUTH_URL` | Public URL (e.g. `https://recycleathens.com`) |
| `AI_API_BASE_URL` | OpenAI-compatible endpoint |
| `AI_API_KEY` | API key for AI provider |
| `AI_MODEL` | Model ID |

Google OAuth redirect URI: `https://your-domain/api/auth/callback/google`

## Data Sources

- [ACC Solid Waste](https://www.accgov.com/solidwaste) / [Recycling](https://www.accgov.com/7618/Recycling) / [CHaRM](https://www.accgov.com/charm)

Not an official ACC government site. When in doubt, call ACC Solid Waste at 706-613-3512.
