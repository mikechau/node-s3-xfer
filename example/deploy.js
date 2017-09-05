'use strict';

var path = require('path');

var xfer = require('../index');
var configs = require('./s3.xfer.config');

xfer(path.join(__dirname, 's3.fake.client.js'), configs);
