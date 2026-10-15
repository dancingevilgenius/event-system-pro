-- Prelims coaching: click All, mark Alternate on the second couple, and mark No on a later couple.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/144_training_all_filter_and_later_rows.sql

\connect event_system_pro

UPDATE public.training_instructions
SET steps_json = jsonb_set(
  steps_json,
  '{steps}',
  $steps$[
    {
      "id": "move-training-panel",
      "instruction": "Move the training box to another spot on the screen.\nThe popup can be dragged by the header, which has the 6-dot icon on it.",
      "successMessage": "Training box moved.",
      "failureMessage": "Drag the training box by its heading.",
      "interaction": { "type": "drag", "elementId": "page-training-coach" }
    },
    {
      "id": "dismiss-training-moved-message",
      "instruction": "Click on any color message box to hide it. Click on the green message box to move to the next step.",
      "successMessage": "Message hidden.",
      "failureMessage": "Click the green message box that says Training box moved.",
      "interaction": { "type": "click", "elementId": "training-box-moved-message" }
    },
    {
      "id": "mark-yes",
      "instruction": "On the first couple, open the mark list and choose Yes.",
      "successMessage": "Yes mark recorded.",
      "failureMessage": "That was not Yes. Choose Yes on the first couple.",
      "interaction": { "type": "select", "elementId": "prelims-mark-row-1", "option": "yes" }
    },
    {
      "id": "filter-yes",
      "instruction": "Click the Yes filter to review that couple.",
      "successMessage": "Showing couples marked Yes.",
      "failureMessage": "Click the Yes filter.",
      "interaction": { "type": "click", "elementId": "prelims-filter-yes" }
    },
    {
      "id": "filter-all",
      "instruction": "Click the All filter to view all competitors.",
      "successMessage": "Showing all competitors.",
      "failureMessage": "Click the All filter.",
      "interaction": { "type": "click", "elementId": "prelims-filter-all" }
    },
    {
      "id": "mark-maybe",
      "instruction": "On the second couple, open the mark list and choose Alternate.",
      "successMessage": "Alternate mark recorded.",
      "failureMessage": "That was not Alternate. Choose Alternate on the second couple.",
      "interaction": { "type": "select", "elementId": "prelims-mark-row-2", "option": "maybe" }
    },
    {
      "id": "filter-maybe",
      "instruction": "Click the Alternate filter.",
      "successMessage": "Showing couples marked Alternate.",
      "failureMessage": "Click the Alternate filter.",
      "interaction": { "type": "click", "elementId": "prelims-filter-maybe" }
    },
    {
      "id": "mark-no",
      "instruction": "On any couple after the second, choose No.",
      "successMessage": "No mark recorded. Training complete.",
      "failureMessage": "That was not No. Choose No on a couple after the second.",
      "interaction": { "type": "select", "elementId": "prelims-mark-row-after-2", "option": "no", "anyRowAfterSecond": true }
    }
  ]$steps$::jsonb
)
WHERE instruction_code = 'PRELIMS_MARKS';
