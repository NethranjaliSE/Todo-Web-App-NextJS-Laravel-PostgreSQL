FROM php:8.4.1-apache

# 1. Install system dependencies and required PHP extensions
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libcurl4-openssl-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo pdo_pgsql zip bcmath curl xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 2. Enable Apache mod_rewrite for Laravel routing
RUN a2enmod rewrite

# 3. Change Apache Document Root to Laravel's public folder
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 4. Dynamic Apache port handling is done at container startup, not build time

# 5. Set working directory
WORKDIR /var/www/html

# 6. Install Composer & Laravel Dependencies (before copying app code)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts || composer install --no-dev --optimize-autoloader --no-interaction

# 7. Copy application code
COPY . .

# 8. Generate autoload and run post-install scripts
RUN composer dump-autoload --optimize --no-dev
RUN php artisan storage:link 2>/dev/null || true

# 9. Set required permissions for Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# 10. Copy runtime entrypoint
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["apache2-foreground"]
