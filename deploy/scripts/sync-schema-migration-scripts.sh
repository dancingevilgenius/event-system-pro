#!/bin/sh
# Register database/migrations/*.sql in the catalog. Does not apply them.
set -eu

DIR="${SCHEMA_MIGRATIONS_DIR:-/sql/migrations}"
if [ ! -d "$DIR" ]; then
  exit 0
fi

: "${PGHOST:=postgres}"
: "${POSTGRES_DB:=event_system_pro}"
: "${SCHEDULER_DB_USER:=scheduler}"
: "${SCHEDULER_DB_PASSWORD:=scheduler_dev_password}"
export PGPASSWORD="$SCHEDULER_DB_PASSWORD"

sql_quote() {
  printf "'%s'" "$(printf '%s' "$1" | sed "s/'/''/g")"
}

for file in "$DIR"/*.sql; do
  [ -f "$file" ] || continue
  base="$(basename "$file")"
  details="$(grep -m1 -E '^--[[:space:]]' "$file" | sed 's/^--[[:space:]]*//' | tr -d '\r' || true)"
  body="$(tr -d '\r' < "$file")"
  psql -h "$PGHOST" -U "$SCHEDULER_DB_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 -q -c \
    "SELECT api.upsert_schema_migration_script($(sql_quote "$base"), $(sql_quote "$details"), $(sql_quote "$body"));"
done
