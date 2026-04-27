# VYB Core User Flows
_Last updated: 2026-04-27_

These flows define the Web MVP behavior that the data model and API should support next.

## Flow Principles

- Music is always the primary object on screen.
- Playback should feel persistent; route changes should not kill the current session.
- Auth is Clerk, but VYB profile state lives in the application database.
- Browser writes go through the NestJS API for MVP.
- Audio analysis, transcoding, and fingerprinting are async pipeline steps.
- The feed is chronological for MVP.
- Comments should support threading in the data model; UI can start with one visible reply level.

## 1. First Run And Onboarding

Goal: turn a Clerk account into a usable VYB profile.

Happy path:

1. User lands on `/`.
2. User clicks sign up.
3. Clerk creates the identity.
4. API receives or later resolves the Clerk user.
5. User is redirected to `/onboarding`.
6. User chooses a handle.
7. App checks handle availability.
8. User picks genre tags.
9. User chooses creator or listener.
10. User submits onboarding.
11. API creates or updates `users` row.
12. User lands on `/feed`.

Required validations:

- Handle is unique.
- Handle uses allowed characters and length.
- Role is creator or listener.
- Genre tags come from an allowed set or normalized freeform list.

Failure states:

- Clerk auth failure -> remain on sign-up/sign-in.
- Handle unavailable -> inline field error.
- API profile write failure -> retry without losing form values.

Primary data touched:

- `users`

Likely endpoints:

- `GET /api/users/handle-availability?handle=`
- `POST /api/onboarding`
- `GET /api/me`

## 2. Track Upload

Goal: publish a user-owned MP3 as a full track.

Happy path:

1. User opens `/upload`.
2. User drags in or selects an MP3.
3. Web validates basic file type and size.
4. API creates an upload intent and draft track record.
5. Browser uploads directly to signed R2 URL.
6. API confirms upload completion.
7. API queues audio analysis, fingerprinting, and transcoding.
8. Worker extracts BPM, musical key, Camelot key, beat grid, waveform peaks, and energy curve.
9. Fingerprinting returns clear.
10. API marks track ready.
11. User fills title, genre, and optional caption.
12. User publishes.
13. Track appears in `/feed` and on the user's profile.

Required validations:

- MP3 only for MVP.
- User must own or have rights to upload the file.
- Title is required before publish.
- Fingerprint status must be clear or explicitly allowed by policy.
- Processing status must be ready before publish.

Failure states:

- Invalid file type -> reject before upload.
- Upload interrupted -> retry upload.
- Fingerprint match -> block publish and explain policy.
- Analysis fails -> allow retry; do not publish until ready.
- Transcode fails -> allow retry; keep draft.

Primary data touched:

- `tracks`
- `audio_analysis`
- storage objects in R2
- fingerprint job records when added

Likely endpoints:

- `POST /api/uploads/track-intent`
- `POST /api/uploads/:id/complete`
- `PATCH /api/tracks/:id`
- `GET /api/tracks/:id/status`
- `POST /api/tracks/:id/publish`

## 3. Snippet Upload

Goal: publish a short audio moment as its own feed item.

Happy path from new source file:

1. User opens `/upload/snippet`.
2. User uploads an MP3.
3. Browser displays waveform when available.
4. User drags a trim window.
5. App clamps duration to 20 seconds.
6. API creates a snippet upload intent and draft snippet record.
7. Browser uploads source or rendered snippet audio to R2.
8. Worker runs analysis on the final snippet.
9. Fingerprinting returns clear.
10. User adds caption and publishes.
11. Snippet appears in `/feed` and profile Snippets tab.

Happy path from existing track:

1. User selects one of their ready tracks.
2. App loads waveform peaks.
3. User selects start and end points.
4. API creates snippet draft linked to source track.
5. Backend renders or references the clipped audio segment.
6. User publishes.

Required validations:

- Snippet duration must be greater than 0 and no more than 20 seconds.
- Source track must belong to the user if using existing library source.
- Caption can be optional, but publish needs a title or generated display label.

Failure states:

- Trim selection too long -> disable publish and show duration issue.
- Source analysis missing -> queue analysis or ask user to wait.
- Fingerprint match -> block publish.

Primary data touched:

- `snippets`
- `tracks` when linked to source track
- `audio_analysis`
- R2 storage objects

Likely endpoints:

- `GET /api/me/tracks?status=ready`
- `POST /api/uploads/snippet-intent`
- `POST /api/snippets`
- `PATCH /api/snippets/:id`
- `POST /api/snippets/:id/publish`

## 4. Automix Builder

Goal: build and publish a vyb from ready tracks.

Happy path:

1. User opens `/mix`.
2. App loads user's ready tracks with analysis metadata.
3. User selects two or more tracks.
4. System calculates compatibility scores.
5. System suggests an order using BPM proximity and Camelot key compatibility.
6. User accepts or manually reorders.
7. System proposes transition points from beat grid and low-energy windows.
8. User adjusts crossfade length and transition points.
9. User previews transitions in browser.
10. User names the vyb and optionally uploads cover art.
11. User publishes.
12. Vyb appears in `/feed`, `/mix/[id]`, and profile Mixes tab.

Required validations:

- Mix needs at least two ready tracks.
- Every track must belong to the creator.
- Every track should have analysis metadata before compatibility scoring.
- Mix title is required before publish.
- Ordered track positions must be unique.

Failure states:

- No uploaded tracks -> route user to `/upload`.
- Tracks still analyzing -> show disabled rows until ready.
- Preview fails -> allow publish of metadata-only mix only if product accepts that fallback; otherwise block.
- Rendered final audio fails -> keep draft and retry server render.

Primary data touched:

- `mixes`
- `mix_tracks`
- `tracks`
- `audio_analysis`
- optional rendered mix object in R2

Likely endpoints:

- `GET /api/me/tracks?status=ready`
- `POST /api/mixes/draft`
- `PATCH /api/mixes/:id`
- `POST /api/mixes/:id/preview`
- `POST /api/mixes/:id/publish`

## 5. Feed Discovery And Listening

Goal: discover, play, and engage with public music content.

Happy path:

1. User opens `/feed`.
2. API returns chronological feed items.
3. User presses play on a track, snippet, or vyb.
4. Bottom player starts playback.
5. User scrolls while playback continues.
6. User opens a detail page; player continues.
7. User likes, comments, reposts, or follows from the card or detail page.

Feed item types:

- Track
- Snippet
- Mix/vyb
- Repost

Required behavior:

- Feed is chronological for MVP.
- Cards must make the content type obvious.
- Reposts should show the reposting user and the original creator.
- Blocked content should not be playable.

Primary data touched:

- `tracks`
- `snippets`
- `mixes`
- `reposts`
- `likes`
- `comments`
- `follows`

Likely endpoints:

- `GET /api/feed?cursor=`
- `POST /api/player/events` later for analytics
- Social action endpoints listed below

## 6. Profile And Follow Graph

Goal: let users find creators, view their content, and follow them.

Happy path:

1. User opens `/profile/[username]` from feed, search, or direct URL.
2. App shows profile header and content tabs.
3. User plays content from a tab.
4. User follows the profile.
5. Follow count updates.
6. Followed creator's future published mixes can create notifications.

Own-profile behavior:

- Follow button becomes Edit Profile.
- Edit Profile links to `/settings`.

Required validations:

- A user cannot follow themselves.
- Duplicate follows are ignored or treated as success.

Primary data touched:

- `users`
- `follows`
- content tables by owner

Likely endpoints:

- `GET /api/profiles/:username`
- `GET /api/profiles/:username/content?tab=`
- `POST /api/follows`
- `DELETE /api/follows/:userId`

## 7. Social Actions

Goal: let users react around music without pulling attention away from playback.

### Like

Happy path:

1. User taps like on a track, snippet, mix, or comment.
2. API creates like if it does not already exist.
3. Count updates optimistically.
4. Creator receives notification when appropriate.

Endpoint shape:

- `POST /api/likes`
- `DELETE /api/likes/:id`

### Comment

Happy path:

1. User opens comment composer on a card or detail page.
2. User writes a comment.
3. API creates comment on target content.
4. Comment appears in thread.
5. Creator receives notification.

Threading decision:

- Store `parent_comment_id` so threaded comments are possible Day 1.
- MVP UI can start with one visible reply level to avoid overbuilding.

Endpoint shape:

- `GET /api/comments?targetKind=&targetId=`
- `POST /api/comments`
- `DELETE /api/comments/:id`

### Repost

Happy path:

1. User taps repost on track, snippet, or mix.
2. Optional caption can be added later; MVP can support instant repost first.
3. Repost appears in followers' feeds and profile Reposts tab.
4. Original creator receives notification.

Endpoint shape:

- `POST /api/reposts`
- `DELETE /api/reposts/:id`

### Follow

Happy path:

1. User taps follow on profile or feed card.
2. API creates follow relation.
3. UI updates follow state and counts.
4. Followed user receives notification.

Endpoint shape:

- `POST /api/follows`
- `DELETE /api/follows/:userId`

## 8. Notifications

Goal: keep users aware of music and social activity that matters.

Happy path:

1. User opens `/notifications`.
2. API returns unread and recent read notifications.
3. User clicks a notification.
4. App navigates to target profile or content detail.
5. Notification is marked read.

MVP notification types:

- New mix from followed user
- Like on user's content
- Comment on user's content
- Repost of user's content
- New follower

Required behavior:

- Notifications are user-specific.
- Actors and targets can be nullable only when deleted content/users require it.
- New mix notifications should be created when followed creators publish a mix.

Primary data touched:

- `notifications`
- `follows`
- social tables

Likely endpoints:

- `GET /api/notifications`
- `POST /api/notifications/:id/read`
- `POST /api/notifications/read-all`

## 9. Settings And Profile Editing

Goal: let users maintain identity and preferences.

Happy path:

1. User opens `/settings`.
2. App loads current profile.
3. User edits display name, handle, avatar, bio, genre tags, or role.
4. API validates and saves changes.
5. Updated profile appears on `/profile/[username]`.

Required validations:

- Handle remains unique.
- Avatar must be uploaded through allowed image flow when added.
- Bio length is capped.

Primary data touched:

- `users`
- future preferences table if settings grow

Likely endpoints:

- `GET /api/me`
- `PATCH /api/me/profile`
- `PATCH /api/me/preferences`
