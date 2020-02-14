const webpackCompiler = require('webpack');
const webpackSettings = require('../webpack.config');

module.exports = function webpack(callback) {
    let isReady = false;

    if (process.env.NODE_ENV === 'prod') {
        webpackSettings.mode = 'production';
    }

    if (process.env.EABLE_WP_WATCH === 'true') {
        webpackSettings.watch = true;
    }

    return webpackCompiler(webpackSettings, function(error, stats) {
        const jsonStats = stats.toJson();
        const errors = jsonStats.errors;
        const warnings = jsonStats.warnings;

        if (error) {
            console.error(error);
        } else if (errors.length > 0) {
            console.error(errors.toString());
        } else if (warnings.length > 0) {
            console.warn(warnings.toString());
        } else {
            console.log('[webpack] ' + stats.toString());
        }

        if (!isReady) {
            callback();
        }

        return (isReady = true);
    });
};
