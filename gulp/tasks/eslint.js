const gulp = require('gulp');
const eslint = require('gulp-eslint');
const PATH = require('../path');

/**
 * Export gulp tasks.
 */
gulp.task('eslint', () => {
  return gulp
    .src(PATH.JS.SRC)
    .pipe(eslint({ fix: true, parser: 'babel-eslint' }))
    .pipe(eslint.format());
});
