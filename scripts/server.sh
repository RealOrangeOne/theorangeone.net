#!/usr/bin/env bash

set -e

bash ./scripts/build.sh

hugo server --noHTTPCache --disableFastRender --gc
