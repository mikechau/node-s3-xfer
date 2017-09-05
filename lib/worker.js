'use strict';

var AWS = require('aws-sdk');
var s3Upload = require('./s3Upload');

var $s3Client;

module.exports = function worker(s3ClientPath, uploadParams, callback) {
  if (!$s3Client) {
    $s3Client = require(s3ClientPath);
  }

  s3Upload($s3Client, uploadParams)
    .then(function(data) {
      callback(null, data);
    })
    .catch(function(err) {
      callback(err, null);
    });
};
