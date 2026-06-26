# Configure PostgreSQL on this machine for passwordless LOCAL connections only.
# Requires Administrator (edits pg_hba.conf under Program Files).
#
# Usage (PowerShell as Administrator):
#   .\scripts\configure-local-postgres-trust.ps1
#
# After running, reload PostgreSQL and test:
#   psql -U postgres -d event_system_pro -c "SELECT 1"

$ErrorActionPreference = "Stop"

$hbaCandidates = @(
  "C:\Program Files\PostgreSQL\18\data\pg_hba.conf",
  "C:\Program Files\PostgreSQL\17\data\pg_hba.conf",
  "C:\Program Files\PostgreSQL\16\data\pg_hba.conf"
)

$hbaPath = $hbaCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $hbaPath) {
  throw "Could not find pg_hba.conf. Install PostgreSQL or pass the path as the first argument."
}
if ($args.Count -gt 0) {
  $hbaPath = $args[0]
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupPath = "$hbaPath.backup-$timestamp"
Copy-Item $hbaPath $backupPath
Write-Host "Backup: $backupPath"

$content = Get-Content $hbaPath -Raw
$updated = $content `
  -replace '(?m)^(local\s+all\s+all\s+)\S+', '${1}trust' `
  -replace '(?m)^(host\s+all\s+all\s+127\.0\.0\.1/32\s+)\S+', '${1}trust' `
  -replace '(?m)^(host\s+all\s+all\s+::1/128\s+)\S+', '${1}trust'

if ($content -eq $updated) {
  Write-Host "pg_hba.conf already uses trust for local connections."
} else {
  Set-Content -Path $hbaPath -Value $updated
  Write-Host "Updated local auth to trust in: $hbaPath"
}

$service = Get-Service -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -like "postgresql*" } |
  Select-Object -First 1

if ($service) {
  $reloadOk = $false
  $pgCtl = Get-ChildItem "C:\Program Files\PostgreSQL\*\bin\pg_ctl.exe" -ErrorAction SilentlyContinue |
    Select-Object -First 1
  if ($pgCtl) {
    & $pgCtl.FullName reload -D (Split-Path $hbaPath -Parent) 2>$null
    if ($LASTEXITCODE -eq 0) { $reloadOk = $true }
  }
  if (-not $reloadOk) {
    Restart-Service $service.Name -Force
    Write-Host "Restarted PostgreSQL service ($($service.Name))."
  } else {
    Write-Host "Reloaded PostgreSQL ($($service.Name))."
  }
} else {
  Write-Host "Reload PostgreSQL manually: pg_ctl reload -D data_directory"
}

Write-Host ""
Write-Host "Test:"
Write-Host "  psql -U postgres -d event_system_pro -c `"SELECT current_user, current_database();`""
