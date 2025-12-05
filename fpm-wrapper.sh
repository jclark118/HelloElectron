#!/usr/bin/env bash

# Needed to fix encoding problems with fpm
export LC_ALL=C

# Call our custom FPM binary
exec "$HOME/.gem/ruby/2.6.0/bin/fpm" "$@"