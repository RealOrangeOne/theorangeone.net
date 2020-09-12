#!/usr/bin/env bash

set -e

source ./scripts/common.sh

./scripts/build.sh

hugo server --noHTTPCache --disableFastRender --gc
