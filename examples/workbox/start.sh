#!/bin/bash

set -e

./runtime-env gen-js --output-file-path dist/runtime-env.js
./patch-runtime-env-revision dist

nginx -g "daemon off;"
