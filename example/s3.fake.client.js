'use strict';

var path = require('path');

module.exports = {
  upload: function upload(params, cb) {
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

    cb(null, mockResponse);
  }
};
