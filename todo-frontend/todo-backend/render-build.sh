#!/usr/bin/env bash
set -euo pipefail

echo "Starting Render build..."

# Ensure composer is available
if ! command -v composer >/dev/null 2>&1; then
  echo "composer not found. Exiting." >&2
  exit 1
fi

echo "Installing Composer dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader

echo "Clearing Laravel caches..."
php artisan cache:clear || true
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

echo "Re-caching configuration and routes..."
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

echo "Running database migrations..."
php artisan migrate --force

echo "Render build finished."
