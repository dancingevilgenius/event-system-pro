-- Local dev deployment_info for Build Info dialog (Dokploy section).
-- Safe to re-run (upserts by label).

\connect event_system_pro

WITH updated AS (
  UPDATE public.system_config
  SET
    value = jsonb_build_object(
      'deployed_at', to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
      'deploy_source', 'local-dev'
    ),
    modified_by = 'c-agent',
    modified_date = CURRENT_TIMESTAMP
  WHERE label = 'deployment_info'
  RETURNING 1
)
INSERT INTO public.system_config (label, value, active, created_by)
SELECT
  'deployment_info',
  jsonb_build_object(
    'deployed_at', to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
    'deploy_source', 'local-dev'
  ),
  true,
  'c-agent'
WHERE NOT EXISTS (SELECT 1 FROM updated);
