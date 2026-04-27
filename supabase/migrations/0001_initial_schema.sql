create extension if not exists pgcrypto;
create extension if not exists citext;

create type public.user_role as enum ('creator', 'listener');
create type public.content_kind as enum ('track', 'snippet', 'mix', 'comment');
create type public.publish_visibility as enum ('draft', 'public', 'private', 'unlisted');
create type public.processing_status as enum ('queued', 'analyzing', 'ready', 'failed', 'blocked');
create type public.fingerprint_status as enum ('pending', 'clear', 'matched', 'failed', 'skipped');
create type public.notification_type as enum ('new_mix', 'like', 'comment', 'repost', 'follow');

create table public.users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  handle citext not null unique,
  display_name text not null,
  avatar_url text,
  bio text,
  role public.user_role not null default 'listener',
  genre_tags text[] not null default '{}',
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_handle_format check (handle ~ '^[a-zA-Z0-9_]{3,30}$')
);

create table public.tracks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  caption text,
  genre text,
  original_file_url text not null,
  audio_url text,
  waveform_url text,
  duration_seconds numeric(10, 3),
  visibility public.publish_visibility not null default 'draft',
  processing_status public.processing_status not null default 'queued',
  fingerprint_status public.fingerprint_status not null default 'pending',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.snippets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  source_track_id uuid references public.tracks(id) on delete set null,
  title text not null,
  caption text,
  audio_url text,
  source_start_ms integer,
  source_end_ms integer,
  duration_seconds numeric(7, 3) not null,
  visibility public.publish_visibility not null default 'draft',
  processing_status public.processing_status not null default 'queued',
  fingerprint_status public.fingerprint_status not null default 'pending',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint snippets_max_duration check (duration_seconds <= 20.000),
  constraint snippets_valid_trim check (
    source_start_ms is null
    or source_end_ms is null
    or source_end_ms > source_start_ms
  )
);

create table public.mixes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  caption text,
  cover_art_url text,
  rendered_audio_url text,
  duration_seconds numeric(10, 3),
  bpm_min numeric(6, 2),
  bpm_max numeric(6, 2),
  visibility public.publish_visibility not null default 'draft',
  processing_status public.processing_status not null default 'queued',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mix_tracks (
  id uuid primary key default gen_random_uuid(),
  mix_id uuid not null references public.mixes(id) on delete cascade,
  track_id uuid not null references public.tracks(id) on delete restrict,
  position integer not null,
  start_ms integer,
  end_ms integer,
  transition_in_ms integer,
  transition_out_ms integer,
  crossfade_seconds numeric(5, 2) not null default 8.00,
  tempo_adjustment numeric(6, 3),
  created_at timestamptz not null default now(),
  unique (mix_id, position),
  unique (mix_id, track_id),
  constraint mix_tracks_position_positive check (position > 0),
  constraint mix_tracks_valid_segment check (start_ms is null or end_ms is null or end_ms > start_ms)
);

create table public.audio_analysis (
  id uuid primary key default gen_random_uuid(),
  track_id uuid references public.tracks(id) on delete cascade,
  snippet_id uuid references public.snippets(id) on delete cascade,
  mix_id uuid references public.mixes(id) on delete cascade,
  bpm numeric(6, 2),
  musical_key text,
  camelot_key text,
  beat_grid jsonb not null default '[]'::jsonb,
  energy_curve jsonb not null default '[]'::jsonb,
  waveform_peaks jsonb not null default '[]'::jsonb,
  analysis_version text not null default 'v1',
  confidence numeric(5, 4),
  created_at timestamptz not null default now(),
  constraint audio_analysis_one_target check (num_nonnulls(track_id, snippet_id, mix_id) = 1)
);

create table public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  target_kind public.content_kind not null,
  target_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, target_kind, target_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  target_kind public.content_kind not null,
  target_id uuid not null,
  parent_comment_id uuid references public.comments(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint comments_body_not_blank check (length(trim(body)) > 0)
);

create table public.reposts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  target_kind public.content_kind not null,
  target_id uuid not null,
  caption text,
  created_at timestamptz not null default now(),
  unique (user_id, target_kind, target_id)
);

create table public.follows (
  follower_id uuid not null references public.users(id) on delete cascade,
  following_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  constraint follows_no_self_follow check (follower_id <> following_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  actor_id uuid references public.users(id) on delete set null,
  type public.notification_type not null,
  target_kind public.content_kind,
  target_id uuid,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index tracks_owner_published_idx on public.tracks (owner_id, published_at desc);
create index tracks_public_feed_idx on public.tracks (published_at desc) where visibility = 'public';
create index snippets_owner_published_idx on public.snippets (owner_id, published_at desc);
create index snippets_public_feed_idx on public.snippets (published_at desc) where visibility = 'public';
create index mixes_owner_published_idx on public.mixes (owner_id, published_at desc);
create index mixes_public_feed_idx on public.mixes (published_at desc) where visibility = 'public';
create index mix_tracks_mix_position_idx on public.mix_tracks (mix_id, position);
create index likes_target_idx on public.likes (target_kind, target_id);
create index comments_target_created_idx on public.comments (target_kind, target_id, created_at);
create index reposts_target_idx on public.reposts (target_kind, target_id);
create index follows_following_idx on public.follows (following_id, created_at desc);
create index notifications_user_unread_idx on public.notifications (user_id, created_at desc) where read_at is null;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_set_updated_at before update on public.users
for each row execute function public.set_updated_at();

create trigger tracks_set_updated_at before update on public.tracks
for each row execute function public.set_updated_at();

create trigger snippets_set_updated_at before update on public.snippets
for each row execute function public.set_updated_at();

create trigger mixes_set_updated_at before update on public.mixes
for each row execute function public.set_updated_at();

create trigger comments_set_updated_at before update on public.comments
for each row execute function public.set_updated_at();

create or replace view public.feed_items as
select
  tracks.id,
  'track'::text as item_kind,
  tracks.owner_id,
  tracks.caption,
  tracks.published_at as occurred_at,
  jsonb_build_object(
    'title', tracks.title,
    'genre', tracks.genre,
    'durationSeconds', tracks.duration_seconds,
    'audioUrl', tracks.audio_url
  ) as metadata
from public.tracks
where tracks.visibility = 'public' and tracks.published_at is not null
union all
select
  snippets.id,
  'snippet'::text as item_kind,
  snippets.owner_id,
  snippets.caption,
  snippets.published_at as occurred_at,
  jsonb_build_object(
    'title', snippets.title,
    'durationSeconds', snippets.duration_seconds,
    'audioUrl', snippets.audio_url
  ) as metadata
from public.snippets
where snippets.visibility = 'public' and snippets.published_at is not null
union all
select
  mixes.id,
  'mix'::text as item_kind,
  mixes.owner_id,
  mixes.caption,
  mixes.published_at as occurred_at,
  jsonb_build_object(
    'title', mixes.title,
    'durationSeconds', mixes.duration_seconds,
    'coverArtUrl', mixes.cover_art_url,
    'renderedAudioUrl', mixes.rendered_audio_url
  ) as metadata
from public.mixes
where mixes.visibility = 'public' and mixes.published_at is not null
union all
select
  reposts.id,
  'repost'::text as item_kind,
  reposts.user_id as owner_id,
  reposts.caption,
  reposts.created_at as occurred_at,
  jsonb_build_object(
    'targetKind', reposts.target_kind,
    'targetId', reposts.target_id
  ) as metadata
from public.reposts;
