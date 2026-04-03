#!/bin/sh

set -e

./runtime-env gen-js --output-file dist/runtime-env.js

exec nginx -g "daemon off;"
