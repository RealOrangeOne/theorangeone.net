#!/usr/bin/env bash

set -e

source ./scripts/common.sh

bash ./scripts/build.sh

speedpack $OUTPUT_DIR -o $OUTPUT_DIR
