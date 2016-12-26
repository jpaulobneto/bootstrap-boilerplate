import * as cons from './constants';
import gulp from 'gulp';

// Optimize icons
gulp.task('icons', () => {
  return gulp.src(`${cons.src}/icons/**/*`)
  .pipe(gulp.dest(`${cons.tmp}/icons`))
  .pipe(cons.$.size({title: '[icons]', showFiles: true}))
});
