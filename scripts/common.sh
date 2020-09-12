BASEDIR=$PWD

export $(cat $BASEDIR/.env | xargs)

NODE_BIN=$BASEDIR/node_modules/.bin

STATIC_SRC=$BASEDIR/static/src
STATIC_BUILD=$BASEDIR/static/build
OUTPUT_DIR=$BASEDIR/public

export PATH=$NODE_BIN:$BASEDIR/bin:$PATH
