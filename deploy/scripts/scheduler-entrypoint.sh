#!/bin/sh
# Scheduler entrypoint: build crontab from maintenance.job_definition, then run crond.
set -eu

: "${PGHOST:=postgres}"
: "${POSTGRES_DB:=event_system_pro}"
: "${SCHEDULER_DB_USER:=scheduler}"
: "${SCHEDULER_DB_PASSWORD:=scheduler_dev_password}"

export PGPASSWORD="$SCHEDULER_DB_PASSWORD"

echo "scheduler: waiting for PostgreSQL at ${PGHOST} (db=${POSTGRES_DB}, user=${SCHEDULER_DB_USER})..."
i=0
while [ "$i" -lt 60 ]; do
  if psql -h "$PGHOST" -U "$SCHEDULER_DB_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 -t -A \
    -c "SELECT 1 FROM maintenance.job_definition LIMIT 1;" >/dev/null 2>&1; then
    break
  fi
  i=$((i + 1))
  sleep 2
done

if [ "$i" -ge 60 ]; then
  echo "scheduler: ERROR timed out waiting for maintenance.job_definition" >&2
  exit 1
fi

CRONTAB_BODY="$(
  psql -h "$PGHOST" -U "$SCHEDULER_DB_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 -t -A \
    -c "SELECT api.scheduler_crontab();"
)"

if [ -z "$(printf '%s' "$CRONTAB_BODY" | tr -d '[:space:]')" ]; then
  echo "scheduler: ERROR api.scheduler_crontab() returned empty body" >&2
  exit 1
fi

printf '%s\n' "$CRONTAB_BODY" > /etc/crontabs/root
chmod 0600 /etc/crontabs/root

echo "scheduler: installed crontab from maintenance.job_definition:"
sed 's/^/scheduler:   /' /etc/crontabs/root

echo "scheduler: starting crond (TZ=${TZ:-UTC})"
exec crond -f -l 2
