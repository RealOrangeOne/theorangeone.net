const sass = require('node-sass');
const fs = require('fs');
const path = require('path');
const watch = require('node-watch');
const browserify = require('browserify');
const livereload = require('livereload');

const STATIC = path.join(__dirname, '..', 'static')

const OUT_FILE = path.join(STATIC, 'build', 'css', 'style.css');
const IN_FILE = path.join(STATIC, 'src', 'scss', 'style.scss');



const b = browserify({
  entries:[path.join(STATIC, 'src', 'js', 'index.js')],
  debug: true,
})
.transform({
  global: true,
  debug: true
}, 'uglifyify');

const bundle = function () {
  b.bundle(function () {
    console.log('built js');
  })
  .on('error', console.log)
  .pipe(fs.createWriteStream(path.join(STATIC, 'build', 'js', 'app.js')))
}


const buildSCSS = function () {
  sass.render({
    file: IN_FILE,
    outFile: OUT_FILE,
    sourceMap: true,
    sourceMapEmbed: true,
    watch: true,
  }, function (error, result) {
    if (!error) {
      fs.writeFileSync(OUT_FILE, result.css);
      console.log("Build CSS");
    }
  });
}

bundle();
buildSCSS();
//
// watch(path.join(STATIC, 'src', 'js'), {recursive: true}, bundle);
// watch(path.join(STATIC, 'src', 'scss'), {recursive: true}, buildSCSS);
//
//
// livereload.createServer().watch(path.join(STATIC, 'src'));
