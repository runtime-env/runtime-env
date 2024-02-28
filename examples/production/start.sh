#!/bin/bash

set -e

./runtime-env gen-js --output-file-path dist/runtime-env.js

nginx -g "daemon off;"
