#!/bin/sh

set -e

./runtime-env gen-js --output-file dist/runtime-env.js
./patch-runtime-env-revision dist

exec nginx -g "daemon off;"
