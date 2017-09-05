var path = require('path');
var child_process = require('child_process');
var exec = child_process.exec;

var SAMPLE_BUILD_PATH = path.join(__dirname, 'sample', 'build');
var MOCK_LOCATION_PATH = 's3.location.mock/test';

function buildExpectedOutput(tag, filePaths) {
  return filePaths.map(function(fp) {
    return [
      tag,
      path.join(SAMPLE_BUILD_PATH, fp),
      'to',
      path.join(MOCK_LOCATION_PATH, fp)
    ].join(' ');
  });
}

describe('node-s3-xfer', () => {
  it('uploads files to S3', done => {
    var cmd = 'node ./example/deploy.js';
    exec(cmd, function(err, stdout, stderr) {
      if (err) {
        done.fail(err);
      }

      try {
        var basePath = path.join(__dirname, 'sample', 'build');
        var results = stdout.split('\n');

        var baseExpectedOutput = [''];

        var generalAssets = buildExpectedOutput('[General Assets]', [
          'static/fonts/fonts.ttf',
          'static/js/js.js',
          'static/images/img.jpeg',
          'static/images/img.gif',
          'static/media/video.mp4',
          'static/fonts/font.woff2',
          'static/media/song.mp3'
        ]);

        var fixedAssets = buildExpectedOutput('[Fixed Assets]', [
          'asset-manifest.json',
          'manifest.json',
          'favicon.ico',
          'service-worker.js'
        ]);

        var htmlAssets = buildExpectedOutput('[HTML]', [
          'subdir/index.html',
          'index.html'
        ]);

        var expectedOutput =
          baseExpectedOutput + generalAssets + fixedAssets + htmlAssets;

        expect(results.sort()).toEqual(expectedOutput.sort());
        done();
      } catch (err) {
        done.fail(err);
      }
    });
  });
});
