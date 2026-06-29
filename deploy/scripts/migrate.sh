#!/bin/sh
set -e

PGHOST="${PGHOST:-postgres}"
PGUSER="${POSTGRES_USER:-postgres}"
PGPASSWORD="${POSTGRES_PASSWORD:-postgres}"
PGDATABASE="${POSTGRES_DB:-event_system_pro}"
export PGPASSWORD

echo "Waiting for PostgreSQL at ${PGHOST}..."
until pg_isready -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" >/dev/null 2>&1; do
  sleep 1
done

psql -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" -v ON_ERROR_STOP=1 <<'SQL'
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
  psql -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" -v ON_ERROR_STOP=1 \
    -c "INSERT INTO public.schema_migrations (filename) VALUES ('${name}')"
}

apply_sql() {
  name="$1"
  file="$2"

  if migration_applied "$name"; then
    echo "Skip (already applied): ${name}"
    return 0
  fi

  echo "Applying: ${name}"
  psql -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" -v ON_ERROR_STOP=1 -f "$file"
  record_migration "$name"
}

skip_superseded_by_baseline() {
  case "$1" in
    migrations/005_*|migrations/006_*|migrations/007_*|migrations/015_*|migrations/027_*|migrations/030_*) return 0 ;;
    *) return 1 ;;
  esac
}

apply_sql "baseline/evp_schema_postgresql.sql" "/sql/event-system-pro/evp_schema_postgresql.sql"

for file in /sql/migrations/*.sql; do
  [ -f "$file" ] || continue
  name="migrations/$(basename "$file")"

  if skip_superseded_by_baseline "$name"; then
    if migration_applied "$name"; then
      echo "Skip (already applied): ${name}"
      continue
    fi
    echo "Skip (superseded by baseline): ${name}"
    record_migration "$name"
    continue
  fi

  apply_sql "$name" "$file"
done

echo "Database migrations complete."
