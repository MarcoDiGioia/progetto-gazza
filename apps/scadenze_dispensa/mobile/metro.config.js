const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const sharedRoot = path.resolve(projectRoot, '../shared');

const config = {
  watchFolders: [projectRoot, sharedRoot],
  resolver: {
    nodeModulesPaths: [path.resolve(projectRoot, 'node_modules')],
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
