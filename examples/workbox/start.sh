#!/bin/bash

set -e

./runtime-env gen-js --mode production
./patch-runtime-env-revision dist

nginx -g "daemon off;"
