import * as cons from './constants';
import gulp from 'gulp';
import del from 'del';

// Clean output directory
gulp.task('clean', cb => {
  return del([
    `${cons.tmp}`,
    `${cons.dist}`,
    `!${cons.dist}/.git`
  ], {dot: true, force: true});
});
