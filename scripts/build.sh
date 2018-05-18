#!/usr/bin/env bash

set -e

source ./scripts/common.sh

rm -rf $OUTPUT_DIR
rm -rf $STATIC_BUILD
rm -rf $BASEDIR/resources
mkdir -p $STATIC_BUILD/js $STATIC_BUILD/css
hugo gen chromastyles --style=tango > $STATIC_SRC/scss/highlight.css
browserify $STATIC_SRC/js/index.js -o $STATIC_BUILD/js/app.js
node-sass $STATIC_SRC/scss/style.scss $STATIC_BUILD/css/style.css --source-map-embed

cp -r $BASEDIR/node_modules/lightgallery/dist/fonts $STATIC_BUILD
cp -r $STATIC_SRC/img $STATIC_BUILD/img
cp node_modules/mermaid/dist/mermaid.min.js $STATIC_BUILD/js/mermaid.min.js

hugo -vDEF --stepAnalysis --gc
mkdir -p $OUTPUT_DIR/.well-known/

cp $BASEDIR/static/keybase.txt $OUTPUT_DIR/keybase.txt
cp $BASEDIR/static/security.txt $OUTPUT_DIR/.well-known/security.txt
