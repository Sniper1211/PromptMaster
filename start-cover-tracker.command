#!/usr/bin/env bash
# Double-click this file in Finder to start the local cover-tracker server.
# It serves the tracker at http://127.0.0.1:7788 and opens it in your browser.
set -euo pipefail
cd "$(dirname "$0")"
exec npm run tracker
