const
  cleanCss = require('gulp-clean-css'),
  concat = require('gulp-concat'),
  connect = require('gulp-connect'),
  del = require('del'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  plumber = require('gulp-plumber'),
  postCss = require('gulp-postcss'),
  atImport = require('postcss-import'),
  refresh = require('gulp-refresh'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps')
  ;

// Launch dev server and watch html and scss files.
gulp.task('dev', ['build', 'connect', 'watch']);

gulp.task('pcss', () => {
  return gulp.src('src/css/**/*.css')
    // .pipe(plumber({errorHandler: dontCrash}))
    .pipe(postCss([
      atImport()
    ]))
    .pipe(gulp.dest('dist/css/'))
    .pipe(connect.reload())
    .pipe(refresh())
    ;
});

// Output SCSS to CSS
gulp.task('css', () => {
  return gulp.src('src/scss/**/*.scss')
    .pipe(plumber({errorHandler: dontCrash}))
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [
        'node_modules/normalize-scss/sass'
      ]
    }))
    .pipe(cleanCss())
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css/'))
    .pipe(connect.reload())
    .pipe(refresh())
    ;
});

// Copy html to dist folder
gulp.task('html', () => {
  return gulp.src('src/html/**/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload())
    .pipe(refresh())
    ;
});

// Copy images to dist folder
gulp.task('img', () => {
  return gulp.src('src/images/*.*')
    .pipe(gulp.dest('dist/images'))
    .pipe(connect.reload())
    .pipe(refresh())
    ;
});

// Compile html and css.
gulp.task('build', ['html', 'css', 'img']);

// Create a server on http://localhost:8080
gulp.task('connect', () => {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

// Watch for any changes to html/css and run them.
gulp.task('watch', () => {
  gulp.watch('src/html/**/*.html', ['html']);
  gulp.watch('src/scss/**/*.scss', ['css']);
});

// Prevent gulp watch from crashing on errors.
function dontCrash(err) {
  console.log(err.toString());
  gutil.beep();
  this.emit('end');
}
