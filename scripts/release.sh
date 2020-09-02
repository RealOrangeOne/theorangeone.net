#!/usr/bin/env bash

set -e

source ./scripts/common.sh

# Expose environment variables so `parcel-bundler` can access them
env > $BASEDIR/.env

./scripts/build.sh --minify

gzipper compress -e gz --verbose $OUTPUT_DIR $OUTPUT_DIR

rm -f $BASEDIR/.env
