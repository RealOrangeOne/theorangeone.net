#!/usr/bin/env bash

set -e

source ./scripts/common.sh

sass-lint -vqc .sass-lint.yml
eslint $STATIC_SRC/js
yamllint data/*.yml
yamllint config.yml
mdspell --en-gb -ranx 'content/**/*.md'

blcl -ro ./public/ \
    --exclude "open.spotify.com"\
    --exclude "p.scdn.co"\
    --exclude "staticflickr.com"\
    --exclude "twitter.com/intent"\
    --exclude "facebook.com/sharer"\
    --exclude "reddit.com/submit" || true
