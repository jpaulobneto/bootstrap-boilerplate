'use strict';

import gulp from 'gulp';
import requireDir from 'require-dir';
import runSequence from 'run-sequence';

requireDir('./gulp');

// TODO Adjust build
gulp.task('default', ['clean'], cb => {
  return runSequence(
    ['styles', 'vendors', 'scripts'],
    ['fonts', 'images', 'icons', 'minifyCss'],
    'copy',
    cb
  );
});
