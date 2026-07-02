-- Seed governing_body lookup rows (dev / demo).
-- Safe to re-run (upserts names and more_json by code).

\connect event_system_pro

INSERT INTO public.governing_body (governing_body_code, long_name, short_name, more_json, created_by)
VALUES
  (
    'WSDC',
    'World Swing Dance Council',
    'WSDC',
    '{"website": "https://worldsdc.com", "facebook": "https://www.facebook.com/worldswingdc", "discord": ""}'::json,
    'c-agent'
  ),
  (
    'TSL',
    'The Saber Legion',
    'TSL',
    '{"website": "https://www.thesaberlegion.com", "facebook": "https://www.facebook.com/thesaberlegion", "discord": ""}'::json,
    'c-agent'
  ),
  (
    'UCWDC',
    'United Country Western Dance Council',
    'UCWDC',
    '{"website": "https://ucwdc.org", "facebook": "https://www.facebook.com/UCWDC", "discord": ""}'::json,
    'c-agent'
  ),
  (
    'RR',
    'Robot Riot',
    'RR',
    '{"website": "", "facebook": "", "discord": ""}'::json,
    'c-agent'
  ),
  (
    'PRS',
    'Power Racing Series',
    'PRS',
    '{"website": "https://powerracingseries.org", "facebook": "https://www.facebook.com/PowerRacingSeries", "discord": ""}'::json,
    'c-agent'
  ),
  (
    'US',
    'United States',
    'US',
    NULL,
    'c-agent'
  ),
  (
    'GLOBAL',
    'Global',
    'Global',
    NULL,
    'c-agent'
  )
ON CONFLICT (governing_body_code) DO UPDATE SET
  long_name = EXCLUDED.long_name,
  short_name = EXCLUDED.short_name,
  more_json = EXCLUDED.more_json;
