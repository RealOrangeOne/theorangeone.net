#!/usr/bin/env sh

set -e

source ./scripts/common.sh

rm -rf $OUTPUT_DIR
rm -rf $STATIC_BUILD
rm -rf $BASEDIR/resources

mkdir -p $STATIC_BUILD/css $STATIC_BUILD/audio

cp -r $BASEDIR/node_modules/lightgallery/dist/fonts $STATIC_BUILD
cp -r $STATIC_SRC/img $STATIC_BUILD/img
cp -r $BASEDIR/node_modules/lightgallery/dist/img/* $STATIC_BUILD/img
cp -r $BASEDIR/node_modules/@fortawesome/fontawesome-free/css/all.min.css $STATIC_BUILD/css/font-awesome.css
cp $BASEDIR/node_modules/lightgallery/dist/css/lightgallery.min.css $STATIC_BUILD/css/lightgallery.css
cp -r $BASEDIR/node_modules/@fortawesome/fontawesome-free/webfonts $STATIC_BUILD
cp $BASEDIR/node_modules/shareon/dist/shareon.min.css $STATIC_BUILD/css/shareon.css

cp -r $STATIC_SRC/js/ $STATIC_BUILD/js/
cp $BASEDIR/node_modules/jquery/dist/jquery.min.js $STATIC_BUILD/js/jquery.min.js
cp $BASEDIR/node_modules/lightgallery/dist/js/lightgallery-all.min.js $STATIC_BUILD/js/lightgallery.min.js
cp $BASEDIR/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js $STATIC_BUILD/js/bootstrap.min.js
cp $BASEDIR/node_modules/elevator.js/demo/music/*.mp3 $STATIC_BUILD/audio/

cp -r $STATIC_SRC/scss $STATIC_BUILD/scss
hugo gen chromastyles --style=monokai > $STATIC_BUILD/css/highlight.css

hugo -vDEF --gc $@

cp $BASEDIR/static/keybase.txt $OUTPUT_DIR/keybase.txt

mkdir -p $OUTPUT_DIR/.well-known/matrix
cp $BASEDIR/static/matrix.json $OUTPUT_DIR/.well-known/matrix/server
