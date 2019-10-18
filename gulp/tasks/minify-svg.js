const gulp = require('gulp');
const shell = require('gulp-shell');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');

gulp.task('_svgo', () => {
  return gulp
    .src('./source/images/**/*.svg', { read: false })
    .pipe(shell(['svgo <%= file.path %> -o <%= file.path %>.min.svg']))
    .pipe(gulp.dest('./dist/images/'));
});

/**
 * Export gulp tasks.
 */
gulp.task('minify-svg', function(callback) {
  runSequence('_svgo', callback);
});
