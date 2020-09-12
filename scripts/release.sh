#!/usr/bin/env bash

set -e

source ./scripts/common.sh

./scripts/build.sh --minify

gzipper compress -e gz --verbose $OUTPUT_DIR $OUTPUT_DIR
