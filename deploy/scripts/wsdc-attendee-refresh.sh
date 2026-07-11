#!/bin/sh
# Fetch WSDC registry profiles for in-progress / upcoming-event attendees and save them.
# Invoked by run-maintenance-job.sh for job_name=wsdc_attendee_refresh.
set -eu

: "${PGHOST:=postgres}"
: "${POSTGRES_DB:=event_system_pro}"
: "${SCHEDULER_DB_USER:=scheduler}"
: "${SCHEDULER_DB_PASSWORD:=scheduler_dev_password}"
: "${WSDC_REGISTRY_BASE:=https://worldsdc.com/wp-json/wsdcregistry/v1}"

export PGPASSWORD="$SCHEDULER_DB_PASSWORD"

psql_q() {
  psql -h "$PGHOST" -U "$SCHEDULER_DB_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 -t -A "$@"
}

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

PREPARE_JSON="$(psql_q -c "SELECT api._wsdc_attendee_refresh_prepare();")"
printf '%s' "$PREPARE_JSON" >"$TMP_DIR/prepare.json"

if ! jq -e '.ok == true' "$TMP_DIR/prepare.json" >/dev/null 2>&1; then
  psql_q -c "SELECT api.record_maintenance_job_result('wsdc_attendee_refresh', pg_read_file('$TMP_DIR/prepare.json')::json, false, 'prepare_failed');" >/dev/null 2>&1 \
    || psql_q -c "SELECT api.record_maintenance_job_result('wsdc_attendee_refresh', '{\"ok\":false,\"message\":\"prepare_failed\"}'::json, false, 'prepare_failed');" >/dev/null \
    || true
  cat "$TMP_DIR/prepare.json"
  exit 1
fi

EVENTS_COUNT="$(jq -r '.events_count // 0' "$TMP_DIR/prepare.json")"
ATTENDEES_ADDED="$(jq -r '.attendees_added // 0' "$TMP_DIR/prepare.json")"
USERS_UPDATED=0
USERS_FAILED=0
USERS_SKIPPED=0

jq -c '.targets // [] | .[]' "$TMP_DIR/prepare.json" >"$TMP_DIR/targets.jsonl"

while IFS= read -r TARGET || [ -n "$TARGET" ]; do
  [ -n "$TARGET" ] || continue

  USER_ID="$(printf '%s' "$TARGET" | jq -r '.user_id')"
  WSDC_ID="$(printf '%s' "$TARGET" | jq -r '.wsdc_id')"

  if [ -z "$USER_ID" ] || [ "$USER_ID" = "null" ] || [ -z "$WSDC_ID" ] || [ "$WSDC_ID" = "null" ]; then
    USERS_SKIPPED=$((USERS_SKIPPED + 1))
    continue
  fi

  set +e
  PROFILE="$(curl -fsS --max-time 30 "${WSDC_REGISTRY_BASE}/find.json?num=${WSDC_ID}")"
  CURL_EXIT=$?
  set -e

  if [ "$CURL_EXIT" -ne 0 ] || [ -z "$PROFILE" ]; then
    USERS_FAILED=$((USERS_FAILED + 1))
    continue
  fi

  if printf '%s' "$PROFILE" | jq -e '(.names | type) == "array"' >/dev/null 2>&1; then
    USERS_SKIPPED=$((USERS_SKIPPED + 1))
    continue
  fi

  if ! printf '%s' "$PROFILE" | jq -e '.dancer_wsdcid != null' >/dev/null 2>&1; then
    USERS_FAILED=$((USERS_FAILED + 1))
    continue
  fi

  INFO_JSON="$(printf '%s' "$PROFILE" | jq -c \
    --arg wid "$WSDC_ID" \
    '{
      wsdc_id: $wid,
      dancer_first: .dancer_first,
      dancer_last: .dancer_last,
      dancer_wsdcid: .dancer_wsdcid,
      primary_role: .dominate_role,
      secondary_role: .non_dominate_role,
      primary_required: .dominate_required,
      primary_allowed: .dominate_allowed,
      secondary_required: .non_dominate_required,
      secondary_allowed: .non_dominate_allowed,
      short_primary_role: .short_dominate_role,
      short_secondary_role: .short_non_dominate_role,
      primary_role_highest_level: .dominate_role_highest_level,
      primary_role_highest_level_points: .dominate_role_highest_level_points,
      secondary_role_highest_level: .non_dominate_role_highest_level,
      secondary_role_highest_level_points: .non_dominate_role_highest_level_points
    }')"

  set +e
  APPLY_JSON="$(
    psql_q -c "SELECT api.apply_user_wsdc_info_maintenance(${USER_ID}, '${WSDC_ID}', \$wsdc\$${INFO_JSON}\$wsdc\$::json);"
  )"
  APPLY_EXIT=$?
  set -e

  if [ "$APPLY_EXIT" -eq 0 ] && printf '%s' "$APPLY_JSON" | grep -Eq '"ok"[[:space:]]*:[[:space:]]*true'; then
    USERS_UPDATED=$((USERS_UPDATED + 1))
  else
    USERS_FAILED=$((USERS_FAILED + 1))
  fi
done <"$TMP_DIR/targets.jsonl"

RESULT_JSON="$(jq -nc \
  --argjson events_count "$EVENTS_COUNT" \
  --argjson attendees_added "$ATTENDEES_ADDED" \
  --argjson users_updated "$USERS_UPDATED" \
  --argjson users_failed "$USERS_FAILED" \
  --argjson users_skipped "$USERS_SKIPPED" \
  --arg msg "WSDC refresh updated ${USERS_UPDATED} user(s)." \
  '{
    ok: true,
    skipped: false,
    events_count: $events_count,
    attendees_added: $attendees_added,
    users_updated: $users_updated,
    users_failed: $users_failed,
    users_skipped: $users_skipped,
    message: $msg
  }')"

printf '%s' "$RESULT_JSON" >"$TMP_DIR/result.json"

OK_SQL=true
if [ "$USERS_FAILED" -gt 0 ] && [ "$USERS_UPDATED" -eq 0 ]; then
  OK_SQL=false
fi

psql_q -c "SELECT api.record_maintenance_job_result('wsdc_attendee_refresh', \$wsdc\$${RESULT_JSON}\$wsdc\$::json, ${OK_SQL}, NULL);" >/dev/null

echo "$RESULT_JSON"

if [ "$OK_SQL" = "true" ]; then
  exit 0
fi
exit 1
