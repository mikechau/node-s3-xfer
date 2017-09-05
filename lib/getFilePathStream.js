var gs = require('glob-stream');
var CONFIG = require('./config');

module.exports = function getFilePathStream(filePath, globOptions) {
  if (filePath === undefined) {
    filePath = CONFIG.default.path;
  }

  if (globOptions === undefined) {
    globOptions = CONFIG.default.glob;
  }

  return gs(filePath, globOptions);
};
