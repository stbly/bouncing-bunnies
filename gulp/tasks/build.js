const runSequence = require('run-sequence');
const gulp = require('gulp');

/**
 * Export gulp tasks.
 */
gulp.task('build', function(callback) {
  runSequence('_webpack', 'eslint', callback);
});
