var AWS = require('aws-sdk');
var s3 = new AWS.S3({
  apiVersion: '2006-03-01'
});

var xfer = require('../lib/xfer');
var configs = require('../test/sample/s3.xfer.config');

xfer(s3, configs);
