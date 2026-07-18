#!/bin/sh
# Scheduler entrypoint: install cron + refreshable interval loops from job_definition, then run crond.
set -eu

: "${PGHOST:=postgres}"
: "${POSTGRES_DB:=event_system_pro}"
: "${SCHEDULER_DB_USER:=scheduler}"
: "${SCHEDULER_DB_PASSWORD:=scheduler_dev_password}"
: "${INTERVAL_REFRESH_SECONDS:=15}"

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

install_crontab() {
  BODY="$1"
  printf '%s\n' "$BODY" > /etc/crontabs/root
  chmod 0600 /etc/crontabs/root
}

install_crontab "$CRONTAB_BODY"

echo "scheduler: installed crontab from maintenance.job_definition:"
sed 's/^/scheduler:   /' /etc/crontabs/root

# Refreshable interval loops: pick up jobs added after boot (e.g. timed admin-started jobs)
# and stop loops when the job_definition row is removed or schedule mode changes.
INTERVAL_STATE_DIR="$(mktemp -d)"
trap 'rm -rf "$INTERVAL_STATE_DIR"' EXIT

start_interval_loop() {
  JOB_NAME="$1"
  INTERVAL_SECS="$2"
  PID_FILE="${INTERVAL_STATE_DIR}/${JOB_NAME}.pid"
  INTERVAL_FILE="${INTERVAL_STATE_DIR}/${JOB_NAME}.interval"

  if [ -f "$PID_FILE" ]; then
    OLD_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
    OLD_INTERVAL="$(cat "$INTERVAL_FILE" 2>/dev/null || true)"
    if [ -n "${OLD_PID:-}" ] && kill -0 "$OLD_PID" 2>/dev/null; then
      if [ "${OLD_INTERVAL:-}" = "$INTERVAL_SECS" ]; then
        return 0
      fi
      echo "scheduler: restarting interval loop ${JOB_NAME} (${OLD_INTERVAL:-?}s -> ${INTERVAL_SECS}s)"
      kill "$OLD_PID" 2>/dev/null || true
      rm -f "$PID_FILE" "$INTERVAL_FILE"
    else
      rm -f "$PID_FILE" "$INTERVAL_FILE"
    fi
  fi

  echo "scheduler: starting interval loop ${JOB_NAME} every ${INTERVAL_SECS}s"
  (
    while true; do
      # Exit when the job is no longer an enabled interval job.
      STILL_LISTED="$(
        psql -h "$PGHOST" -U "$SCHEDULER_DB_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 -t -A \
          -c "SELECT api.scheduler_interval_jobs();" 2>/dev/null \
        | awk -F '\t' -v job="$JOB_NAME" '$1 == job { print $1; exit }'
      )" || STILL_LISTED=""
      if [ -z "${STILL_LISTED:-}" ]; then
        echo "scheduler: stopping interval loop ${JOB_NAME} (job no longer registered)"
        exit 0
      fi

      /run-maintenance-job.sh "$JOB_NAME" || true
      sleep "$INTERVAL_SECS"
    done
  ) &
  echo $! > "$PID_FILE"
  printf '%s\n' "$INTERVAL_SECS" > "$INTERVAL_FILE"
}

sync_crontab() {
  set +e
  NEXT_CRONTAB="$(
    psql -h "$PGHOST" -U "$SCHEDULER_DB_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 -t -A \
      -c "SELECT api.scheduler_crontab();" 2>/dev/null
  )"
  PSQL_EXIT=$?
  set -e

  if [ "$PSQL_EXIT" -ne 0 ] || [ -z "$(printf '%s' "$NEXT_CRONTAB" | tr -d '[:space:]')" ]; then
    echo "scheduler: WARNING failed to refresh crontab from api.scheduler_crontab()" >&2
    return 0
  fi

  CURRENT_CRONTAB="$(cat /etc/crontabs/root 2>/dev/null || true)"
  if [ "$NEXT_CRONTAB" = "$CURRENT_CRONTAB" ]; then
    return 0
  fi

  install_crontab "$NEXT_CRONTAB"
  echo "scheduler: refreshed crontab from maintenance.job_definition:"
  sed 's/^/scheduler:   /' /etc/crontabs/root
}

sync_interval_loops() {
  INTERVAL_BODY="$(
    psql -h "$PGHOST" -U "$SCHEDULER_DB_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 -t -A \
      -c "SELECT api.scheduler_interval_jobs();" 2>/dev/null
  )" || INTERVAL_BODY=""

  DESIRED_FILE="$(mktemp)"
  printf '%s\n' "$INTERVAL_BODY" > "$DESIRED_FILE"

  if [ -n "$(printf '%s' "$INTERVAL_BODY" | tr -d '[:space:]')" ]; then
    while IFS="$(printf '\t')" read -r JOB_NAME INTERVAL_SECS; do
      if [ -z "${JOB_NAME:-}" ] || [ -z "${INTERVAL_SECS:-}" ]; then
        continue
      fi
      case "$INTERVAL_SECS" in
        *[!0-9]*|0)
          echo "scheduler: WARNING invalid interval_seconds for ${JOB_NAME}: ${INTERVAL_SECS}" >&2
          continue
          ;;
      esac
      start_interval_loop "$JOB_NAME" "$INTERVAL_SECS"
    done < "$DESIRED_FILE"
  fi

  # Stop loops for jobs that disappeared from the registry.
  for PID_FILE in "$INTERVAL_STATE_DIR"/*.pid; do
    [ -f "$PID_FILE" ] || continue
    JOB_NAME="$(basename "$PID_FILE" .pid)"
    if ! awk -F '\t' -v job="$JOB_NAME" '$1 == job { found=1; exit } END { exit !found }' "$DESIRED_FILE"; then
      OLD_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
      if [ -n "${OLD_PID:-}" ] && kill -0 "$OLD_PID" 2>/dev/null; then
        echo "scheduler: stopping interval loop ${JOB_NAME} (removed from job_definition)"
        kill "$OLD_PID" 2>/dev/null || true
      fi
      rm -f "$PID_FILE" "${INTERVAL_STATE_DIR}/${JOB_NAME}.interval"
    fi
  done

  rm -f "$DESIRED_FILE"
}

echo "scheduler: syncing schedules (refresh every ${INTERVAL_REFRESH_SECONDS}s)"
sync_crontab
sync_interval_loops
(
  while true; do
    sleep "$INTERVAL_REFRESH_SECONDS"
    sync_crontab
    sync_interval_loops
  done
) &

echo "scheduler: starting crond (TZ=${TZ:-UTC})"
exec crond -f -l 2
