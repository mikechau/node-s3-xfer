var path = require('path');
var AWS = require('aws-sdk-mock');
var AWS_SDK = require('aws-sdk');
var s3Upload = require('../../lib/s3Upload');

describe('s3Upload', () => {
  afterEach(() => {
    AWS.restore();
  });

  it('uploads index.html with the text/html content type', (done) => {
    AWS.mock('S3', 'upload', function(params, callback) {
      callback(null, {
        ETag: [params.Bucket, params.Key, 'ETAG'].join('-'),
        Location: path.join('s3.location.mock', params.Bucket, params.Key),
        Bucket: params.Bucket,
        Key: params.Key,
        ServerSideEncryption: params.ServerSideEncryption,
        ContentType: params.ContentType
      });
    });

    var sampleIndexPath = path.join(__dirname, '../sample/build/index.html');
    var s3 = new AWS_SDK.S3({
      region: 'us-west-2',
      accessKeyId: 'a',
      secretAccessKey: 'b'
    });

    var uploadParams = {
      s3: {
        Bucket: 'test',
        Key: 'pass',
        ServerSideEncryption: 'AES256'
      },
      filePath: sampleIndexPath
    };

    s3Upload(s3, uploadParams).then(function(data) {
      expect(data).toMatchObject({
        Bucket: 'test',
        Key: 'pass',
        ContentType: 'text/html',
        ServerSideEncryption: 'AES256'
      });

      done();
    }).catch(function(err) {
      done.fail(err);
    });
  });

  it('fails when file does not exist', (done) => {
    var sampleIndexPath = path.join(__dirname, '../404/index.html');

    var uploadParams = {
      s3: {
        Bucket: 'test',
        Key: 'pass',
        ServerSideEncryption: 'AES256'
      },
      filePath: sampleIndexPath
    };

    s3Upload({}, uploadParams).then(function() {
      done.fail('Expected a path that does not exist.');
    }).catch(function(err) {
      try {
        expect(err.message).toContain('ENOENT: no such file or directory,');
        done();
      } catch(e) {
        done.fail(e);
      }
    });
  });
});
