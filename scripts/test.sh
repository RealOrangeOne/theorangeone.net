#!/usr/bin/env bash

set -e

source ./scripts/common.sh

sass-lint -vqc .sass-lint.yml
eslint $STATIC_SRC/js
yamllint data/*.yml
yamllint config.yml
mdspell --en-gb -ranx 'content/**/*.md'

blcl -ero './public/'
