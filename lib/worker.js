'use strict';

var AWS = require('aws-sdk');
var s3Upload = require('./s3Upload');

var $s3Client;

module.exports = function worker(uploadParams, callback) {
  if (!uploadParams) {
    throw new Error('uploadParams is not defined!');
  }

  if (!$s3Client && uploadParams.s3ClientPath) {
    $s3Client = require(uploadParams.s3ClientPath);
  }

  if (!$s3Client && !uploadParams.s3ClientPath) {
    $s3Client = new AWS.S3(uploadParams.aws);
  }

  s3Upload($s3Client, uploadParams)
    .then(function(data) {
      callback(null, data);
    })
    .catch(function(err) {
      callback(err, null);
    });
};
