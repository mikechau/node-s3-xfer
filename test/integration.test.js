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

describe('s3-xfer', () => {
  it('uploads files to S3', done => {
    var cmd = 'node ./example/deploy.js';
    exec(cmd, function(err, stdout, stderr) {
      if (err) {
        done.fail(err);
      }

      try {
        var basePath = path.join(__dirname, 'sample', 'build');
        var results = stdout.split('\n');

        var generalAssets = buildExpectedOutput('[General Assets]:', [
          'static/fonts/font.123.ttf',
          'static/js/js.101010.js',
          'static/images/img.z9000.jpeg',
          'static/images/img.zyx.gif',
          'static/media/video.abc101.mp4',
          'static/fonts/font.abc.woff2',
          'static/media/song.xyz1.mp3',
          'main.abc123.js'
        ]);

        var fixedAssets = buildExpectedOutput('[Fixed Assets]:', [
          'asset-manifest.json',
          'manifest.json',
          'favicon.ico',
          'service-worker.js'
        ]);

        var htmlAssets = buildExpectedOutput('[HTML]:', [
          'subdir/index.html',
          'index.html'
        ]);

        var expectedOutput = [''].concat(
          generalAssets,
          fixedAssets,
          htmlAssets
        );

        expect(results.sort()).toEqual(expectedOutput.sort());
        done();
      } catch (err) {
        done.fail(err);
      }
    });
  });
});
