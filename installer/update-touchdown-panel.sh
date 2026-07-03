#!/bin/bash
set -euo pipefail

#############################################################################
#  Touch Down Hosting Panel Updater                                         #
#                                                                           #
#  Pulls the latest panel code from your git repository, rebuilds the      #
#  frontend assets and applies migrations. Run as root on the panel host.  #
#############################################################################

PANEL_DIR="${PANEL_DIR:-/var/www/touchdown}"
GIT_BRANCH="${GIT_BRANCH:-main}"
PHP="${PHP:-php}"

if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root (sudo bash $0)" >&2
  exit 1
fi

if [ ! -f "${PANEL_DIR}/artisan" ]; then
  echo "No panel found at ${PANEL_DIR} (set PANEL_DIR=... to override)" >&2
  exit 1
fi

cd "$PANEL_DIR"

echo "[Touch Down] Entering maintenance mode..."
$PHP artisan down || true

echo "[Touch Down] Pulling latest code (${GIT_BRANCH})..."
git fetch origin
git checkout "$GIT_BRANCH"
git pull origin "$GIT_BRANCH"

echo "[Touch Down] Updating PHP dependencies..."
COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader --no-interaction --quiet

echo "[Touch Down] Rebuilding frontend assets..."
yarn install --frozen-lockfile --silent
yarn build:production >/dev/null

echo "[Touch Down] Clearing caches and running migrations..."
$PHP artisan view:clear
$PHP artisan config:clear
$PHP artisan migrate --seed --force

chown -R www-data:www-data "$PANEL_DIR"

echo "[Touch Down] Restarting queue worker..."
$PHP artisan queue:restart || true
systemctl restart pteroq.service || true

echo "[Touch Down] Leaving maintenance mode..."
$PHP artisan up

echo "[Touch Down] Update complete."
