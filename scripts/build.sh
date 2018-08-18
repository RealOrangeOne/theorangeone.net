#!/usr/bin/env bash

set -e

source ./scripts/common.sh

rm -rf $OUTPUT_DIR
rm -rf $STATIC_BUILD
rm -rf $BASEDIR/resources
mkdir -p $STATIC_BUILD/js $STATIC_BUILD/scss
hugo gen chromastyles --style=tango > $STATIC_BUILD/scss/highlight.scss
cp -r $BASEDIR/node_modules/lightgallery/dist/fonts $STATIC_BUILD
cp -r $STATIC_SRC/img $STATIC_BUILD/img
cp -r $BASEDIR/node_modules/lightgallery/dist/img/* $STATIC_BUILD/img

cp $BASEDIR/node_modules/jquery/dist/jquery.min.js $STATIC_BUILD/js/jquery.min.js
cp $BASEDIR/node_modules/lightgallery/dist/js/lightgallery.js $STATIC_BUILD/js/lightgallery.js
cp $BASEDIR/node_modules/lg-thumbnail/dist/lg-thumbnail.min.js $STATIC_BUILD/js/lg-thumbnail.min.js
cp $BASEDIR/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js $STATIC_BUILD/js/bootstrap.min.js
cp $BASEDIR/node_modules/mermaid/dist/mermaid.min.js $STATIC_BUILD/js/mermaid.min.js

parcel build $STATIC_SRC/js/index.js -d $STATIC_BUILD/js/ -o app.js
cp -r $STATIC_SRC/scss/* $STATIC_BUILD/scss/

hugo -vDEF --stepAnalysis --gc $HUGO_ARGS

mkdir -p $OUTPUT_DIR/.well-known/
cp $BASEDIR/static/keybase.txt $OUTPUT_DIR/keybase.txt
cp $BASEDIR/static/security.txt $OUTPUT_DIR/.well-known/security.txt
