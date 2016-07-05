import * as cons from './constants';
import gulp from 'gulp';

// Copy dist
gulp.task('copy', () => {
  return gulp.src([
    `${cons.tmp}/**/*`,
    `${cons.src}/*`
  ], {dot: true})
  .pipe(gulp.dest(`${cons.dist}`))
  .pipe(cons.$.size({title: '[copy]'}));
});
