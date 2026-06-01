#!/usr/bin/env bash
set -euo pipefail

# Use Render's dynamic PORT if provided
if [ -n "${PORT:-}" ] && [ "$PORT" != "80" ]; then
  sed -ri "s/^Listen [0-9]+/Listen ${PORT}/" /etc/apache2/ports.conf
  sed -ri "s#<VirtualHost \*:80>#<VirtualHost *:${PORT}>#" /etc/apache2/sites-available/000-default.conf
fi

# Clear any build-time cached config and use runtime env vars
php artisan config:clear

# Run migrations on startup
php artisan migrate --force

exec "$@"
