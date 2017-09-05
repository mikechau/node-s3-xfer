'use strict';

var path = require('path');
var AWS = require('aws-sdk');
var s3 = new AWS.S3({
  apiVersion: '2006-03-01'
});

var xfer = require('../index');
var configs = require('../test/sample/s3.xfer.config');

xfer(path.join(__dirname, 'fake.s3.client.js'), configs);
