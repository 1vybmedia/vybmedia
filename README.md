# VYB

VYB is a music-first social platform for uploading tracks, creating automixed vybs, publishing them, and discovering what friends and creators are playing.

## Monorepo layout

- `apps/web` - Next.js App Router web app for the MVP creator and listener experience.
- `apps/api` - NestJS API for auth handoff, uploads, social actions, feed reads, and orchestration.
- `apps/audio-worker` - Python audio analysis service for BPM, key, beat grid, and energy curve extraction.
- `packages/shared` - Shared TypeScript constants, API contracts, and domain types.
- `supabase/migrations` - Postgres schema owned by Supabase.
- `docs` - Product context, architecture, and data-model notes.

## Local setup

```bash
pnpm install
pnpm dev
```

The project is intentionally scaffolded before provider wiring. Copy `.env.example` to `.env.local` or service-specific env files as integrations come online.

## Product north star

A creator uploads tracks, builds an automixed vyb that sounds good, publishes it, and friends can find the profile, listen, react, comment, repost, and follow.
