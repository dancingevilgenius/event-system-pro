-- Start every stored prelims lesson by moving the training box.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/141_training_move_panel_step.sql

\connect event_system_pro

UPDATE public.training_instructions
SET steps_json = jsonb_set(
  steps_json,
  '{steps}',
  jsonb_build_array(
    $move${
      "id": "move-training-panel",
      "instruction": "Move the training box to another spot on the screen.\nThe popup can be dragged by the header, which has the 6-dot icon on it.",
      "successMessage": "Training box moved.",
      "failureMessage": "Drag the training box by its heading.",
      "interaction": { "type": "drag", "elementId": "page-training-coach" }
    }$move$::jsonb
  ) || COALESCE(
    (
      SELECT jsonb_agg(step ORDER BY ordinality)
      FROM jsonb_array_elements(steps_json->'steps') WITH ORDINALITY AS listed(step, ordinality)
      WHERE step->>'id' IS DISTINCT FROM 'move-training-panel'
    ),
    '[]'::jsonb
  )
)
WHERE instruction_code = 'PRELIMS_MARKS'
  AND COALESCE(steps_json->'steps'->0->>'id', '') IS DISTINCT FROM 'move-training-panel';
