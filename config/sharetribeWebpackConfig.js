'use strict';

const LoadablePlugin = require('@loadable/webpack-plugin');

// PostCSS plugins:
// - postcss-import, postcss-apply are our additions
// - postcss-preset-env: we use nesting and custom-media-queries.
// - postcss-custom-properties: preserve is turned off due to load it adds to web inspector
//   in dev environment.
const postcssPlugins = [
  require('postcss-import'),
  require('postcss-apply'),
  require('postcss-flexbugs-fixes'),
  require('postcss-preset-env')({
    autoprefixer: {
      flexbox: 'no-2009',
    },
    features: {
      "custom-properties": false,
      'nesting-rules': true, // stage 0
      'custom-media-queries': true, // stage 1
    },
    stage: 3,
  }),
];

// Check that webpack.config has known structure.
const checkConfigStructure = config => {
  // First validate the structure of the config to ensure that we mutate
  // the config with the correct assumptions.
  const hasRules =
    config &&
    config.module &&
    config.module.rules &&
    config.module.rules.length === 2;
  const hasOneOf =
    hasRules &&
    config.module.rules[1].oneOf &&
    config.module.rules[1].oneOf.length === 9;
  const hasCssLoader =
    hasOneOf &&
    config.module.rules[1].oneOf[4].test &&
    config.module.rules[1].oneOf[4].test.test('file.css');
  const hasSplitChunks = config.optimization && config.optimization.splitChunks;

  const configStructureKnown = hasRules && hasOneOf && hasCssLoader && hasSplitChunks;

  if (!configStructureKnown) {
    throw new Error(
      'create-react-app config structure changed, please check webpack.config.js and update to use the changed config'
    );
  }

  return configStructureKnown;
};

const applySharetribeConfigs = (config, isEnvProduction) => {
  checkConfigStructure(config);

  return config.optimization
    ? Object.assign({}, config, {
        plugins: [new LoadablePlugin(), ...config.plugins],
      })
    : config;
};

module.exports = {
  postcssPlugins,
  applySharetribeConfigs,
};
