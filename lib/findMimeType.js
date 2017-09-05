var mime = require('mime-types');

DEFAULT_CONTENT_TYPE = 'application/octet-stream';

module.exports = function findMimeType(path, fallbackOption) {
  fallbackType = fallbackOption === undefined ? DEFAULT_CONTENT_TYPE : fallbackOption;

  return (mime.lookup(path) || fallbackType);
};
