const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const compiler = require('node-sass');
const config = require('../buildConfig');

gulpSass.compiler = compiler;

module.exports.sass = function sass() {
    return gulp
        .src(`${config.frontendSource}style/**/*.scss`)
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(gulp.dest(`${config.frontendDestination}css`));
};

module.exports.sassWatch = function sassWatch() {
    return gulp.watch(`${config.frontendSource}style/**/*.scss`, module.exports.sass);
};
