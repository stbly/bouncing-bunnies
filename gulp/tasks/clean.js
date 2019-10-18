const gulp = require('gulp');
const del = require('del');

/**
 * Export gulp tasks.
 */
gulp.task('clean', callback => {
  return del(['./bin/**/*', './dist/**/*']);
});

gulp.task('clean-images', callback => {
  return del(['./source/images/**/*.min.*']);
});
