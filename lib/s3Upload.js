'use strict';

var fs = require('fs');
var isFunction = require('lodash.isfunction');
var findMimeType = require('./findMimeType');

var noop = function noop() {};

function validateParams(params) {
  if (!params.s3) {
    throw new Error('s3 params is not defined!');
  }

  if (!params.s3.Bucket) {
    throw new Error('s3 bucket is not defined!');
  }

  if (!params.s3.Key) {
    throw new Error('s3 key is not defined!');
  }

  if (!params.filePath) {
    throw new Error('file path is not defined!');
  }
}

module.exports = function s3Upload(s3Client, uploadParams, cb) {
  if (!isFunction(cb)) {
    cb = noop;
  }

  return new Promise(function(resolve, reject) {
    var contentType;
    var stream;
    var params;

    try {
      validateParams(uploadParams);
    } catch (err) {
      reject(err);
    }

    fs.stat(uploadParams.filePath, function(err, _stat) {
      if (err) {
        return reject(err);
      } else {
        contentType = findMimeType(uploadParams.filePath);
        stream = fs.createReadStream(uploadParams.filePath);
        params = Object.assign({}, uploadParams.s3, {
          ContentType: contentType
        });

        s3Client.upload(params, function(err, data) {
          if (err) {
            return reject(err);
          } else {
            return resolve(data);
          }
        });
      }
    });
  });
};
