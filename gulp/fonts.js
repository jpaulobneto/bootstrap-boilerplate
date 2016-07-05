import * as cons from './constants';
import gulp from 'gulp';

gulp.task('fonts', () => {
  return gulp.src([
    `${cons.src}/fonts/**/*.{eot,svg,ttf,woff,woff2}`
  ])
  .pipe(gulp.dest(`${cons.dist}/fonts`))
  .pipe(cons.$.size({title: '[fonts]'}));
});
