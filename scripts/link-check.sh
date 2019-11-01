#!/usr/bin/env bash

set -e

source ./scripts/common.sh

blcl -fr public \
  --exclude open.spotify.com \
  --exclude scdn.co \
  --exclude staticflickr.com
