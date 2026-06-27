$ErrorActionPreference = 'Stop'
$psql = 'C:\Program Files\PostgreSQL\18\bin\psql.exe'
$root = 'd:\Workspaces\VSCode\event-system-pro'
$db = 'event_system_pro'

Write-Host 'Terminating connections...'
& $psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$db' AND pid <> pg_backend_pid();"

Write-Host 'Recreating database...'
& $psql -U postgres -c "DROP DATABASE IF EXISTS $db;"
& $psql -U postgres -c "CREATE DATABASE $db WITH ENCODING 'UTF8' TEMPLATE template0;"

Write-Host 'Applying baseline schema...'
& $psql -U postgres -d $db -f "$root\database\event-system-pro\evp_schema_postgresql.sql"

Write-Host 'Applying migrations...'
Get-ChildItem "$root\database\migrations\*.sql" | Sort-Object Name | ForEach-Object {
  Write-Host "  $($_.Name)"
  & $psql -U postgres -d $db -f $_.FullName
  if ($LASTEXITCODE -ne 0) { throw "Migration failed: $($_.Name)" }
}

Write-Host 'Applying seeds...'
$seeds = @(
  '002_event_type_lu_seed.sql',
  '003_user_dummy.sql',
  '004_user_carlos.sql',
  '005_user_superheroes.sql',
  '005a_update_superhero_addresses.sql',
  '006_user_superhero_followers.sql',
  '007_dancingevilgenius_app_roles.sql',
  '008_event_group_fictional.sql',
  '009_event_group_robot.sql',
  '010_event_group_plasma_duel.sql'
)
foreach ($s in $seeds) {
  Write-Host "  $s"
  & $psql -U postgres -d $db -f "$root\database\seeds\$s"
  if ($LASTEXITCODE -ne 0) { throw "Seed failed: $s" }
}

Write-Host 'Verifying _lu audit actors...'
& $psql -U postgres -d $db -c @"
SELECT 'country_lu' AS tbl, created_by, modified_by, count(*) FROM public.country_lu GROUP BY 1,2,3
UNION ALL SELECT 'us_state_lu', created_by, modified_by, count(*) FROM public.us_state_lu GROUP BY 1,2,3
UNION ALL SELECT 'secret_question_lu', created_by, modified_by, count(*) FROM public.secret_question_lu GROUP BY 1,2,3
UNION ALL SELECT 'skill_level_lu', created_by, modified_by, count(*) FROM public.skill_level_lu GROUP BY 1,2,3
UNION ALL SELECT 'competitor_type_lu', created_by, modified_by, count(*) FROM public.competitor_type_lu GROUP BY 1,2,3
UNION ALL SELECT 'event_type_lu', created_by, modified_by, count(*) FROM public.event_type_lu GROUP BY 1,2,3
ORDER BY 1, 2, 3;
"@

Write-Host 'Done.'
