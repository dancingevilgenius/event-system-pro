# Full local rebuild: drop event_system_pro, apply baseline + migrations + dev seeds.
#
# Usage (from repo root or scripts folder):
#   .\scripts\rebuild-local-database.ps1
#
# Optional:
#   .\scripts\rebuild-local-database.ps1 -Database event_system_pro -PostgresUser postgres

[CmdletBinding()]
param(
    [string]$Database = 'event_system_pro',
    [string]$PostgresUser = 'postgres',
    [string]$PsqlPath
)

$ErrorActionPreference = 'Stop'

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

function Resolve-PsqlPath {
    param([string]$ExplicitPath)

    if ($ExplicitPath -and (Test-Path $ExplicitPath)) {
        return (Resolve-Path $ExplicitPath).Path
    }

    $fromPath = Get-Command psql -ErrorAction SilentlyContinue
    if ($fromPath) {
        return $fromPath.Source
    }

    $candidates = @(
        'C:\Program Files\PostgreSQL\18\bin\psql.exe',
        'C:\Program Files\PostgreSQL\17\bin\psql.exe',
        'C:\Program Files\PostgreSQL\16\bin\psql.exe'
    )
    foreach ($candidate in $candidates) {
        if (Test-Path $candidate) {
            return $candidate
        }
    }

    throw 'psql not found. Install PostgreSQL or pass -PsqlPath.'
}

function Test-MigrationSupersededByBaseline {
    param([string]$FileName)
    return $FileName -match '^(005|006|007|015|017|027|030|051|052|053|001_event_type|002_event_type|078_|079_|080_)'
}

function Invoke-Psql {
    param(
        [string[]]$Arguments
    )

    & $script:Psql @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "psql failed (exit $LASTEXITCODE): psql $($Arguments -join ' ')"
    }
}

$Psql = Resolve-PsqlPath -ExplicitPath $PsqlPath

Write-Host "Repository: $RepoRoot"
Write-Host "Database:   $Database"
Write-Host "psql:       $Psql"

Write-Host 'Terminating connections...'
Invoke-Psql @(
    '-U', $PostgresUser,
    '-d', 'postgres',
    '-v', 'ON_ERROR_STOP=1',
    '-c', "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$Database' AND pid <> pg_backend_pid();"
)

Write-Host 'Recreating database...'
Invoke-Psql @('-U', $PostgresUser, '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', '-c', "DROP DATABASE IF EXISTS $Database;")
Invoke-Psql @(
    '-U', $PostgresUser,
    '-d', 'postgres',
    '-v', 'ON_ERROR_STOP=1',
    '-c', "CREATE DATABASE $Database WITH ENCODING 'UTF8' TEMPLATE template0;"
)

Write-Host 'Applying baseline schema...'
$baseline = Join-Path $RepoRoot 'database\event-system-pro\evp_schema_postgresql.sql'
Invoke-Psql @('-U', $PostgresUser, '-d', $Database, '-v', 'ON_ERROR_STOP=1', '-f', $baseline)

Write-Host 'Applying migrations...'
Get-ChildItem (Join-Path $RepoRoot 'database\migrations\*.sql') |
    Sort-Object Name |
    ForEach-Object {
        if (Test-MigrationSupersededByBaseline -FileName $_.Name) {
            Write-Host "  skip (superseded by baseline): $($_.Name)" -ForegroundColor DarkYellow
            return
        }

        Write-Host "  $($_.Name)"
        Invoke-Psql @('-U', $PostgresUser, '-d', $Database, '-v', 'ON_ERROR_STOP=1', '-f', $_.FullName)
    }

Write-Host 'Applying seeds...'
$manifestPath = Join-Path $RepoRoot 'database\seeds\dev.manifest'
if (-not (Test-Path $manifestPath)) {
    throw "Seed manifest not found: $manifestPath"
}

Get-Content $manifestPath | ForEach-Object {
    $seed = ($_ -replace '#.*', '').Trim()
    if ([string]::IsNullOrWhiteSpace($seed)) { return }

    Write-Host "  $seed"
    $seedPath = Join-Path $RepoRoot "database\seeds\$seed"
    if (-not (Test-Path $seedPath)) {
        throw "Seed file not found: $seedPath"
    }
    Invoke-Psql @('-U', $PostgresUser, '-d', $Database, '-v', 'ON_ERROR_STOP=1', '-f', $seedPath)
}

Write-Host 'Verifying...'
Invoke-Psql @(
    '-U', $PostgresUser,
    '-d', $Database,
    '-v', 'ON_ERROR_STOP=1',
    '-c',
    @"
SELECT 'public_tables' AS metric, count(*)::text AS value FROM pg_tables WHERE schemaname = 'public'
UNION ALL SELECT 'api_views', count(*)::text FROM pg_views WHERE schemaname = 'api'
UNION ALL SELECT 'users', count(*)::text FROM public."user"
UNION ALL SELECT 'event_types', jsonb_array_length(list_json::jsonb)::text FROM public.static_list WHERE list_code = 'EVENT_TYPES'
UNION ALL SELECT 'events', count(*)::text FROM public."event"
ORDER BY 1;
"@
)

Write-Host 'Verifying _lu audit actors...'
Invoke-Psql @(
    '-U', $PostgresUser,
    '-d', $Database,
    '-v', 'ON_ERROR_STOP=1',
    '-c',
    @"
SELECT 'secret_question_lu', created_by, modified_by, count(*) FROM public.secret_question_lu GROUP BY 1,2,3
UNION ALL SELECT 'skill_level_lu', created_by, modified_by, count(*) FROM public.skill_level_lu GROUP BY 1,2,3
UNION ALL SELECT 'competitor_type_lu', created_by, modified_by, count(*) FROM public.competitor_type_lu GROUP BY 1,2,3
ORDER BY 1, 2, 3;
"@
)

Write-Host 'Done.' -ForegroundColor Green
