#!/usr/bin/env bash

set -e

source ./scripts/common.sh

export HUGO_ARGS="--minify"

./scripts/build.sh
