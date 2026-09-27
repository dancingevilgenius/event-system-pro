-- Prefer interval schedules for short inactivity_logout periods so the
-- scheduler's refreshable interval loops pick up enable/frequency changes
-- without relying on a one-shot crontab install.
-- Also convert legacy once-a-minute cron (* * * * *) to interval 60.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/134_inactivity_logout_interval_schedules.sql

\connect event_system_pro

UPDATE maintenance.job_definition AS d
SET
  schedule_cron = NULL,
  interval_seconds = 60,
  stale_after_interval = INTERVAL '5 minutes',
  modified_date = CURRENT_TIMESTAMP,
  modified_by = 'c-agent'
WHERE d.job_name = 'inactivity_logout'
  AND d.schedule_cron = '* * * * *'
  AND d.interval_seconds IS NULL;

UPDATE maintenance.job_definition AS d
SET
  schedule_cron = NULL,
  interval_seconds = 600,
  stale_after_interval = INTERVAL '45 minutes',
  modified_date = CURRENT_TIMESTAMP,
  modified_by = 'c-agent'
WHERE d.job_name = 'inactivity_logout'
  AND d.schedule_cron = '*/10 * * * *'
  AND d.interval_seconds IS NULL;

UPDATE maintenance.job_definition AS d
SET
  schedule_cron = NULL,
  interval_seconds = 300,
  stale_after_interval = INTERVAL '15 minutes',
  modified_date = CURRENT_TIMESTAMP,
  modified_by = 'c-agent'
WHERE d.job_name = 'inactivity_logout'
  AND d.schedule_cron = '*/5 * * * *'
  AND d.interval_seconds IS NULL;

NOTIFY pgrst, 'reload schema';
