const { series, parallel } = require('gulp');

const clean = require('./tasks/clean');
const { sass, sassWatch } = require('./tasks/sass');
const webpack = require('./tasks/webpack');

const build = done => {
    return (clean, parallel(sass, webpack))(done);
};

const dev = done => {
    process.env.EABLE_WP_WATCH = 'true';
    return series(build, sassWatch)(done);
};

module.exports = {
    clean,
    sass,
    sassWatch,
    webpack,
    dev,
    default: dev,
    build,
};
