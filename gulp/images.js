import * as cons from './constants';
import gulp from 'gulp';

// Optimize images
gulp.task('images', () => {
  return gulp.src(`${cons.src}/images/**/*`)
  .pipe(cons.$.cache(cons.$.imagemin({
    progressive: true,
    interlaced: true
  })))
  .pipe(gulp.dest(`${cons.tmp}/images`))
  .pipe(cons.$.size({title: '[images]', showFiles: true}))
});
