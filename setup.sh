#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$ROOT_DIR/bandersnatch_app"

echo "Bandersnatch setup"
echo "Installing app dependencies..."
npm --prefix "$APP_DIR" install

if [ ! -f "$APP_DIR/.env.local" ]; then
  echo "No bandersnatch_app/.env.local found."
  echo "Copy bandersnatch_app/.env.example to bandersnatch_app/.env.local and fill Firebase values before running the app."
else
  echo "Environment file found."
fi

echo "Running production build verification..."
npm --prefix "$APP_DIR" run build

echo "Setup complete. Run: npm --prefix bandersnatch_app run dev"
