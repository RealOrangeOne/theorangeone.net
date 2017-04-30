const sass = require('node-sass');
const fs = require('fs');
const path = require('path');
const browserify = require('browserify');
const nsp = require('ncp').ncp;

const STATIC = path.join(__dirname, '..', 'static');

const SRC_DIR = path.join(STATIC, 'src');
const BUILD_DIR = path.join(STATIC, 'build');

const OUT_FILE = path.join(STATIC, 'build', 'css', 'style.css');
const IN_FILE = path.join(STATIC, 'src', 'scss', 'style.scss');


const b = browserify({
  entries: [path.join(SRC_DIR, 'js', 'index.js')],
  debug: true,
});

const SASS_OPTIONS = {
  file: path.join(SRC_DIR, 'scss', 'style.scss'),
  outFile: path.join(BUILD_DIR, 'css', 'style.css'),
  sourceMap: true,
  sourceMapEmbed: true,
  watch: true,
};

nsp(path.join('node_modules', 'font-awesome', 'fonts'), path.join(BUILD_DIR, 'fonts'), function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('Copied fonts');
});

b.bundle(function () {
  console.log('built js');
})
.on('error', console.error)
.pipe(fs.createWriteStream(path.join(BUILD_DIR, 'js', 'app.js')))


sass.render(SASS_OPTIONS, function (error, result) {
  if (error) {
    return console.error("ERROR", error);
  }
    fs.writeFileSync(path.join(BUILD_DIR, 'css', 'style.css'), result.css);
    console.log("Build CSS");
});
