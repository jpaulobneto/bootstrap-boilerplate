import * as cons from './constants';
import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import gulp from 'gulp';
import source from 'vinyl-source-stream';

gulp.task('scripts', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: [`${cons.src}/scripts/main.js`],
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [babelify]
  });

  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(cons.$.sourcemaps.init({loadMaps: true}))
    .pipe(cons.$.concat('scripts.js'))
    .pipe(gulp.dest(`${cons.dist}/scripts`))
    .pipe(cons.$.rename(function (path) {
      path.basename += ".min";
      path.extname = ".js"
    }))
    .pipe(cons.$.uglify({preserveComments: 'some'})).on('error', cons.$.util.log)
    .pipe(cons.$.sourcemaps.write('./'))
    .pipe(gulp.dest(`${cons.dist}/scripts`))
    .pipe(cons.$.size({title: '[scripts]'}));
});
