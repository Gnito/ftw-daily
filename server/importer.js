/**
 * This module constructs the path to import what the client build
 * bundle exports.
 */

const path = require('path');
const { ChunkExtractor } = require('@loadable/server');

// Construct the bundle path where the bundle exports can be imported
const buildPath = path.resolve(__dirname, '..', 'build');

const nodeStats = path.join(buildPath,'node/loadable-stats.json');
const webStats = path.join(buildPath,'loadable-stats.json');

module.exports = {
  getExtractors: () => {
    const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats });
    const webExtractor = new ChunkExtractor({ statsFile: webStats });
    return { nodeExtractor, webExtractor };
  },
};
