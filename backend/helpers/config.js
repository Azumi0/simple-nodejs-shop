const fs = require('fs');
const path = require('path');
const deepMerge = require('lodash.merge');
const cloneDeep = require('lodash.clonedeep');
const debug = require('debug')('myshop:config');
const appConfig = require('./../app-config.json');

try {
    fs.accessSync(path.join(__dirname, './../app-config.local.json'), fs.constants.F_OK | fs.constants.R_OK);
    const appConfigLocal = require('./../app-config.local.json');
    const configMerge = deepMerge(cloneDeep(appConfig), appConfigLocal);
    debug('Using local config');

    module.exports = configMerge;
} catch (err) {
    debug(err.message);
    debug('No local config, using global');
    module.exports = appConfig;
}
