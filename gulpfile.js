var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var sass = require('gulp-sass');
var client_js_src = "src/client/js/";
var client_less_src = "src/client/less/";
var client_sass_src = "src/client/sass/";
var client_html_src = "src/client/html/";
var client_css_src = "src/client/css/";

var client_js_dist = "dist/client/js/";
var client_html_dist = "dist/client/";
var client_css_dist = "dist/client/css/";

// -------- LESS ---------
gulp.task('less', function() {
  return gulp.src('src/client/less/app.less')
    .pipe(less({compress: true}))
    .pipe(concat('style.less.css'))
    .pipe(gulp.dest('build/css/'));
});
// --------------- SASS ----------
gulp.task('sass', function () {
    gulp.src('src/client/scss/**/*.scss')
        .pipe(sass())
        .pipe(concat('style.sass.css'))
        .pipe(gulp.dest('build/css/'));
});

// ------------ CSS ------------
gulp.task('css', function() {
  return gulp.src('src/client/css/**/*.css')
    .pipe(concat('style.css.css'))
    .pipe(uglify())
    .pipe(gulp.dest('build/css/'));
});





// ------------ Client Scripts -------------

gulp.task('js', function () {
  gulp.src(['src/client/js/**/module.js', 'src/client/js/**/*.js','src/client/lib/**/*.js'])
    .pipe(gulp.dest('build/js/'))
});

// ------- HTML -----------------
gulp.task('html', function() {
  return gulp.src('src/client/html/**/*.html')
    .pipe(gulp.dest('build/html/'));
});

// ------ Concat Build and move to Dist -----
gulp.task('dist-css',function() {
    return gulp.src('build/css/**/*.css' )
    .pipe(concat('style.css'))
    .pipe(gulp.dest('dist/client/css/'))
});
gulp.task('dist-js', function () {
  gulp.src(['build/js/**/*.js'])
    .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(ngAnnotate())
      .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/client/js/'))
});

gulp.task('dist-html', function() {
  return gulp.src('build/html/**/*.html')
    .pipe(gulp.dest('dist/client/html/'));
});

var client_build = ['less','sass','css','js','html','dist-css','dist-js','dist-html'];
var client_build_dist = ['dist-css','dist-js','dist-html'];
// -------------- WATCH -------------
gulp.task('watch', ['less', 'sass','css','js','html'], function() {
 

  gulp.watch('src/client/less/**/*.less', [client_build]);
  gulp.watch('src/client/js/**/*.js', [client_build]);
  gulp.watch('src/client/lib/**/*.js',[client_build]);
  gulp.watch('src/client/css/**/*.css',[client_build]);
  gulp.watch('src/client/sass/**/*.scss',[client_build]);
  gulp.watch('src/client/html/**/*.html',[client_build]);
  
});
gulp.task('build',['client_build']);