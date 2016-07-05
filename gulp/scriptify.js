import * as cons from './constants';
import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import gulp from 'gulp';
import source from 'vinyl-source-stream';
import watchify from 'watchify';


const scripts = watchify(browserify(Object.assign({}, watchify.args, {
  entries: [`${cons.src}/scripts/main.js`],
  debug: true
})));

// add transformations here
// i.e. b.transform(coffeeify);
scripts.transform(babelify, {presets: ["es2015", "react"]});

gulp.task('scriptify', scriptify); // so you can run `gulp js` to build the file
scripts.on('update', scriptify); // on any dep update, runs the bundler
scripts.on('log', cons.$.util.log); // output build logs to terminal

function scriptify() {
  return scripts.bundle()
    // log errors if they happen
    .on('error', cons.$.util.log.bind(cons.$.util, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(cons.$.sourcemaps.init({loadMaps: true})) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    .pipe(cons.$.concat('scripts.js'))
    .pipe(gulp.dest(`${cons.tmp}/scripts`))
    .pipe(cons.$.rename(function (path) {
      path.basename += ".min";
      path.extname = ".js"
    }))
    .pipe(cons.$.uglify({preserveComments: 'some'}))
    .pipe(cons.$.sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest(`${cons.tmp}/scripts`))
    .pipe(cons.reload({stream: true}));
}
