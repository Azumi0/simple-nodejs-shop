const gulp = require('gulp');
const sass = require('gulp-sass');
const compiler = require('node-sass');
const config = require('../buildConfig');

sass.compiler = compiler;

module.exports.sass = () => gulp.src(`${config.frontendSource}style/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(`${config.frontendDestination}css`));

module.exports.sassWatch = () => gulp.watch(`${config.frontendSource}style/**/*.scss`, ['sass']);

