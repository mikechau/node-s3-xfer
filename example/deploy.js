'use strict';

var path = require('path');

var xfer = require('../index');
var configs = require('./s3.xfer.config');

xfer(configs, {
  s3ClientPath: path.join(__dirname, 's3.fake.client.js')
});
