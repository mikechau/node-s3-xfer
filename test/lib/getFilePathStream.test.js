var path = require('path');
var getFilePathStream = require('../../lib/getFilePathStream');
var config = require('../sample/s3.xfer.config');

describe('getFilePathStream', () => {
  it('returns all file paths except *.html', (done) => {
    var stream = getFilePathStream(path.join(config[0].path, config[0].matcher), config[0].glob);
    var testComplete = jest.fn();
    var results = [];

    stream.on('data', function(data) {
      results.push(path.relative(data.base, data.path));
      testComplete();
    });

    stream.on('end', function() {
      try {
        expect(results.sort()).toEqual([
          'main.js',
          'static/fonts/font.ttf',
          'static/fonts/font.woff2',
          'static/images/img.gif',
          'static/images/img.jpeg',
          'static/js/js.js',
          'static/media/song.mp3',
          'static/media/video.mp4'
        ].sort());
        expect(testComplete).toHaveBeenCalledTimes(8);
        done();
      } catch(e) {
        done.fail(e);
      }
    });
  });

  it('returns all file paths for fixed assets', (done) => {
    var stream = getFilePathStream(path.join(config[1].path, config[1].matcher), config[1].glob);
    var testComplete = jest.fn();
    var results = [];

    stream.on('data', function(data) {
      results.push(path.relative(data.base, data.path));
      testComplete();
    });

    stream.on('end', function() {
      try {
        expect(results.sort()).toEqual([
          'asset-manifest.json',
          'favicon.ico',
          'manifest.json',
          'service-worker.js'
        ].sort());
        expect(testComplete).toHaveBeenCalledTimes(4);
        done();
      } catch(e) {
        done.fail(e);
      }
    });
  });

  it('returns all file paths for *.html', (done) => {
    var stream = getFilePathStream(path.join(config[2].path, config[2].matcher), config[2].glob);
    var testComplete = jest.fn();
    var results = [];

    stream.on('data', function(data) {
      results.push(path.relative(data.base, data.path));
      testComplete();
    });

    stream.on('end', function() {
      try {
        expect(results.sort()).toEqual([
          'index.html',
          'subdir/index.html'
        ].sort());
        expect(testComplete).toHaveBeenCalledTimes(2);
        done();
      } catch(e) {
        done.fail(e);
      }
    });
  });

  it('returns nothing for empty base dir', (done) => {
    var sampleDir = path.join(__dirname, '../404');
    var stream = getFilePathStream(sampleDir);
    var testComplete = jest.fn();
    var results = [];

    stream.on('data', function(data) {
      results.push(path.relative(data.base, data.path));
      testComplete();
    });

    stream.on('end', function() {
      try {
        expect(results.sort()).toEqual([].sort());
        expect(testComplete).toHaveBeenCalledTimes(0);
        done();
      } catch(e) {
        done.fail(e);
      }
    });
  });
});
