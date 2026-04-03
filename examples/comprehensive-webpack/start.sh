#!/bin/sh

set -e

./runtime-env gen-js --output-file dist/runtime-env.js
./runtime-env interpolate --input-file dist/index.html --output-file dist/index.html

exec nginx -g "daemon off;"
