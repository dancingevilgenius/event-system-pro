#!/bin/sh
set -eu

PGHOST="${PGHOST:-postgres}"
PGUSER="${POSTGRES_USER:-postgres}"
PGPASSWORD="${POSTGRES_PASSWORD:-postgres}"
PGDATABASE="${POSTGRES_DB:-event_system_pro}"
export PGPASSWORD

LAST_STEP="startup"

fail() {
  code="$1"
  shift
  echo "ERROR: $*"
  echo "Failed during: ${LAST_STEP}"
  exit "$code"
}

if [ -z "${POSTGRES_PASSWORD:-}" ]; then
  echo "ERROR: POSTGRES_PASSWORD is empty inside the migrate container."
  echo "Set it in Dokploy → Environment and Deploy again."
  exit 2
fi

echo "POSTGRES_PASSWORD is set (length $(printf '%s' "$POSTGRES_PASSWORD" | wc -c | tr -d ' '))"

psql_cmd() {
  psql -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" -v ON_ERROR_STOP=1 "$@"
}

LAST_STEP="wait for postgres"
echo "Waiting for PostgreSQL at ${PGHOST} (database=${PGDATABASE}, user=${PGUSER})..."
until pg_isready -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" >/dev/null 2>&1; do
  sleep 1
done

BASELINE="/sql/event-system-pro/evp_schema_postgresql.sql"
LAST_STEP="preflight SQL files"
if [ ! -f "$BASELINE" ]; then
  fail 2 "baseline SQL not found at ${BASELINE}. Rebuild the migrate image (Deploy in Dokploy)."
fi

if [ ! -d /sql/migrations ]; then
  fail 2 "migrations directory not found at /sql/migrations. Rebuild the migrate image (Deploy in Dokploy)."
fi

echo "Using baseline: ${BASELINE}"
echo "Migration files: $(ls /sql/migrations/*.sql 2>/dev/null | wc -l | tr -d ' ')"

LAST_STEP="database connection check"
if ! psql_cmd -c "SELECT 1 AS ok;" >/dev/null 2>&1; then
  echo "ERROR: Cannot connect to PostgreSQL database '${PGDATABASE}' as '${PGUSER}'."
  if psql -h "$PGHOST" -U "$PGUSER" -d postgres -v ON_ERROR_STOP=1 -c "SELECT 1;" >/dev/null 2>&1; then
    echo "Connected to database 'postgres' successfully."
    echo "Likely fix: delete the Dokploy pgdata volume and Deploy again so Postgres re-initializes,"
    echo "or set POSTGRES_PASSWORD to the password used when pgdata was first created."
  else
    echo "Cannot connect to database 'postgres' either."
    echo "Likely fix: verify POSTGRES_PASSWORD in Dokploy Environment matches the pgdata volume,"
    echo "or delete the pgdata volume and Deploy again."
  fi
  fail 2 "PostgreSQL authentication or database setup failed."
fi

LAST_STEP="create schema_migrations"
psql_cmd <<'SQL'
CREATE TABLE IF NOT EXISTS public.schema_migrations (
  filename text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);
SQL

migration_applied() {
  name="$1"
  applied="$(psql -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" -tAc \
    "SELECT 1 FROM public.schema_migrations WHERE filename = '${name}'")"
  [ "$applied" = "1" ]
}

record_migration() {
  name="$1"
  LAST_STEP="record ${name}"
  psql_cmd -c "INSERT INTO public.schema_migrations (filename) VALUES ('${name}')"
}

apply_sql() {
  name="$1"
  file="$2"

  if migration_applied "$name"; then
    echo "Skip (already applied): ${name}"
    return 0
  fi

  LAST_STEP="apply ${name}"
  echo "Applying: ${name}"
  psql_cmd -f "$file"
  record_migration "$name"
}

skip_superseded_by_baseline() {
  name="$1"
  base="${name#migrations/}"
  base="${base%.sql}"
  manifest="/sql/superseded-by-baseline.manifest"
  if [ ! -f "$manifest" ]; then
    case "$name" in
      migrations/005_*|migrations/006_*|migrations/007_*|migrations/015_*|migrations/017_*|migrations/027_*|migrations/030_*|migrations/051_*|migrations/052_*|migrations/053_*) return 0 ;;
      *) return 1 ;;
    esac
  fi
  while IFS= read -r pattern || [ -n "$pattern" ]; do
    pattern=$(printf '%s' "$pattern" | tr -d '\r')
    case "$pattern" in
      ''|\#*) continue ;;
    esac
    if printf '%s' "$base" | grep -Eq "$pattern"; then
      return 0
    fi
  done < "$manifest"
  return 1
}

apply_baseline() {
  if migration_applied "baseline/evp_schema_postgresql.sql"; then
    echo "Skip (already applied): baseline/evp_schema_postgresql.sql"
    return 0
  fi

  LAST_STEP="apply baseline/evp_schema_postgresql.sql"
  echo "Applying: baseline/evp_schema_postgresql.sql"
  psql_cmd -f "$BASELINE"

  ref="/sql/event-system-pro/baseline_reference_data.sql"
  if [ ! -f "$ref" ]; then
    fail 2 "baseline reference data not found at ${ref}. Rebuild the migrate image (Deploy in Dokploy)."
  fi

  LAST_STEP="apply baseline/baseline_reference_data.sql"
  echo "Applying: baseline/baseline_reference_data.sql"
  psql_cmd -f "$ref"

  record_migration "baseline/evp_schema_postgresql.sql"
}

apply_baseline

for file in /sql/migrations/*.sql; do
  [ -f "$file" ] || continue
  name="migrations/$(basename "$file")"

  if skip_superseded_by_baseline "$name"; then
    if migration_applied "$name"; then
      echo "Skip (already applied): ${name}"
      continue
    fi
    LAST_STEP="skip superseded ${name}"
    echo "Skip (superseded by baseline): ${name}"
    record_migration "$name"
    continue
  fi

  apply_sql "$name" "$file"
done

echo "Database migrations complete."

case "${SEED_DEV_DATA:-}" in
  1|true|TRUE|yes|YES)
    echo "SEED_DEV_DATA enabled — applying dev seed bundle ..."
    /seed-dev-environment.sh
    ;;
  *)
    echo "SEED_DEV_DATA not set — skipping dev seeds (set SEED_DEV_DATA=true for imake.wtf test deploys)."
    ;;
esac

LAST_STEP="record deployment_info"
DEPLOYED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
psql_cmd <<SQL
WITH updated AS (
  UPDATE public.system_config
  SET
    value = json_build_object(
      'deployed_at', '${DEPLOYED_AT}',
      'deploy_source', 'dokploy'
    )::text,
    modified_by = 'maintenance',
    modified_date = CURRENT_TIMESTAMP
  WHERE label = 'deployment_info'
  RETURNING 1
)
INSERT INTO public.system_config (label, value, active, created_by)
SELECT
  'deployment_info',
  json_build_object(
    'deployed_at', '${DEPLOYED_AT}',
    'deploy_source', 'dokploy'
  )::text,
  true,
  'maintenance'
WHERE NOT EXISTS (SELECT 1 FROM updated);
SQL

echo "Recorded deployment_info at ${DEPLOYED_AT}."
