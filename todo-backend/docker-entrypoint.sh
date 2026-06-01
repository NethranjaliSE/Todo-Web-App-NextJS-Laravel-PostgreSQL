#!/usr/bin/env bash
set -euo pipefail

# Default to Apache port 80 if PORT is not provided by Render
PORT=${PORT:-80}

# Update Apache to listen on Render's dynamic port, if supplied
if [ "$PORT" != "80" ]; then
  sed -ri "s/Listen [0-9]+/Listen ${PORT}/" /etc/apache2/ports.conf
  sed -ri "s/<VirtualHost \*:([0-9]+)>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf
fi

# Ensure application directories are writable
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Install Composer dependencies if vendor directory is missing or outdated
if [ ! -d vendor ] || [ ! -f vendor/autoload.php ]; then
  composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist
fi

# Run migrations on startup
php artisan migrate --force

# Start Apache in the foreground
exec "$@"
