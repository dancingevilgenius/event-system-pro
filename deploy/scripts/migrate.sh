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
  case "$1" in
    migrations/005_*|migrations/006_*|migrations/007_*|migrations/015_*|migrations/027_*|migrations/030_*) return 0 ;;
    *) return 1 ;;
  esac
}

apply_sql "baseline/evp_schema_postgresql.sql" "$BASELINE"

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
