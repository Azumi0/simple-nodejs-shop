const del = require('del');
const config = require('../buildConfig');


module.exports = function clean() {
	return del(config.frontendDestination);
};
