#!/bin/sh
# Apply database/seeds/dev.manifest (tracked in public.schema_seeds).
# Invoked automatically from migrate.sh when SEED_DEV_DATA=true, or manually:
#   docker run --rm --entrypoint /seed-dev-environment.sh ...

set -eu

PGHOST="${PGHOST:-postgres}"
PGUSER="${POSTGRES_USER:-postgres}"
PGPASSWORD="${POSTGRES_PASSWORD:?Set POSTGRES_PASSWORD}"
PGDATABASE="${POSTGRES_DB:-event_system_pro}"
MANIFEST="${SEED_MANIFEST:-/sql/seeds/dev.manifest}"
export PGPASSWORD

psql_cmd() {
  psql -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" -v ON_ERROR_STOP=1 "$@"
}

if [ ! -f "$MANIFEST" ]; then
  echo "ERROR: seed manifest not found at ${MANIFEST}"
  exit 1
fi

psql_cmd <<'SQL'
CREATE TABLE IF NOT EXISTS public.schema_seeds (
  filename text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);
SQL

seed_applied() {
  name="$1"
  applied="$(psql -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" -tAc \
    "SELECT 1 FROM public.schema_seeds WHERE filename = '${name}'")"
  [ "$applied" = "1" ]
}

record_seed() {
  name="$1"
  psql_cmd -c "INSERT INTO public.schema_seeds (filename) VALUES ('${name}')"
}

apply_seed_file() {
  seed="$1"
  file="/sql/seeds/${seed}"

  if [ ! -f "$file" ]; then
    echo "ERROR: missing seed file ${file}"
    exit 1
  fi

  if seed_applied "$seed"; then
    echo "Skip seed (already applied): ${seed}"
    return 0
  fi

  echo "Applying seed: ${seed}"
  psql_cmd -f "$file"
  record_seed "$seed"
}

echo "Loading dev seeds from ${MANIFEST} ..."

while IFS= read -r line || [ -n "$line" ]; do
  line="$(printf '%s' "$line" | sed 's/#.*//' | tr -d '\r' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
  [ -z "$line" ] && continue
  apply_seed_file "$line"
done < "$MANIFEST"

echo "Dev seed bundle complete."
psql_cmd -c "
SELECT 'users' AS metric, count(*)::text AS value FROM public.\"user\"
UNION ALL SELECT 'demo_event_groups', count(*)::text FROM public.event_group
  WHERE COALESCE((more_json->>'demo')::boolean, false) = true
UNION ALL SELECT 'demo_events', count(*)::text FROM public.\"event\"
  WHERE COALESCE((more_json->>'demo')::boolean, false) = true
UNION ALL SELECT 'attendees', count(*)::text FROM public.attendee;
"
