'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import babelify from 'babelify';
import browserify from 'browserify';
import browserSync from 'browser-sync';
import buffer from 'vinyl-buffer';
import del from 'del';
import glob from 'glob';
import merge from 'merge-stream';
import runSequence from 'run-sequence';
import source from 'vinyl-source-stream';
import watchify from 'watchify';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

const dist = 'dist';
const src = 'src';
const tmp = '.tmp';

const scripts = watchify(browserify(Object.assign({}, watchify.args, {
  entries: [`${src}/scripts/main.js`],
  debug: true
})));

// add transformations here
// i.e. b.transform(coffeeify);
scripts.transform(babelify, {presets: ["es2015", "react"]});

gulp.task('scriptify', scriptify); // so you can run `gulp js` to build the file
scripts.on('update', scriptify); // on any dep update, runs the bundler
scripts.on('log', $.util.log); // output build logs to terminal

function scriptify() {
  return scripts.bundle()
    // log errors if they happen
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe($.sourcemaps.init({loadMaps: true})) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    .pipe($.concat('scripts.js'))
    .pipe(gulp.dest(`${tmp}/scripts`))
    .pipe($.rename(function (path) {
      path.basename += ".min";
      path.extname = ".js"
    }))
    .pipe($.uglify({preserveComments: 'some'}))
    .pipe($.sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest(`${tmp}/scripts`))
    .pipe(reload({stream: true}));
}

// Clean output directory
gulp.task('clean', cb => {
  return del([
    `${tmp}`,
    `${dist}`,
    `!${dist}/.git`
  ], {dot: true, force: true});
});

// Copy dist
gulp.task('copy', () => {
  return gulp.src([
    `${tmp}/**/*`,
    `${src}/*`
  ], {dot: true})
  .pipe(gulp.dest(`${dist}`))
  .pipe($.size({title: '[copy]'}));
});

// TODO Adjust build
// gulp.task('default', ['clean'], cb => {
//   return runSequence(
//     ['styles', 'vendors', 'scriptify'],
//     ['fonts', 'images', 'minifyCss'],
//     'copy',
//     cb
//   );
// });

gulp.task('fonts', () => {
  return gulp.src([
    `${src}/fonts/**/*.{eot,svg,ttf,woff,woff2}`
  ])
  .pipe(gulp.dest(`${dist}/fonts`))
  .pipe($.size({title: '[fonts]'}));
});

// Optimize images
gulp.task('images', () => {
  return gulp.src(`${src}/images/**/*`)
  .pipe($.cache($.imagemin({
    progressive: true,
    interlaced: true
  })))
  .pipe(gulp.dest(`${tmp}/images`))
  .pipe($.size({title: '[images]', showFiles: true}))
});

gulp.task('minifyCss', () => {
  return gulp.src(`${tmp}/styles/main.css`)
  .pipe($.rename(function (path) {
    path.basename += ".min";
    path.extname = ".css"
  }))
  // .pipe($.cssnano())
  .pipe(gulp.dest(`${tmp}/styles`))
  .pipe($.size({title: '[minifyCss]'}))
});

gulp.task('serve', ['styles', 'vendors', 'scriptify'], () => {

  browserSync({
    notify: false,
    open: false,
    port: 3000,
    server: {
      baseDir: [tmp, src]
    }
  });

  gulp.watch(`${src}/styles/**/*.{scss,sass}`, ['styles']);
  gulp.watch(`${src}/*.html`, reload);
  gulp.watch(`${src}/images/**/*`, reload);

});

gulp.task('serve:dist', ['default'], () => {
  browserSync({
    notify: false,
    open: true,
    port: 3001,
    server: {
      baseDir: [dist]
    }
  });
});

gulp.task('styles', () => {
  return gulp.src(`${src}/styles/main.{scss,sass}`)
  .pipe($.newer(`${tmp}/styles`))
  .pipe($.sourcemaps.init())
  .pipe($.cssGlobbing({
    extensions: ['.scss', '.sass']
  }))
  .pipe($.plumber())
  .pipe($.sass.sync({
    outputStyle: 'expanded',
    precision: 10,
    includePaths: ['.']
  }).on('error', $.sass.logError))
  .pipe($.autoprefixer({browsers: ['last 1 version']}))
  .pipe($.sourcemaps.write())
  .pipe(gulp.dest(`${tmp}/styles`))
  .pipe($.size({title: '[styles]'}))
  .pipe(reload({stream: true}));
});

gulp.task('vendors', () => {
  return gulp.src([
    `${src}/vendors/jquery/dist/jquery.js`,
    `${src}/vendors/bootstrap-sass/assets/javascripts/bootstrap.js`,
    `${src}/vendors/swiper/dist/js/swiper.jquery.js`,
  ])
  .pipe($.newer(`${tmp}/scripts`))
  .pipe($.sourcemaps.init())
  .pipe($.sourcemaps.write())
  .pipe($.concat('vendors.min.js'))
  .pipe($.uglify({preserveComments: 'some'}))
  .pipe(gulp.dest(`${tmp}/scripts`))
  .pipe($.size({title: '[vendors]'}));
});
