# VYB — Project Brief
_Last updated: 2026-03-11_

---

## What Is VYB?

VYB is a social music platform — what you'd get if Twitter and SoundCloud had a baby. Music is the content. Social interaction is the layer on top.

**Instagram:** @1vybmedia

---

## The Core Concept

On VYB, the atomic unit of content is music. Users create mixes, share them, and engage around them the way people tweet thoughts. The feed is music-first.

---

## MVP

### The North Star Moment
> I create a mix. It's automixed into something that sounds great. I publish it. My friends can find my profile, see my mixes, and listen. Other people can discover it in the feed.

### MVP Scope

**IN:**
- Auth (sign up / log in)
- User profile (name, handle, avatar)
- Upload tracks (MP3 — user's own files)
- Mix creation + Automix (see below)
- Publish mix with caption
- Social feed of public mixes
- Like, comment, repost
- Follow users
- Notifications (new mix from someone you follow)
- View profiles + mixes
- DMCA policy + audio fingerprinting (ACRCloud or AudD) — Day 1 legal protection

**OUT (explicitly deferred):**
- Apple MusicKit / Spotify integration → v1.1
- Mobile app (creator flow) → v1.1
- Live Vybs → v3/v4

### Platform Priority
- **Web first.** The creator flow (upload → build mix → publish) is a desktop behavior. Producers and DJs work in DAWs on laptops. Web is mandatory for MVP.
- **Mobile (Expo)** follows in v1.1, focused on listening and discovery.

---

## Automix

The feature that makes VYB not just another SoundCloud. Two tiers:

### Web — Full Automix (Power User)
The real tool. For DJs, producers, engaged creators.

**Pipeline:**
1. **At upload:** Server-side audio analysis — BPM, musical key, energy curve (stored as track metadata)
2. **Mix ordering:** Camelot Wheel harmonic mixing + BPM proximity — tracks ordered so transitions sound natural
3. **Transition detection:** Beat grid analysis + energy curve to find low-energy outro/intro windows
4. **Crossfade:** Blend at detected transition points; optional light tempo nudging to lock BPM
5. **Controls:** Adjustable crossfade length, manual reorder, preview transitions

**Libraries:**
- `librosa` (Python microservice) — BPM, key, beat grid analysis at upload time
- `essentia.js` — optional client-side assist
- Web Audio API — crossfade scheduling + playback in browser

### Mobile — "AI" Automix (Casual User)
Effortless, magical, instant. Still uses real analysis data — just applies it simply.

- Uses BPM/key metadata stored at upload time (same data, lighter execution)
- Smart track ordering by BPM proximity
- Auto crossfade at ~30s from track end — no manual controls
- Marketed as "Let VYB mix it" — honest, not oversold

**Why this split works:**
- Creates a natural user journey: casual → engaged → power user
- Web automix is a reason to come back to the desktop product
- Two different promises: *"Build your mix"* (web) vs. *"Let VYB mix it"* (mobile)
- Sets up a natural premium/creator tier later

---

## Content & Licensing

### Upload Model (MVP)
User-uploaded MP3s only. SoundCloud model. This skews early users toward the right audience — producers, DJs, beatmakers — who are exactly the content generators VYB needs first. Casual listeners follow the content.

### Legal Protection (Day 1)
- **DMCA safe harbor (Section 512):** Public takedown policy + responsive process = platform protection
- **Audio fingerprinting:** ACRCloud or AudD (~$50-200/mo) — detect licensed tracks at upload, flag or block
- **ToS:** User certifies they own what they upload — liability on the user
- Fingerprinting = demonstrated good faith. Matters legally.

### Licensing Roadmap
- **Phase 1 — MVP:** User uploads + DMCA guardrails
- **Phase 2 — v1.1:** Apple MusicKit + Spotify SDK — users connect their existing subscription; VYB is the social layer
- **Phase 3 — Label Deals:** Negotiate from audience leverage, not desperation

---

## The Key Feature: Live Vybs (v3/v4)

Deliberately deferred. This feature earns its power from a crowd — launch it to 50 users and it's a ghost town; launch it to 50,000 and it's a moment.

**The concept:**
- Start a vyb → friends join in real-time
- Everyone hears the same song at the same timestamp — fully synchronized
- DJ use case: broadcast live to anyone, anywhere
- Listener count, notifications, vyb history

**When it ships:** After the community is built. v3/v4. This is the big moment, not the launch feature.

---

## Tech Stack

### Frontend
- **Web:** Next.js (React) — SSR, SEO-friendly, fast — **MVP priority**
- **Mobile:** React Native (Expo) — iOS + Android, v1.1

### Backend
- **Node.js + NestJS** — structured, scalable
- **Supabase** — PostgreSQL, auth, real-time subscriptions
- **Redis** — live vyb state (future)
- **Python microservice** — audio analysis (librosa) at upload time

### Audio Analysis
- **librosa** — BPM, key detection, beat grid, energy curve (runs at upload, results stored in DB)

### Real-Time Sync (future — Live Vybs)
- **Ably** — managed WebSocket infrastructure

### Audio Storage & Delivery
- **Cloudflare R2** — zero egress fees, S3-compatible
- **Cloudflare CDN** — global edge, fast audio delivery
- **FFmpeg** — transcode uploads to multiple bitrates

### Auth
- **Clerk** — social logins, phone auth, JWT

### Hosting
- **Start:** Vercel (frontend) + Railway (backend)
- **Scale:** AWS/GCP when traffic demands

---

## Team

- **Dj** — Founder, Visionary, Product. Masters in Information Systems. Makes beats, aspiring DJ. VYB's first pioneer creator.
- **Rob (AI)** — Technical co-builder. Architecture, code, infrastructure.

---

## Roadmap

| Version | Focus |
|---|---|
| **MVP** | Web app: auth, upload, full automix, publish, social feed, follow, notifications |
| **v1.1** | Mobile app (listener + AI automix), Apple MusicKit + Spotify integration |
| **v2** | Creator monetization, analytics, premium tier |
| **v3/v4** | Live Vybs — synchronized real-time listening, DJ broadcast |

---

## Next Steps
- [ ] Map screens and core user flows (web MVP)
- [ ] Set up project repo and initial structure
- [ ] Design data models (users, tracks, mixes, feed)
- [ ] Begin building
