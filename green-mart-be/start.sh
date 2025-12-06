#!/bin/bash

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force

# Start nginx
service nginx start

# Start PHP-FPM (keeps container running)
php-fpm
