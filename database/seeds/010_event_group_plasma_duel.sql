-- Fictional LED/plasma duel event_group rows (sci-fi duel vibe, no licensed IP terms).
-- event_group_code is derived from full_name (uppercase words, underscores).
-- Safe to re-run (upserts names by code).
--
--   psql -U postgres -d event_system_pro -f database/seeds/010_event_group_plasma_duel.sql

\connect event_system_pro

INSERT INTO public.event_group (
  event_group_code,
  full_name,
  short_name,
  created_by
)
VALUES
  (
    'PORTLAND_PLASMA_PRIX',
    'Portland Plasma Prix',
    'Portland',
    'c-agent'
  ),
  (
    'CHICAGO_CHROME_CLASH',
    'Chicago Chrome Clash',
    'Chicago',
    'c-agent'
  ),
  (
    'STELLAR_SHOWDOWN',
    'Stellar Showdown',
    'Stellar Showdown',
    'c-agent'
  ),
  (
    'NEON_NEXUS',
    'Neon Nexus',
    'Neon Nexus',
    'c-agent'
  ),
  (
    'MERIDIAN_MELEE',
    'Meridian Melee',
    'Meridian Melee',
    'c-agent'
  )
ON CONFLICT (event_group_code) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  short_name = EXCLUDED.short_name;
