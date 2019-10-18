const runSequence = require('run-sequence');
const gulp = require('gulp');

gulp.task('_setProduction', () => {
  global.isProduction = true;
});

gulp.task('_pre-production', ['_setProduction'], () => {
  gulp.start('_webpack-production');
});

gulp.task('build-production', function(callback) {
  runSequence('_pre-production', 'eslint', callback);
});
