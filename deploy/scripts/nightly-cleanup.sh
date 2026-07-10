#!/bin/sh
# Run nightly demo-event date shift. Used by deploy scheduler and manual ops.
# Connects as the limited `scheduler` role (inherits `maintenance` EXECUTE grants).
set -eu

: "${PGHOST:=postgres}"
: "${POSTGRES_DB:=event_system_pro}"
: "${SCHEDULER_DB_USER:=scheduler}"
: "${SCHEDULER_DB_PASSWORD:=scheduler_dev_password}"

export PGPASSWORD="$SCHEDULER_DB_PASSWORD"

psql -h "$PGHOST" -U "$SCHEDULER_DB_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 \
  -c "SELECT api.nightly_cleanup();"
