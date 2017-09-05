'use strict';

var glob = require('glob');
var CONFIG = require('./config');

module.exports = function getFilePaths(filePath, globOptions) {
  if (filePath === undefined) {
    filePath = CONFIG.default.path;
  }

  if (globOptions === undefined) {
    globOptions = CONFIG.default.glob;
  }

  return glob.sync(filePath, globOptions);
};
