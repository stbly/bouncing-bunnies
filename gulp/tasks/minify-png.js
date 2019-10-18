const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

/**
 * Export gulp tasks.
 */
gulp.task('minify-png', () => {
  return gulp
    .src('./source/images/**/*.{png,jpg}')
    .pipe(
      imagemin([pngquant(), imagemin.jpegtran({ progressive: true })], {
        verbose: true,
      })
    )
    .pipe(gulp.dest('./dist/images/'));
});
