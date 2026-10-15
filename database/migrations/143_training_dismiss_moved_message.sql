-- Make the second coaching step a click on the green "Training box moved" message.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/143_training_dismiss_moved_message.sql

\connect event_system_pro

UPDATE public.training_instructions
SET steps_json = jsonb_set(
  steps_json,
  '{steps}',
  jsonb_insert(
    COALESCE(
      (
        SELECT jsonb_agg(step ORDER BY ordinality)
        FROM jsonb_array_elements(steps_json->'steps') WITH ORDINALITY AS listed(step, ordinality)
        WHERE step->>'id' IS DISTINCT FROM 'dismiss-training-moved-message'
      ),
      '[]'::jsonb
    ),
    '{1}',
    $dismiss${
      "id": "dismiss-training-moved-message",
      "instruction": "Click on any color message box to hide it. Click on the green message box to move to the next step.",
      "successMessage": "Message hidden.",
      "failureMessage": "Click the green message box that says Training box moved.",
      "interaction": { "type": "click", "elementId": "training-box-moved-message" }
    }$dismiss$::jsonb,
    false
  )
)
WHERE instruction_code = 'PRELIMS_MARKS'
  AND NOT EXISTS (
    SELECT 1
    FROM jsonb_array_elements(steps_json->'steps') AS step
    WHERE step->>'id' = 'dismiss-training-moved-message'
  );
