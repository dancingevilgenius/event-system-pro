-- Tell the first coaching step that the training box is dragged by its header.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/142_training_drag_header_hint.sql

\connect event_system_pro

UPDATE public.training_instructions
SET steps_json = jsonb_set(
  steps_json,
  '{steps,0,instruction}',
  to_jsonb($hint$Move the training box to another spot on the screen.
The popup can be dragged by the header, which has the 6-dot icon on it.$hint$::text)
)
WHERE instruction_code = 'PRELIMS_MARKS'
  AND steps_json->'steps'->0->>'id' = 'move-training-panel'
  AND position('6-dot icon' in COALESCE(steps_json->'steps'->0->>'instruction', '')) = 0;
