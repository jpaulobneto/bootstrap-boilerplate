import * as cons from './constants';
import browserSync from 'browser-sync';
import gulp from 'gulp';

gulp.task('serve', ['styles', 'vendors', 'scriptify'], () => {

  browserSync({
    notify: false,
    open: false,
    port: 3000,
    server: {
      baseDir: [cons.tmp, cons.src]
    }
  });

  gulp.watch(`${cons.src}/styles/**/*.{scss,sass}`, ['styles']);
  gulp.watch(`${cons.src}/*.html`, cons.reload);
  gulp.watch(`${cons.src}/images/**/*`, cons.reload);

});

gulp.task('serve:dist', ['default'], () => {
  browserSync({
    notify: false,
    open: true,
    port: 3001,
    server: {
      baseDir: [cons.dist]
    }
  });
});
