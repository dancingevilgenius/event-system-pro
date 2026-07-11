-- Push attendee list changes to the realtime service via LISTEN/NOTIFY.
-- Payload is metadata only (event_id + op); clients refetch rows over PostgREST.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/110_event_attendee_notify.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION public.notify_event_attendee_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_event_id bigint;
  v_op text;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_event_id := OLD.event_id;
    v_op := 'DELETE';
  ELSE
    v_event_id := NEW.event_id;
    v_op := TG_OP;
  END IF;

  PERFORM pg_notify(
    'event_attendee_change',
    json_build_object(
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

DROP TRIGGER IF EXISTS attendee_notify_event_change ON public.attendee;

CREATE TRIGGER attendee_notify_event_change
  AFTER INSERT OR UPDATE OR DELETE ON public.attendee
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_event_attendee_change();

COMMENT ON FUNCTION public.notify_event_attendee_change() IS
  'Broadcasts compact event_id/op payloads on attendee row changes for realtime UI refresh.';
