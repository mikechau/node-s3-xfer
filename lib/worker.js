var s3Upload = require('./s3Upload');

module.exports = function worker(s3, uploadParams, callback) {
  s3Upload(s3, uploadParams)
    .then(function(data) {
      callback(null, data);
    })
    .catch(function(err) {
      callback(err, null);
    });
};
