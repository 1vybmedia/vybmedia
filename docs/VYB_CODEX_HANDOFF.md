# VYB — Codex Handoff Document
_Last updated: 2026-04-27_

This file is the canonical context document for any Codex task on the VYB project.
Always read this file at the start of a session before doing any work.
Full project brief is in `VYB_PROJECT.md` (same directory).

---

## Who We Are

- **Dj** — Founder. Systems Engineer. Makes beats, aspiring DJ. Vision + product. Masters in Information Systems.
- **Rob** — AI technical co-builder. Architecture, code, infrastructure. Handles the heavy lifting.

---

## What We're Building

VYB is a **social music platform** — "Twitter + SoundCloud had a baby."

Music is the content. The feed is music-first. Users upload tracks, build mixes (called "vybs"), publish them, and engage socially around them.

**Instagram:** @1vybmedia

### The North Star Moment (MVP)
> I create a mix. It's automixed into something that sounds great. I publish it. My friends can find my profile, see my mixes, and listen. Other people can discover it in the feed.

---

## Tech Stack (Locked)

| Layer | Tech |
|---|---|
| Web Frontend | Next.js (App Router) |
| Mobile (v1.1, not MVP) | React Native (Expo) |
| Backend | Node.js + NestJS |
| Database | Supabase (PostgreSQL) |
| Auth | Clerk |
| Audio Storage | Cloudflare R2 + CDN |
| Audio Transcoding | FFmpeg |
| Audio Analysis | Python microservice (librosa) — BPM, key, beat grid, energy curve |
| Real-time (future) | Ably (Live Vybs, v3/v4) |
| Cache | Redis |
| Hosting | Vercel (frontend) + Railway (backend) → AWS/GCP at scale |

---

## MVP Scope

### IN
- Auth (sign up / log in via Clerk)
- User profiles (handle, avatar, bio)
- Track upload (MP3 — user owns the file)
- Snippet upload (distinct upload type — any length up to 20s)
- Mix creation + Automix (web full-power version)
- Publish mix with caption
- Social feed (chronological)
- Like, comment (threaded), repost
- Follow users
- Notifications (new mix from followed user)
- View profiles + mixes
- DMCA policy + audio fingerprinting (ACRCloud or AudD)

### OUT (explicitly deferred)
- Apple MusicKit / Spotify integration → v1.1
- Mobile creator flow → v1.1
- Live Vybs → v3/v4
- Algorithmic feed → post-MVP
- Threaded comments → post-MVP
- Creator monetization → v2

---

## Screen Map (Web MVP)

### Auth
| Route | Description |
|---|---|
| `/` | Landing — hero, sign up / log in CTAs |
| `/sign-in` | Clerk hosted sign-in |
| `/sign-up` | Clerk hosted sign-up |
| `/onboarding` | Username, genre tags, creator vs listener — runs once after sign-up |

### Core App
| Route | Description |
|---|---|
| `/feed` | Main social feed — chronological, all public mixes/tracks |
| `/upload` | Track uploader (full MP3) |
| `/upload/snippet` | Snippet uploader — trim any clip up to 20s from source audio |
| `/mix` | Automix builder — select tracks, order by BPM/key, set transitions, publish |
| `/mix/[id]` | Vyb detail page — tracklist, play controls, comments, likes |
| `/track/[id]` | Single track detail — waveform, comments, likes |
| `/profile/[username]` | Public profile — tracks, mixes, followers/following |
| `/search` | Search tracks, artists, vybs |
| `/notifications` | Notification center |
| `/settings` | Account, notifications, linked socials |

### Navigation
- **Top nav:** Logo | Feed | Search | Upload | Notifications | [Avatar → Profile / Settings]
- **Persistent bottom player bar** — plays across all routes, shows current track/mix

---

## Core User Flows

### 1. Onboarding
```
Sign up (Clerk)
  → /onboarding
    → Set username
    → Pick genre tags (EDM, Hip-Hop, R&B, House, etc.)
    → Select role: Creator or Listener
  → /feed
```

### 2. Track Upload
```
/upload
  → Drag/drop or browse — MP3 only
  → Server sends to Python microservice:
      → BPM detection (librosa)
      → Key detection → Camelot Wheel mapping
      → Beat grid analysis
      → Energy curve
      → Results stored to DB as track metadata
  → Audio fingerprint check (ACRCloud/AudD) — async background
  → FFmpeg transcode to multiple bitrates → R2 storage
  → User fills: title, genre tag, optional caption
  → Publish → track card appears in feed
```

### 3. Snippet Upload
```
/upload/snippet
  → Upload MP3 or record in-browser (stretch goal)
  → Drag trim window on waveform to select the moment (max 20s)
  → Same analysis pipeline (BPM, key, fingerprint)
  → Add caption
  → Publish → snippet card appears in feed
```

### 4. Automix Builder (Web — Full Power)
```
/mix
  → Select tracks from your library
  → System scores compatibility:
      → BPM proximity
      → Camelot Wheel harmonic matching
  → Drag to reorder or accept suggestions
  → Set transition points (beat grid UI, Web Audio API)
  → Adjust crossfade length per transition
  → Preview transitions in-browser
  → Name the mix + upload cover art
  → Publish → vyb card appears in feed
```

### 5. Feed / Discovery
```
/feed
  → Chronological stream of public mixes, tracks, snippets
  → Cards expand inline → bottom player bar takes over
  → Like (heart), Repost (retweet-style), Comment (threaded)
  → Follow artist → they appear in your feed
  → Repost → sends to your followers' feeds
```

### 6. Profile
```
/profile/[username]
  → Header: avatar, display name, handle, bio, follow/unfollow
  → Tabs: Mixes | Tracks | Snippets | Reposts
  → Follow → appears in follower/following count
  (Own profile: edit button → /settings)
```

### 7. Social Actions
```
Like:    POST /api/likes          → increments like count, shows in notifications
Comment: POST /api/comments       → flat list under track/mix, notifies creator
Repost:  POST /api/reposts        → creates repost entry, surfaces in followers' feeds
Follow:  POST /api/follows        → adds to feed filter, notifies followed user
```

---

## Automix — Technical Detail

### Web (Full Power)
1. Upload → Python microservice analyzes: BPM, key (Camelot Wheel), beat grid, energy curve
2. Results stored as track metadata in Supabase
3. Mix builder reads metadata, scores tracks for compatibility
4. User reorders / accepts — transition points auto-detected at low-energy windows
5. Web Audio API handles crossfade scheduling + playback preview
6. Optional: light tempo nudging to lock BPM at transitions
7. On publish: mix metadata + ordered tracklist stored; audio rendered server-side or streamed client-side

### Mobile (v1.1 — "AI" Automix)
- Uses same metadata from upload-time analysis
- Smart ordering by BPM proximity
- Auto crossfade at ~30s from track end — no manual controls
- Marketed as "Let VYB mix it"

---

## Naming Conventions
- The **app** is called **VYB** (all caps)
- A published mix is called a **vyb** (lowercase)
- The playlist/mix feature is called **vybs**
- Do NOT call the app "Vybs"

---

## Data Models (To Be Designed)
Next task. Core entities:
- `users`
- `tracks`
- `snippets`
- `mixes` (vybs)
- `mix_tracks` (junction: mix ↔ tracks, ordered)
- `likes`
- `comments`
- `reposts`
- `follows`
- `notifications`
- `audio_analysis` (BPM, key, beat grid, energy curve per track)

---

## Repo (Not Set Up Yet)
- Monorepo: `vyb/` root
  - `apps/web` — Next.js
  - `apps/api` — NestJS
  - `apps/audio-worker` — Python (librosa microservice)
  - `packages/shared` — shared types, utils
- Package manager: pnpm (workspaces)
- Tooling: Turborepo

---

## Current Status
- [x] Project concept locked
- [x] Stack locked
- [x] MVP scope locked
- [x] Screen map drafted
- [x] Core user flows drafted
- [x] Social decisions locked (chronological feed, distinct snippets up to 20s, threaded comments, reposts Day 1)
- [ ] Data models
- [ ] Repo setup
- [ ] Build

---

## How to Work With Dj
- Direct, no fluff
- Technical partner — no need to over-explain
- He's vision/product; you handle architecture and code
- Keep it moving
