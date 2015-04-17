var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var sass = require('gulp-sass');
var Q = require('q');
var client_js_src = "src/client/js/";
var client_less_src = "src/client/less/";
var client_sass_src = "src/client/sass/";
var client_html_src = "src/client/html/";
var client_css_src = "src/client/css/";
var runSequence = require('run-sequence');
var client_js_dist = "dist/client/js/";
var client_html_dist = "dist/client/";
var client_css_dist = "dist/client/css/";
var mainBowerFiles = require( 'main-bower-files' );
var gulpFilter = require('gulp-filter');
var resolveDependencies = require('gulp-resolve-dependencies');
var clean = require('gulp-clean');
var notify = require('gulp-notify');
var dirsToBeCleaned = ['src/client/lib','build/','dist/'];
var wait = 0;
// ---------- CELAN -----------
gulp.task('clean', function () {
gulp.src(dirsToBeCleaned).pipe(clean());
});
// -------- LESS ---------
gulp.task('less', function() {
  gulp.src('src/client/less/app.less')
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
  gulp.src(['src/client/css/*.css','src/client/lib/css/*.css'])
    .pipe(concat('style.css.css'))
    .pipe(gulp.dest('build/css/'));
});





// ------------ Client Scripts -------------
gulp.task('js-lib',function() {
  gulp.src(['src/client/lib/js/*.js'])
  .pipe(gulp.dest('build/js/lib/'));
});
gulp.task('js', function () {

  
 

  
    var jsFunc = function(){
       if(wait == 0) setTimeout(jsFunc, 1000);  

  console.log("js");
  gulp.src(['src/client/js/module.js','src/client/js/*.js','src/client/js/**/*.js'])
       .pipe(resolveDependencies({
            pattern: /\* @require [\s-]*(.*?\.js)/g,
            log: true
        }))
    .pipe(sourcemaps.init())
        .pipe(ngAnnotate())
      .pipe(concat('app.js'))
  
      .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js/app/'))

  };
jsFunc();
  });


// ------- HTML -----------------
gulp.task('html', function() {
  gulp.src(['src/client/html/**/*.html','src/client/html/*.html'])
    .pipe(gulp.dest('build/html/'));
});
// --- Auto Install Bower Packages ----
var jsFilter = gulpFilter('**/*.js');
var cssFilter = gulpFilter('*.css');
var fontFilter = gulpFilter(['*.ttf','*.woff','*.woff2', '!**/*.js','!*.css']);
gulp.task( "bower-files", function () {
var str = gulp.src( mainBowerFiles() ).pipe(jsFilter).pipe( gulp.dest( "src/client/lib/js" ) );
gulp.src(mainBowerFiles()).pipe(cssFilter)
.pipe(concat('lib.css')).pipe(gulp.dest('src/client/lib/css'))
.pipe(cssFilter.restore()).pipe(fontFilter).pipe(gulp.dest("src/client/lib/fonts"));

wait = 1;
console.log("done");
return str;

} );
// ------ Concat Build and move to Dist -----
gulp.task('dist-fonts',function() {
 gulp.src('src/client/lib/fonts/*').pipe(gulp.dest('dist/client/fonts/'));
})
gulp.task('dist-css',function() {
     gulp.src(['build/css/**/*.css','build/css/*.css'] )
    .pipe(concat('style.css'))
    .pipe(gulp.dest('dist/client/css/'))
});
gulp.task('dist-js-lib', function () {
  gulp.src(['build/js/lib/*.js'])
   .pipe(resolveDependencies({
            pattern: /\* @require [\s-]*(.*?\.js)/g,
            log: true
        }))
    .pipe(sourcemaps.init())
        .pipe(ngAnnotate())
      .pipe(concat('lib.js'))
  
      .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/client/js/'))
});
gulp.task('dist-js', function () {
  gulp.src(['build/js/lib/*.js','build/js/app/*.js'])

    .pipe(gulp.dest('dist/client/js/'))
});

gulp.task('dist-html',function() {
  gulp.src('build/html/**/*.html')
    .pipe(gulp.dest('dist/client/'));
});


var client_build_dist = ['dist-css','dist-js','dist-html'];
 var client_build = ['dist-html'];
// -------------- WATCH -------------
gulp.task('watch',client_build, function() {


  gulp.watch('src/client/less/**/*.less', client_build);
  gulp.watch('src/client/js/**/*.js', client_build);
  gulp.watch('src/client/lib/**/*.js',client_build);
  gulp.watch('src/client/css/**/*.css',client_build);
  gulp.watch('src/client/sass/**/*.scss',client_build);
  gulp.watch('src/client/html/**/*.html',client_build);
  
  
});
gulp.task('build',function() {
    runSequence(
    
              'bower-files','sass','less','css','html','js-lib','js','dist-js','dist-css','dist-html');
});
gulp.task('default',['build']);