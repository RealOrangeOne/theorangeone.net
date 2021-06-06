#!/usr/bin/env sh

set -e

source ./scripts/common.sh

./scripts/build.sh

hugo server --noHTTPCache --disableFastRender --gc
