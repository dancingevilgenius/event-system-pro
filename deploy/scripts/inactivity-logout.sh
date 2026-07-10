#!/bin/sh
# Mark inactive signed-in users for forced sign-out. Used by deploy scheduler and manual ops.
exec /run-maintenance-job.sh inactivity_logout
