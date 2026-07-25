#!/bin/sh
# Supervised design-system server — self-heals the session's SIGTERM churn.
cd "$(dirname "$0")/../design-system" || exit 1
while true; do
  python3 -m http.server 8765 --bind 127.0.0.1
  sleep 1
done
