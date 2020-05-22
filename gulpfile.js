let gulp = require('gulp');
let rename = require('gulp-rename');
let sass = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let sourcemaps = require('gulp-sourcemaps');
let browserSync = require('browser-sync').create();

function css_style(done) {
    gulp.src('./scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errorLogToConsole: true,
            outputStyle: 'compressed'
        }))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./css/'))
        .pipe(browserSync.stream());

    done();
}

function sync() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 3000
    })
}

function browserReload(done) {
    browserSync.reload();
    done();
}



function wathFiles() {
    gulp.watch("./scss/**/*", css_style);
    gulp.watch('./**/*.html', browserReload);
    gulp.watch('./js/*.js', browserReload);
    gulp.watch('./**/*.php', browserReload);

}
gulp.task('default', gulp.parallel(sync, wathFiles));


// gulp.task(css_style);

// exports.default = defaultSomeTask;