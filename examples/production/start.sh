#!/bin/bash

set -e

./runtime-env gen-js --output-file dist/runtime-env.js

nginx -g "daemon off;"
