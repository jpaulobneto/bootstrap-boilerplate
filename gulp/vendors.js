import * as cons from './constants';
import gulp from 'gulp';

gulp.task('vendors', () => {
  return gulp.src([
    `${cons.vendor}/jquery/dist/jquery.js`,
    `${cons.vendor}/bootstrap-sass/assets/javascripts/bootstrap.js`,
    `${cons.vendor}/jquery-mask-plugin/dist/jquery.mask.js`,
    `${cons.vendor}/retina.js/dist/retina.js`,
    `${cons.vendor}/magnific-popup/dist/jquery.magnific-popup.js`,
    `${cons.vendor}/Swiper/dist/js/swiper.jquery.js`
  ])
  .pipe(cons.$.newer(`${cons.tmp}/scripts`))
  .pipe(cons.$.sourcemaps.init())
  .pipe(cons.$.sourcemaps.write())
  .pipe(cons.$.concat('vendors.min.js'))
  .pipe(cons.$.uglify({preserveComments: 'some'}))
  .pipe(gulp.dest(`${cons.tmp}/scripts`))
  .pipe(cons.$.size({title: '[vendors]'}));
});
