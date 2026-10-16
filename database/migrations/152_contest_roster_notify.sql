-- Push contest roster changes to the realtime service via LISTEN/NOTIFY.
-- Payload is metadata only (contest_id, event_id, op); clients refetch rows over PostgREST.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/152_contest_roster_notify.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION public.notify_contest_roster_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_contest_id bigint;
  v_event_id bigint;
  v_op text;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_contest_id := OLD.contest_id;
    v_op := 'DELETE';
  ELSE
    v_contest_id := NEW.contest_id;
    v_op := TG_OP;
  END IF;

  SELECT c.event_id
  INTO v_event_id
  FROM public.contest AS c
  WHERE c.contest_id = v_contest_id;

  PERFORM pg_notify(
    'contest_roster_change',
    json_build_object(
      'contest_id', v_contest_id,
      'event_id', v_event_id,
      'op', v_op
    )::text
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS contest_entry_notify_roster_change ON public.contest_entry;

CREATE TRIGGER contest_entry_notify_roster_change
  AFTER INSERT OR UPDATE OR DELETE ON public.contest_entry
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_contest_roster_change();

COMMENT ON FUNCTION public.notify_contest_roster_change() IS
  'Broadcasts compact contest_id/event_id/op payloads on contest_entry row changes for realtime UI refresh.';
