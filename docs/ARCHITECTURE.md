# VYB Architecture

## System shape

VYB starts as a web-first monorepo with three runtime services:

- `apps/web`: Next.js App Router app for landing, onboarding, feed, upload, mix building, profile, notifications, and settings.
- `apps/api`: NestJS API that owns business rules, Clerk verification, Supabase writes, upload orchestration, social actions, and feed reads.
- `apps/audio-worker`: Python service for audio analysis jobs using librosa and FFmpeg-adjacent metadata extraction.

Shared contracts live in `packages/shared` so the web app and API agree on content kinds, statuses, and typed payloads.

## Primary flows

1. Clerk signs the user in and the API maps the Clerk subject to `public.users.clerk_user_id`.
2. Uploads go through the API, land in Cloudflare R2, then get queued for audio analysis and fingerprinting.
3. The audio worker produces BPM, key, beat grid, waveform peaks, and energy curve metadata.
4. Tracks, snippets, and mixes are published into Postgres.
5. The feed reads a chronological view across published tracks, snippets, mixes, and reposts.
6. The bottom player in the web app owns continuous playback across routes.

## MVP boundaries

The MVP should favor boring, explicit systems over clever abstractions. The API owns write paths, Supabase owns durable relational state, R2 owns audio files, and the worker owns analysis. Mobile, live synchronized listening, algorithmic ranking, and monetization stay outside the first build.
