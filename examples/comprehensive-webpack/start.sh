#!/bin/bash

set -e

./runtime-env gen-js --output-file dist/runtime-env.js
./runtime-env interpolate --input-file dist/index.html --output-file dist/index.html
./patch-runtime-env-revision dist

nginx -g "daemon off;"
