# Mark inactive signed-in users for forced sign-out (local Windows / Task Scheduler).
#   powershell -File scripts/inactivity-logout.ps1
#
# Schedule example: every 5 minutes in Task Scheduler.

$ErrorActionPreference = 'Stop'
$psql = 'C:\Program Files\PostgreSQL\18\bin\psql.exe'
$db = 'event_system_pro'

& $psql -U postgres -d $db -v ON_ERROR_STOP=1 -c "SELECT api.inactivity_logout();"
