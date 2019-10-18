const runSequence = require('run-sequence');
const gulp = require('gulp');

/**
 * Export gulp tasks.
 */
gulp.task('optimize', function(callback) {
  runSequence(
    'clean-images',
    'minify-png',
    'minify-svg',
    'convertPngToJpg',
    'css-fmt',
    callback
  );
});
