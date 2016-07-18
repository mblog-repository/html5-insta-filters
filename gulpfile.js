var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var serve = require('gulp-serve');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

/* SCSS Compile */
gulp.task('sass', function () {
    return gulp.src('./src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['last 3 versions']}))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('./css'));
});

/* Compile ECMA6 -> ECMA5 */
gulp.task('babel', function() {
    return gulp.src('./src/js/app.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('./scripts'));
});

/* Launch http server */
gulp.task('serve', serve('./'));

/* Watcher */
gulp.task('watch', ['serve'], function() {
    gulp.watch('src/js/**/*.js', function(event) {  
        gulp.run('babel');
    });

    gulp.watch('src/scss/**/*.scss', function(event) {  
        gulp.run('sass');
    });
});

gulp.task('default', ['sass', 'babel']);