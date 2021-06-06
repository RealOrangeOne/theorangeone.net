#!/usr/bin/env sh

set -e

source ./scripts/common.sh

set -x

sass-lint -vqc .sass-lint.yml
eslint $STATIC_SRC/js
yamllint data/*.yml
yamllint config.yml
