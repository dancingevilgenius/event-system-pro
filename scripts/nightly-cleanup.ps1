# Run nightly demo-event date shift (local Windows / Task Scheduler).
#   powershell -File scripts/nightly-cleanup.ps1
#
# Schedule example: daily at 12:00 AM in Task Scheduler.

$ErrorActionPreference = 'Stop'
$psql = 'C:\Program Files\PostgreSQL\18\bin\psql.exe'
$db = 'event_system_pro'

& $psql -U postgres -d $db -v ON_ERROR_STOP=1 -c "SELECT api.nightly_cleanup();"
