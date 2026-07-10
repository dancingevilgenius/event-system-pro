#!/bin/sh
# Scheduler entrypoint: install cron + interval loops from job_definition, then run crond.
set -eu

: "${PGHOST:=postgres}"
: "${POSTGRES_DB:=event_system_pro}"
: "${SCHEDULER_DB_USER:=scheduler}"
: "${SCHEDULER_DB_PASSWORD:=scheduler_dev_password}"

export PGPASSWORD="$SCHEDULER_DB_PASSWORD"

echo "scheduler: waiting for PostgreSQL at ${PGHOST} (db=${POSTGRES_DB}, user=${SCHEDULER_DB_USER})..."
i=0
CRONTAB_BODY=""
while [ "$i" -lt 60 ]; do
  set +e
  CRONTAB_BODY="$(
    psql -h "$PGHOST" -U "$SCHEDULER_DB_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 -t -A \
      -c "SELECT api.scheduler_crontab();" 2>/dev/null
  )"
  PSQL_EXIT=$?
  set -e
  if [ "$PSQL_EXIT" -eq 0 ] && [ -n "$(printf '%s' "$CRONTAB_BODY" | tr -d '[:space:]')" ]; then
    break
  fi
  i=$((i + 1))
  sleep 2
done

if [ "$i" -ge 60 ] || [ -z "$(printf '%s' "$CRONTAB_BODY" | tr -d '[:space:]')" ]; then
  echo "scheduler: ERROR timed out waiting for api.scheduler_crontab()" >&2
  exit 1
fi

printf '%s\n' "$CRONTAB_BODY" > /etc/crontabs/root
chmod 0600 /etc/crontabs/root

echo "scheduler: installed crontab from maintenance.job_definition:"
sed 's/^/scheduler:   /' /etc/crontabs/root

INTERVAL_BODY="$(
  psql -h "$PGHOST" -U "$SCHEDULER_DB_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 -t -A \
    -c "SELECT api.scheduler_interval_jobs();"
)"

if [ -n "$(printf '%s' "$INTERVAL_BODY" | tr -d '[:space:]')" ]; then
  INTERVAL_FILE="$(mktemp)"
  printf '%s\n' "$INTERVAL_BODY" > "$INTERVAL_FILE"
  echo "scheduler: starting interval job loops:"
  while IFS="$(printf '\t')" read -r JOB_NAME INTERVAL_SECS; do
    if [ -z "${JOB_NAME:-}" ] || [ -z "${INTERVAL_SECS:-}" ]; then
      continue
    fi
    case "$INTERVAL_SECS" in
      *[!0-9]*|0)
        echo "scheduler: ERROR invalid interval_seconds for ${JOB_NAME}: ${INTERVAL_SECS}" >&2
        rm -f "$INTERVAL_FILE"
        exit 1
        ;;
    esac
    echo "scheduler:   ${JOB_NAME} every ${INTERVAL_SECS}s"
    (
      while true; do
        /run-maintenance-job.sh "$JOB_NAME" || true
        sleep "$INTERVAL_SECS"
      done
    ) &
  done < "$INTERVAL_FILE"
  rm -f "$INTERVAL_FILE"
fi

echo "scheduler: starting crond (TZ=${TZ:-UTC})"
exec crond -f -l 2
