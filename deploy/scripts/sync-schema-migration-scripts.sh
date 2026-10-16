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
  tag='migbody'
  while printf '%s' "$body" | grep -F -q "\$${tag}\$"; do
    tag="${tag}x"
  done
  stmt="$(mktemp)"
  {
    printf 'SELECT api.upsert_schema_migration_script(%s, %s, $%s$' \
      "$(sql_quote "$base")" "$(sql_quote "$details")" "$tag"
    printf '%s' "$body"
    printf '$%s$);\n' "$tag"
  } > "$stmt"
  psql -h "$PGHOST" -U "$SCHEDULER_DB_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 -q -f "$stmt"
  rm -f "$stmt"
done
