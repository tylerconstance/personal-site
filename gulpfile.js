const autoprefixer = require('gulp-autoprefixer');
const gulp = require('gulp');
const browserSync = require('browser-sync');
const maps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const del = require('del');

const build = './build'; // can't refer to it before it's defined

const config = {
  browsers: ['> 3%'],

  sass: './scss/**/*.scss',
  html: './html/**/*.html',
  img: './img/**/*',

  build: build,
  css: build,
  js: build,
  // HTML output goes in the build directory. If not using a single build
  // directory, it might not be built at all.
  // Images go in the build directory. If not using a single build directory,
  // they might not be built at all.
};

gulp.task('serve', ['all'], function() {
  browserSync.init({
    server: './build'
  });

  gulp.watch('scss/**/*.scss');
  gulp.watch('html/*.html').on('change', browserSync.reload);
});

gulp.task('sass', function() {
  return gulp.src(config.sass)
    .pipe(plumber())
    .pipe(sass({
      style: 'expanded',
      precision: 6,
      sourcemap: true,
    }).on('error', sass.logError))
    .pipe(maps.init())
    .pipe(autoprefixer({
      browsers: config.browsers,
      cascade: false,
    }))
    .pipe(maps.write('./')) // puts them in the directory with the CSS
    .pipe(gulp.dest(config.css))
    .pipe(browserSync.stream());
});

gulp.task('html', function() {
  return gulp.src(config.html)
    .pipe(gulp.dest(config.build));
});

gulp.task('img', function() {
  return gulp.src(config.img)
    .pipe(gulp.dest(config.build));
});

gulp.task('clean', function() {
  del(['build']);
});

gulp.task('all', ['sass', 'html', 'img']);

gulp.task('watch', ['serve'], function() {
  gulp.watch(config.sass, ['sass']);
  gulp.watch(config.html, ['html']);
  gulp.watch(config.img, ['img']);
});

gulp.task('default', ['clean'], function() {
  gulp.start('watch');
});
