# VYB Data Model

The first schema is designed around the MVP content loop: upload music, analyze it, create a vyb, publish it, and let people react socially.

## Core tables

- `users`: VYB profiles mapped to Clerk identities.
- `tracks`: Full MP3 uploads owned by users.
- `snippets`: Short clips up to 20 seconds, either sourced from a track or uploaded directly.
- `mixes`: Published vybs.
- `mix_tracks`: Ordered tracklist and transition metadata for each vyb.
- `audio_analysis`: BPM, key, Camelot key, beat grid, waveform peaks, and energy curve per audio asset.
- `likes`, `comments`, `reposts`, `follows`: Social graph and engagement.
- `notifications`: User-facing activity inbox.

## Feed approach

`feed_items` is a SQL view that unions public tracks, snippets, mixes, and reposts in chronological order. MVP feed ranking is chronological by design.

## Auth approach

Clerk remains the auth provider. The database stores `clerk_user_id` on `users`; API requests resolve the active profile before writes. Direct browser-to-Supabase writes are deferred until policies are intentionally designed.
