# Mark inactive signed-in users for forced sign-out (local Windows / Task Scheduler).
#   powershell -File scripts/inactivity-logout.ps1
#
# Uses the limited `scheduler` DB role (migration 104 default password).
# Schedule example: every 5 minutes in Task Scheduler.

$ErrorActionPreference = 'Stop'
$psql = 'C:\Program Files\PostgreSQL\18\bin\psql.exe'
$db = 'event_system_pro'
$user = if ($env:SCHEDULER_DB_USER) { $env:SCHEDULER_DB_USER } else { 'scheduler' }
$env:PGPASSWORD = if ($env:SCHEDULER_DB_PASSWORD) { $env:SCHEDULER_DB_PASSWORD } else { 'scheduler_dev_password' }

& $psql -U $user -d $db -v ON_ERROR_STOP=1 -c "SELECT api.inactivity_logout();"
