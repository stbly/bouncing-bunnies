const gulp = require('gulp');
const runSequence = require('run-sequence');
const stylefmt = require('stylefmt');
const postcss = require('postcss');
const scss = require('postcss-scss'); // when you use scss syntax
const through = require('through2');

const scssFmt = options => {
  const stream = through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-stylefmt', 'Streaming not supported'));
      return;
    }

    const self = this;
    postcss([stylefmt(options)])
      .process(file.contents.toString(), { syntax: scss })
      .then(function(result) {
        file.contents = new Buffer(result.css);
        self.push(file);
        cb();
      })
      .catch(function(err) {
        this.emit(
          'error',
          new gutil.PluginError('gulp-cssfmt', err, { fileName: file.path })
        );
      });
  });

  return stream;
};

gulp.task('doCssFmtGlobals', function() {
  return gulp
    .src('./source/sass/**/*.scss')
    .pipe(scssFmt())
    .pipe(gulp.dest('./source/sass/'));
});

gulp.task('doCssFmtPartials', function() {
  return gulp
    .src('./partials/**/*.scss')
    .pipe(scssFmt())
    .pipe(gulp.dest('./partials/'));
});

/*************
    export
*************/
gulp.task('css-fmt', function(callback) {
  runSequence('doCssFmtGlobals', 'doCssFmtPartials', callback);
});
