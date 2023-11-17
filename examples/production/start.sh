#!/bin/bash

set -e

./runtime-env gen-js --mode production

nginx -g "daemon off;"
