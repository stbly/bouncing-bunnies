const requireDir = require('require-dir');
const gulp = require('gulp');

// Require all tasks in gulp/tasks, including subfolders
requireDir('./tasks', { recurse: true });
gulp.task( 'default', [ 'serve' ] )
