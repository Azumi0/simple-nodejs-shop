const {src, dest} = require('gulp');
const config = require('../buildConfig');

module.exports = function copyImages() {
	return src([
		'**/*.{png,jpg,gif,svg,ico}',
		'!**/sprites*',
		'!**/sprites*/*',
		'!**/icons*',
		'!**/icons*/*',
	], {
		cwd: `${config.frontendSource}images`,
	})
		.pipe(dest(`${config.frontendDestination}images`));
};
