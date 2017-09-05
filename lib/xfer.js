var path = require('path');
var workerFarm = require('worker-farm');

var getFilePaths = require('./getFilePaths');
var s3Upload = require('./s3Upload');

var workers = workerFarm(require.resolve('./worker'));

module.exports = function xfer(s3Client, xferConfigs, simulate) {
  var xferConfigsLength = xferConfigs.length;

  if (xferConfigsLength <= 0) {
    throw new Error('no xfers configs found!');
  }

  function startWork(index) {
    var config = xferConfigs[index];
    var processed = 0;
    var filePaths;

    if (index <= -1) {
      throw new Error('index cannot be negative!');
    }

    if (xferConfigsLength - (index + 1) <= -1) {
      workerFarm.end(workers);
      return null;
    }

    filePaths = getFilePaths(
      path.join(config.path, config.matcher),
      config.glob
    );

    filePaths.forEach(function(f) {
      var s3Key = path.relative(config.path, f);

      workers(
        s3Client,
        { s3: { Bucket: config.s3.bucket, Key: s3Key }, filePath: f, simulate: simulate },
        function(err, response) {
          console.log('[' + config.name + ']:', f, 'to', response.Location);

          processed++;

          if (processed === filePaths.length) {
            startWork(index + 1);
          }
        }
      );
    });
  }

  startWork(0);
};
