const gulp = require('gulp');
const livereload = require('gulp-livereload');

const PATH = require('../path');

gulp.task('_setWatch', ['build'], () => {
  global.isWatching = true;
});

/**
 * Export gulp tasks.
 */
gulp.task('serve', ['_setWatch'], () => {
  livereload.listen();
  gulp.watch(PATH.JS.SRC, ['_webpack']);
});
