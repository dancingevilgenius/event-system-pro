#!/bin/sh
# Shared maintenance job runner for cron and manual ops.
# Usage: run-maintenance-job.sh <job_name>
#   job_name: nightly_cleanup | inactivity_logout
#
# Connects as the limited `scheduler` role and calls api.run_maintenance_job().
# Logs one structured line to stdout for Docker log capture.
set -eu

JOB_NAME="${1:-}"
if [ -z "$JOB_NAME" ]; then
  echo "job= status=error error_message=job_name_required" >&2
  exit 1
fi

case "$JOB_NAME" in
  nightly_cleanup|inactivity_logout) ;;
  *)
    echo "job=${JOB_NAME} status=error error_message=unknown_job_name" >&2
    exit 1
    ;;
esac

: "${PGHOST:=postgres}"
: "${POSTGRES_DB:=event_system_pro}"
: "${SCHEDULER_DB_USER:=scheduler}"
: "${SCHEDULER_DB_PASSWORD:=scheduler_dev_password}"

export PGPASSWORD="$SCHEDULER_DB_PASSWORD"

START_EPOCH="$(date +%s 2>/dev/null || echo 0)"
echo "job=${JOB_NAME} status=starting started_at=$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || echo unknown)"

set +e
RESULT="$(
  psql -h "$PGHOST" -U "$SCHEDULER_DB_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 -t -A \
    -c "SELECT api.run_maintenance_job('${JOB_NAME}');" 2>&1
)"
PSQL_EXIT=$?
set -e

END_EPOCH="$(date +%s 2>/dev/null || echo 0)"
if [ "$START_EPOCH" -gt 0 ] 2>/dev/null && [ "$END_EPOCH" -gt 0 ] 2>/dev/null; then
  DURATION_MS=$(( (END_EPOCH - START_EPOCH) * 1000 ))
else
  DURATION_MS=-1
fi

RESULT_ONE_LINE="$(printf '%s' "$RESULT" | tr '\n' ' ' | sed 's/  */ /g' | sed 's/[[:space:]]*$//')"

if [ "$PSQL_EXIT" -ne 0 ]; then
  echo "job=${JOB_NAME} status=error duration_ms=${DURATION_MS} exit_code=${PSQL_EXIT} error_message=${RESULT_ONE_LINE}"
  exit "$PSQL_EXIT"
fi

case "$RESULT_ONE_LINE" in
  *'"ok" : false'*|*'\"ok\": false'*|*'"ok": false'*|*'"ok":false'*)
    echo "job=${JOB_NAME} status=error duration_ms=${DURATION_MS} exit_code=1 result=${RESULT_ONE_LINE}"
    exit 1
    ;;
  *'"status" : "skipped"'*|*'"status": "skipped"'*|*'"status":"skipped"'*)
    echo "job=${JOB_NAME} status=skipped duration_ms=${DURATION_MS} exit_code=0 result=${RESULT_ONE_LINE}"
    exit 0
    ;;
  *)
    echo "job=${JOB_NAME} status=ok duration_ms=${DURATION_MS} exit_code=0 result=${RESULT_ONE_LINE}"
    exit 0
    ;;
esac
