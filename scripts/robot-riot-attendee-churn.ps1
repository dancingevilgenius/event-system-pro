# One-shot: rotate 10% of Robot Riot 2026 demo attendees (requires an active timed window).
# Prefer the Admin UI button "Rotate Robot Riot Attendees (10 min)", which opens the window.
#   powershell -File scripts/robot-riot-attendee-churn.ps1
#
# Uses the limited `scheduler` DB role (migration 104 default password).

$ErrorActionPreference = 'Stop'
$psql = 'C:\Program Files\PostgreSQL\18\bin\psql.exe'
$db = 'event_system_pro'
$user = if ($env:SCHEDULER_DB_USER) { $env:SCHEDULER_DB_USER } else { 'scheduler' }
$env:PGPASSWORD = if ($env:SCHEDULER_DB_PASSWORD) { $env:SCHEDULER_DB_PASSWORD } else { 'scheduler_dev_password' }

$started = Get-Date
Write-Host ("job=robot_riot_attendee_churn status=starting started_at={0:yyyy-MM-ddTHH:mm:ssZ}" -f $started.ToUniversalTime())

$result = & $psql -U $user -d $db -v ON_ERROR_STOP=1 -t -A -c "SELECT api.run_maintenance_job('robot_riot_attendee_churn');"
$exitCode = $LASTEXITCODE
$durationMs = [int]((Get-Date) - $started).TotalMilliseconds

if ($exitCode -ne 0 -or ($result -match '"ok"\s*:\s*false')) {
  Write-Host "job=robot_riot_attendee_churn status=error duration_ms=$durationMs exit_code=$exitCode result=$result"
  exit 1
}

if ($result -match '"status"\s*:\s*"skipped"') {
  Write-Host "job=robot_riot_attendee_churn status=skipped duration_ms=$durationMs exit_code=0 result=$result"
  exit 0
}

Write-Host "job=robot_riot_attendee_churn status=ok duration_ms=$durationMs exit_code=0 result=$result"
