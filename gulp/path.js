const path = require('path');
const ABSOLUTE_BASE = path.normalize(path.join(process.cwd()));
const SOURCE = path.join(ABSOLUTE_BASE, 'source');
const TMP = path.join(ABSOLUTE_BASE, 'tmp');
const PATH = {
  ABSOLUTE_BASE,
  TMP,
  SOURCE,
  NODE_MODULES_DIR: path.join(ABSOLUTE_BASE, 'node_modules'),
  IMAGES: {
    SRC: './images/**',
    DEST: './build/images',
  },
  JS: {
    SRC_DIR: path.join(SOURCE, 'js'),
    SRC: './source/js/**',
  },
  STYLE: {
    SRC_DIR: path.join(SOURCE, 'sass'),
    SRC: './css/app.scss',
    WATCH: './source/sass/**',
  },
  BUILD: 'dist/js',
  OUT: 'build.js',
  SRC: '.',
  ENTRY_POINT: './source/js/main.js',
  CSS_OUT_DIR: './dist/css/',
};

module.exports = PATH;
