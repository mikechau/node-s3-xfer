var AWS = require('aws-sdk');

var s3 = new AWS.S3({
  apiVersion: '2006-03-01'
});

function s3upload() {}

module.exports = {
  s3upload: s3upload
};
