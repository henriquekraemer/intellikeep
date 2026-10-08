#!/usr/bin/env bash
# Run IntelliKeep tests inside Docker (no local Python/HA install required).
# Usage: ./run-tests.sh [tests/test_foo.py] [-k filter] [extra pytest args...]
#
# The Python version decides which Home Assistant pip installs: 3.14 gets the
# current release. To test the oldest supported line (2026.2.x):
#   PYTHON_IMAGE=python:3.13-slim ./run-tests.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_IMAGE="${PYTHON_IMAGE:-python:3.14-slim}"
CACHE_VOLUME="intellikeep-pip-cache"

echo "▶ Running tests..."
docker run --rm \
  -v "$SCRIPT_DIR:/app" \
  -v "$CACHE_VOLUME:/root/.cache/pip" \
  -w /app \
  "$PYTHON_IMAGE" \
  sh -c "apt-get update -qq && apt-get install -y -q --no-install-recommends build-essential && pip install -q -r requirements_test.txt && pytest ${*:--v}"

echo ""
echo "✔ Tests complete"
