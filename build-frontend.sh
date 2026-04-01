#!/usr/bin/env bash
# Build IntelliKeep frontend bundles using Docker (no local Node.js required).
# Usage: ./build-frontend.sh [card|panel|all]  (default: all)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NODE_IMAGE="node:20-alpine"
TARGET="${1:-all}"

_build() {
  local name="$1"   # lovelace-card | panel
  local workdir="/work/$name"

  echo "▶ Building $name..."
  docker run --rm \
    --user "$(id -u):$(id -g)" \
    -v "$SCRIPT_DIR:/work" \
    -w "$workdir" \
    "$NODE_IMAGE" \
    sh -c "npm ci --prefer-offline && npm run build"
  echo "✔ $name built"
}

case "$TARGET" in
  card)   _build lovelace-card ;;
  panel)  _build panel ;;
  all)
    _build lovelace-card
    _build panel
    ;;
  *)
    echo "Usage: $0 [card|panel|all]"
    exit 1
    ;;
esac

echo ""
echo "Artifacts written to:"
echo "  custom_components/intellikeep/frontend/intellikeep-card.js"
echo "  custom_components/intellikeep/frontend/intellikeep-panel.js"
