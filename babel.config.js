const babel = require('@babel/core');

module.exports = (api) => {
    api.cache(true);

    const presets = [
        babel.createConfigItem([
            require('@babel/preset-env'),
            {
                modules: false,
                useBuiltIns: 'usage',
                corejs: 3,
            },
        ]),
        babel.createConfigItem([require('@babel/preset-react')]),
        babel.createConfigItem([require('@babel/preset-typescript')]),
    ];

    const plugins = [
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-optional-chaining',
    ];

    return {
        presets,
        plugins,
    };
};
