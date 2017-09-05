var path = require('path');
var getFilePaths = require('../../lib/getFilePaths');
var config = require('../sample/s3.xfer.config');

describe('getFilePaths', () => {
  it('returns all file paths except *.html', () => {
    var results = getFilePaths(
      path.join(config[0].path, config[0].matcher),
      config[0].glob
    );

    expect(results.sort()).toEqual(
      [
        path.join(config[0].path, 'main.abc123.js'),
        path.join(config[0].path, 'static/fonts/font.123.ttf'),
        path.join(config[0].path, 'static/fonts/font.abc.woff2'),
        path.join(config[0].path, 'static/images/img.zyx.gif'),
        path.join(config[0].path, 'static/images/img.z9000.jpeg'),
        path.join(config[0].path, 'static/js/js.101010.js'),
        path.join(config[0].path, 'static/media/song.xyz1.mp3'),
        path.join(config[0].path, 'static/media/video.abc101.mp4')
      ].sort()
    );
  });

  it('returns all file paths for fixed assets', () => {
    var results = getFilePaths(
      path.join(config[1].path, config[1].matcher),
      config[1].glob
    );

    expect(results.sort()).toEqual(
      [
        path.join(config[0].path, 'asset-manifest.json'),
        path.join(config[0].path, 'favicon.ico'),
        path.join(config[0].path, 'manifest.json'),
        path.join(config[0].path, 'service-worker.js')
      ].sort()
    );
  });

  it('returns file paths for *.html', () => {
    var results = getFilePaths(
      path.join(config[2].path, config[2].matcher),
      config[2].glob
    );

    expect(results.sort()).toEqual(
      [
        path.join(config[0].path, 'index.html'),
        path.join(config[0].path, 'subdir/index.html')
      ].sort()
    );
  });

  it('returns an empty array for no matches', () => {
    var sampleDir = path.join(__dirname, '../404');
    var results = getFilePaths(sampleDir);

    expect(results.sort()).toEqual([].sort());
  });
});
