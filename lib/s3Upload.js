var fs = require('fs');
var path = require('path');
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

module.exports = function s3Upload(s3, uploadParams, cb) {
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

        if (uploadParams.simulate) {
          var mockResponse = {
            ETag: [params.Bucket, params.Key, 'ETAG'].join('-'),
            Location: path.join('s3.location.mock', params.Bucket, params.Key),
            Bucket: params.Bucket,
            Key: params.Key,
            ContentType: params.ContentType,
            Simulation: true,
            Params: params
          };

          if (params.ServerSideEncryption) {
            mockResponse.ServerSideEncryption = params.ServerSideEncryption;
          }

          return resolve(mockResponse);
        }

        s3.upload(params, function(err, data) {
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
