#!/usr/bin/env bash
set -euo pipefail

# Render build script for Laravel backend (no Docker)
# Expected: Render environment variables set (APP_ENV, APP_KEY, DB_*, etc.)
# Run from repository root or service root where artisan is located.

cd "$(dirname "$0")"

echo "Installing Composer dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

echo "Clearing and caching config, routes and views..."
php artisan config:clear || true
php artisan cache:clear || true
php artisan route:clear || true
php artisan view:clear || true
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Ensure storage and bootstrap cache directories are writable
chmod -R 775 storage bootstrap/cache || true

echo "Running database migrations (force)..."
php artisan migrate --force

echo "Build script completed." 
