# VYB Screen Map
_Last updated: 2026-04-27_

This is the canonical Web MVP screen map. It turns the route list from the handoff into buildable product surfaces.

## Global App Shell

### Top Navigation
Visible on authenticated app routes.

- Logo -> `/feed`
- Feed -> `/feed`
- Search -> `/search`
- Upload -> `/upload`
- Notifications -> `/notifications`
- Avatar menu -> own profile, settings, sign out

### Bottom Player
Persistent across authenticated routes.

- Shows current track, snippet, or vyb
- Supports play/pause, seek, next, previous, volume
- Survives route changes
- Expands into a richer now-playing view later; MVP can keep it as a compact bar

### Shared States
Every data-driven screen should define these states before feature work begins.

- Loading: skeleton or quiet loading region
- Empty: clear next action, usually upload, follow, or search
- Error: retry action plus safe fallback navigation
- Unauthorized: redirect to Clerk sign-in
- Blocked content: visible but unplayable when fingerprinting or DMCA rules block playback

## Public And Auth Screens

### `/` Landing
Purpose: explain VYB and move visitors into sign-up or sign-in.

Primary jobs:

- Make the product promise obvious: music-first social feed plus automixed vybs
- Push new users to sign up
- Let returning users sign in

Primary UI:

- Brand-first hero with VYB as the first-viewport signal
- Sign up and sign in actions
- Short product proof points: upload, automix, publish, discover

Data dependencies:

- None for MVP

### `/sign-in`
Purpose: Clerk sign-in entry.

Primary jobs:

- Authenticate existing users
- Return authenticated users to the intended destination or `/feed`

Primary UI:

- Clerk SignIn component or hosted redirect
- Link to sign up

Post-auth routing:

- If profile onboarding is incomplete -> `/onboarding`
- Otherwise -> `/feed`

### `/sign-up`
Purpose: Clerk sign-up entry.

Primary jobs:

- Create a new Clerk account
- Start VYB profile onboarding

Primary UI:

- Clerk SignUp component or hosted redirect
- Link to sign in

Post-auth routing:

- Always route first-time users to `/onboarding`

### `/onboarding`
Purpose: create the VYB profile that sits on top of Clerk identity.

Primary jobs:

- Choose a unique handle
- Confirm display name and optional avatar
- Pick genre tags
- Choose role: creator or listener

Primary UI:

- Handle input with availability check
- Genre tag picker
- Creator/listener segmented control
- Continue button that stays disabled until required fields pass validation

Data dependencies:

- Current Clerk user
- `GET /api/users/handle-availability?handle=`
- `POST /api/onboarding`

Completion:

- Sets `onboarding_completed_at`
- Redirects to `/feed`

## Core App Screens

### `/feed`
Purpose: the main music-first social feed.

Primary jobs:

- Show chronological public tracks, snippets, vybs, and reposts
- Let users play content immediately
- Let users like, comment, repost, and follow creators

Primary UI:

- Feed composer is deferred; uploads happen through upload and mix routes
- Feed card types: track, snippet, vyb, repost
- Card actions: play, like, comment, repost, follow, open detail
- Inline comments preview or count

Data dependencies:

- `GET /api/feed?cursor=`
- `POST /api/likes`
- `DELETE /api/likes/:id`
- `POST /api/reposts`
- `POST /api/follows`

Empty state:

- New user sees prompts to follow creators, search, or upload

### `/upload`
Purpose: upload a full MP3 track owned by the user.

Primary jobs:

- Accept MP3 upload
- Create a draft track
- Send audio through storage, analysis, fingerprinting, and transcode pipeline
- Publish ready tracks into the feed

Primary UI:

- Drag/drop upload zone
- Upload progress
- Processing status timeline
- Metadata form: title, genre, caption
- Publish action

Data dependencies:

- `POST /api/uploads/track-intent`
- Direct upload to signed R2 URL
- `POST /api/tracks`
- `GET /api/tracks/:id/status`
- `POST /api/tracks/:id/publish`

Key states:

- No file selected
- Uploading
- Analyzing
- Fingerprint pending
- Ready to publish
- Blocked by fingerprint match
- Failed analysis or transcode

### `/upload/snippet`
Purpose: upload or trim a short audio moment up to 20 seconds.

Primary jobs:

- Select a source file or existing track
- Trim a clip to max 20 seconds
- Run analysis and fingerprinting
- Publish as a distinct feed item

Primary UI:

- Source upload/select control
- Waveform trim editor
- Duration counter with hard 20 second clamp
- Caption field
- Publish action

Data dependencies:

- `POST /api/uploads/snippet-intent`
- Direct upload to signed R2 URL when source is a new file
- `POST /api/snippets`
- `GET /api/snippets/:id/status`
- `POST /api/snippets/:id/publish`

Key states:

- No source selected
- Trim window invalid or over 20 seconds
- Processing
- Ready to publish
- Blocked by fingerprint match

### `/mix`
Purpose: full-power web automix builder.

Primary jobs:

- Select ready tracks from the user's library
- Suggest ordering by BPM proximity and Camelot compatibility
- Let the creator manually reorder
- Configure transition points and crossfade lengths
- Preview transitions
- Publish the vyb

Primary UI:

- Track library picker
- Ordered tracklist timeline
- Compatibility score indicators
- Transition editor per track boundary
- Preview controls
- Title, caption, cover art, publish panel

Data dependencies:

- `GET /api/me/tracks?status=ready`
- `POST /api/mixes/draft`
- `PATCH /api/mixes/:id`
- `POST /api/mixes/:id/preview`
- `POST /api/mixes/:id/publish`

Key states:

- No tracks uploaded
- Not enough ready tracks
- Some tracks missing analysis
- Draft saved
- Preview rendering
- Publish failed

### `/mix/[id]`
Purpose: public detail page for a published vyb.

Primary jobs:

- Play the full vyb or individual track transitions
- Show creator, caption, tracklist, metadata, comments, likes, reposts
- Let users follow the creator

Primary UI:

- Cover art and title header
- Primary play button
- Tracklist with BPM/key metadata
- Comment thread
- Like, repost, follow actions

Data dependencies:

- `GET /api/mixes/:id`
- `GET /api/mixes/:id/comments`
- Social action endpoints

### `/track/[id]`
Purpose: public detail page for a full uploaded track.

Primary jobs:

- Play the track
- Show waveform and analysis metadata
- Show creator, caption, comments, likes, reposts

Primary UI:

- Track title header
- Waveform player
- BPM/key/genre metadata
- Comment thread
- Like, repost, follow actions

Data dependencies:

- `GET /api/tracks/:id`
- `GET /api/tracks/:id/comments`
- Social action endpoints

### `/profile/[username]`
Purpose: public profile for creators and listeners.

Primary jobs:

- Show identity, bio, follower counts, and follow state
- Show tabs for mixes, tracks, snippets, reposts
- Let owners edit profile through settings

Primary UI:

- Avatar, display name, handle, bio
- Follow/unfollow button for other users
- Edit profile button for own user
- Tabs: Mixes, Tracks, Snippets, Reposts

Data dependencies:

- `GET /api/profiles/:username`
- `GET /api/profiles/:username/content?tab=`
- `POST /api/follows`
- `DELETE /api/follows/:userId`

### `/search`
Purpose: discovery across creators and content.

Primary jobs:

- Search users, tracks, snippets, and vybs
- Jump into profile or detail pages

Primary UI:

- Search input
- Result tabs: Top, Users, Tracks, Vybs, Snippets
- Result cards with play/follow shortcuts where relevant

Data dependencies:

- `GET /api/search?q=&type=&cursor=`

MVP behavior:

- Simple text search first
- Ranking can be basic recency and exact-match weighting

### `/notifications`
Purpose: activity inbox.

Primary jobs:

- Show new mixes from followed users
- Show social activity: follows, likes, comments, reposts
- Mark notifications as read

Primary UI:

- Notification list grouped by recency
- Unread indicators
- Link each notification to target content or actor profile

Data dependencies:

- `GET /api/notifications`
- `POST /api/notifications/mark-read`

### `/settings`
Purpose: account and profile settings.

Primary jobs:

- Edit VYB profile fields
- Manage notification preferences
- Link social profiles later
- Access legal/account actions

Primary UI:

- Profile form: display name, handle, avatar, bio, genre tags
- Notification settings
- Linked socials section
- Account danger zone later

Data dependencies:

- `GET /api/me`
- `PATCH /api/me/profile`
- `PATCH /api/me/preferences`

## Deferred Screens

These are intentionally outside Web MVP.

- Mobile listener app routes
- Mobile creator flow
- Live Vybs room screen
- Creator monetization dashboard
- Analytics dashboard
- Algorithmic feed controls
