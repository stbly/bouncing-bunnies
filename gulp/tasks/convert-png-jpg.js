const gulp = require('gulp');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const through = require('through2');
const images = require('images');

const imagesConvert = option => {
  const { targetType, quality } = option;
  const stream = through.obj(function(file, enc, cb) {
    if (file.isBuffer()) {
      file.contents = images(file.contents)
        .size(640, 360)
        .encode(targetType, quality ? { quality: quality } : undefined);
    }
    this.push(file);
    cb();
  });

  return stream;
};

gulp.task('_convertPngToJpgTask', function() {
  return gulp
    .src('./source/images/**/country-hero-*.png')
    .pipe(imagesConvert({ targetType: 'jpg', quality: 20 }))
    .pipe(rename({ extname: '.jpg' }))
    .pipe(gulp.dest('./source/images/'));
});

/**
 * Export gulp tasks.
 */
gulp.task('convertPngToJpg', function(callback) {
  runSequence('_convertPngToJpgTask', callback);
});
