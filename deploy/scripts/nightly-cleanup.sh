#!/bin/sh
# Run nightly demo-event date shift. Used by deploy scheduler and manual ops.
set -eu

: "${PGHOST:=postgres}"
: "${POSTGRES_USER:=postgres}"
: "${POSTGRES_PASSWORD:=postgres}"
: "${POSTGRES_DB:=event_system_pro}"

export PGPASSWORD="$POSTGRES_PASSWORD"

psql -h "$PGHOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 \
  -c "SELECT api.nightly_cleanup();"
