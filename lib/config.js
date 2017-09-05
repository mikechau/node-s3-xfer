'use strict';

var CONFIG = Object.freeze({
  default: {
    glob: {
      nodir: true,
      allowEmpty: true
    },
    path: process.cwd()
  }
});

module.exports = CONFIG;
