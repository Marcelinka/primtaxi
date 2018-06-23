var gulp = require('gulp');
var merge = require('merge-stream'); // To use two or more sources in one gulp task
var source = require('vinyl-source-stream'); //
var buffer = require('vinyl-buffer'); //
var postcss = require('gulp-postcss');
//POSTCSS PLUGINS
var unprefix = require('postcss-unprefix');
var cssnext = require('postcss-cssnext');
var sourcemaps = require('gulp-sourcemaps');
var mergerules = require('postcss-merge-rules');
var mergelonghands = require('postcss-merge-longhand');
var discardcomments = require('postcss-discard-comments');
var colormin = require('postcss-colormin');
var postcssimport = require('postcss-import');
var cssvariables = require('postcss-css-variables');
var lost = require('lost');
//ANOTHER OLUGINS
//css
var csso = require('gulp-csso');
//html
var htmlmin = require('gulp-htmlmin');
//js
var browserify = require('browserify');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
//img
var svgmin = require('gulp-svgmin');
//watch
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');

// CSS task

var plugins = [
    postcssimport(), // Concat all .css files into one file
    cssvariables(),
    lost(), // Transform lostgrid syntax
    unprefix(), // Add unprefixed properties in order to add or remove (if necessary) vendor prefixes with autoprefixer plugin
    cssnext({
        browsers: ['last 3 versions'], // Automatically add vendor prefixes
        warnForDuplicates: false
    }),
    mergerules(), // Unite same rules for different selectors
    mergelonghands(), // Minify longhand declarations of margins, paddings, etc.
    discardcomments(), // Delete comments
    colormin(), // Minify colors
]

gulp.task('css', function() {
    return (
        gulp.src('./src/css/style.css')
        .pipe(sourcemaps.init())
        .pipe(postcss(plugins))
        .pipe(csso({restructure:false, sourceMap:true, debug:true})) // Optimize and minify .css file
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./assets/css/'))
    )
})

// SVG task
gulp.task('svg', function() {
  return (
    gulp.src('./src/svg/*.svg')
    .pipe(svgmin({
      js2svg: {
        pretty: true // Beautify svg to better readibility
      },
      plugins: [{
        removeDoctype: true
      }, {
        removeComments: true
      }]
    }))
    .pipe(gulp.dest('./img/svg/'))
  )
})


//JS task
gulp.task('js', function () {
  return browserify('src/js/entry.js')
    .transform('babelify', {
      presets: ['env'],
      plugins: ["transform-async-to-generator", 'transform-runtime']
    }) // Transform moduls with babelify
    .bundle() // Bundle modules
    .pipe(source('bundle.js'))
    .pipe(buffer()) // Prepare stream to uglifying
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify()) // Minify js files
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./assets/js/'))
});


// LINTCSS task
gulp.task('lintcss', function () {
  var gulpStylelint = require('gulp-stylelint');
  var formatter = require('stylelint-formatter-yhw');
  var config = require('./stylelint.config.js'); // Adopted from stylelint-config-suitcss
  return gulp
    .src('src/css/*.css')
    .pipe(gulpStylelint({
      failAfterError: true,
      reportOutputDir: 'reports/',
      config: config,
      reporters: [
        {formatter: 'verbose', console: true},
        {formatter: formatter, save: 'csslint-report.txt'}
      ],
      debug: true
    }));
});

//BUILD task
gulp.task('b', ['css','js']);

//LINT task
gulp.task('l', ['lintcss']);

//IMG task
gulp.task('i', ['svg']);

//WATCH task
gulp.task('w', function() {
  gulp.watch(['./src/css/**/*.css'], ['css']);
  gulp.watch(['./src/svg/**/*.svg'], ['svg']);
  gulp.watch(['./src/js/**/*.js'], ['js']);
})
