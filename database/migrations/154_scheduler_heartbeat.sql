-- Scheduler process heartbeat. The Migrations page treats a stamp older than 60 seconds as down.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/154_scheduler_heartbeat.sql

\connect event_system_pro

CREATE TABLE IF NOT EXISTS maintenance.scheduler_heartbeat (
  id integer PRIMARY KEY DEFAULT 1,
  heartbeat_at timestamptz NULL,
  CONSTRAINT scheduler_heartbeat_singleton CHECK (id = 1)
);

INSERT INTO maintenance.scheduler_heartbeat (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION api.touch_scheduler_heartbeat()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api, maintenance, pg_catalog
AS $$
DECLARE
  v_at timestamptz := date_trunc('second', clock_timestamp());
BEGIN
  UPDATE maintenance.scheduler_heartbeat
  SET heartbeat_at = v_at
  WHERE id = 1;

  RETURN json_build_object(
    'ok', true,
    'heartbeat_at', v_at
  );
END;
$$;

CREATE OR REPLACE FUNCTION api.scheduler_heartbeat_status()
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, api, maintenance, pg_catalog
AS $$
DECLARE
  v_at timestamptz;
  v_healthy boolean;
BEGIN
  IF NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object('ok', false, 'message', 'Admin role required.');
  END IF;

  SELECT heartbeat_at
  INTO v_at
  FROM maintenance.scheduler_heartbeat
  WHERE id = 1;

  v_healthy := v_at IS NOT NULL AND v_at >= clock_timestamp() - interval '60 seconds';

  RETURN json_build_object(
    'ok', true,
    'healthy', v_healthy,
    'heartbeat_at', v_at
  );
END;
$$;

REVOKE ALL ON FUNCTION api.touch_scheduler_heartbeat() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.scheduler_heartbeat_status() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION api.scheduler_heartbeat_status() TO authenticated;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'maintenance') THEN
    GRANT EXECUTE ON FUNCTION api.touch_scheduler_heartbeat() TO maintenance;
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
