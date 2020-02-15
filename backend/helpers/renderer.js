const path = require('path');
const { TwingEnvironment, TwingLoaderFilesystem } = require('twing');

module.exports = () => {
    const loader = new TwingLoaderFilesystem(path.join(__dirname, '../templates'));
    return new TwingEnvironment(loader);
};
