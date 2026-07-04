# Apply one SQL migration file to a remote PostgreSQL database and record it in schema_migrations.
#
# Usage (from repo root):
#   .\scripts\apply-remote-migration.ps1 -MigrationFile database\migrations\069_drop_country_and_us_state_lu.sql
#   .\scripts\apply-remote-migration.ps1 -PostgresHost imake.wtf -EnvFile deploy\.env -MigrationFile database\migrations\069_drop_country_and_us_state_lu.sql
#
# Credentials: POSTGRES_PASSWORD from -EnvFile (or current process env). Password is never printed.

[CmdletBinding()]
param(
    [string]$PostgresHost = 'imake.wtf',
    [string]$PostgresUser = 'postgres',
    [string]$PostgresDatabase = 'event_system_pro',
    [string]$EnvFile = (Join-Path $PSScriptRoot '..\deploy\.env'),
    [Parameter(Mandatory = $true)]
    [string]$MigrationFile
)

$ErrorActionPreference = 'Stop'
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$MigrationPath = if ([System.IO.Path]::IsPathRooted($MigrationFile)) {
    $MigrationFile
} else {
    Join-Path $RepoRoot $MigrationFile
}

if (-not (Test-Path $MigrationPath)) {
    throw "Migration file not found: $MigrationPath"
}

if ($EnvFile -and (Test-Path $EnvFile)) {
    Get-Content $EnvFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -eq '' -or $line.StartsWith('#')) { return }
        $eq = $line.IndexOf('=')
        if ($eq -lt 1) { return }
        $name = $line.Substring(0, $eq).Trim()
        $value = $line.Substring($eq + 1).Trim()
        if ($value.StartsWith('"') -and $value.EndsWith('"')) {
            $value = $value.Substring(1, $value.Length - 2)
        }
        Set-Item -Path "env:$name" -Value $value
    }
}

if (-not $env:POSTGRES_PASSWORD) {
    throw 'POSTGRES_PASSWORD is not set. Add it to deploy/.env or set $env:POSTGRES_PASSWORD before running.'
}

$PsqlCandidates = @(
    'C:\Program Files\PostgreSQL\18\bin\psql.exe',
    'C:\Program Files\PostgreSQL\17\bin\psql.exe',
    'C:\Program Files\PostgreSQL\16\bin\psql.exe'
)
$Psql = $PsqlCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $Psql) {
    $fromPath = Get-Command psql -ErrorAction SilentlyContinue
    if ($fromPath) { $Psql = $fromPath.Source }
}
if (-not $Psql) {
    throw 'psql not found. Install PostgreSQL client tools or pass a machine with psql on PATH.'
}

$MigrationName = "migrations/$(Split-Path $MigrationPath -Leaf)"
$env:PGPASSWORD = $env:POSTGRES_PASSWORD

Write-Host "Target: ${PostgresUser}@${PostgresHost}/${PostgresDatabase}"
Write-Host "Migration: $MigrationName"

$alreadyApplied = & $Psql -h $PostgresHost -U $PostgresUser -d $PostgresDatabase -v ON_ERROR_STOP=1 -tAc `
    "SELECT 1 FROM public.schema_migrations WHERE filename = '$MigrationName';"
if ($alreadyApplied -eq '1') {
    Write-Host "Skip (already applied): $MigrationName" -ForegroundColor Yellow
    exit 0
}

$tablesBefore = & $Psql -h $PostgresHost -U $PostgresUser -d $PostgresDatabase -v ON_ERROR_STOP=1 -tAc `
    "SELECT coalesce(string_agg(tablename, ', '), '(none)') FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('country_lu', 'us_state_lu');"
Write-Host "Obsolete tables before: $tablesBefore"

Write-Host "Applying $MigrationName ..."
& $Psql -h $PostgresHost -U $PostgresUser -d $PostgresDatabase -v ON_ERROR_STOP=1 -f $MigrationPath

& $Psql -h $PostgresHost -U $PostgresUser -d $PostgresDatabase -v ON_ERROR_STOP=1 -c `
    "INSERT INTO public.schema_migrations (filename) VALUES ('$MigrationName');"

$tablesAfter = & $Psql -h $PostgresHost -U $PostgresUser -d $PostgresDatabase -v ON_ERROR_STOP=1 -tAc `
    "SELECT coalesce(string_agg(tablename, ', '), '(none)') FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('country_lu', 'us_state_lu');"
Write-Host "Obsolete tables after: $tablesAfter"
Write-Host 'Done.' -ForegroundColor Green
