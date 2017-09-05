# s3-xfer

This is a node module for uploading assets to S3 in an ordered way.

## Features

- AWS S3 ManagedUpload
- File globbing with [glob](https://github.com/isaacs/node-glob)
- ContentType detection with [mime-types](https://github.com/jshttp/mime-types)
- Multiprocess uploading with [worker-farm](https://github.com/rvagg/node-worker-farm)

## Usecase

You have a single page application and it looks something like:

```shell
build/
├── asset-manifest.json
├── favicon.ico
├── index.html
├── main.abc123.js
├── manifest.json
├── service-worker.js
├── static
│   ├── fonts
│   │   ├── font.123.ttf
│   │   └── font.abc.woff2
│   ├── images
│   │   ├── img.z9000.jpeg
│   │   └── img.zyx.gif
│   ├── js
│   │   └── js.101010.js
│   └── media
│       ├── song.xyz1.mp3
│       └── video.abc101.mp4
└── subdir
    └── index.html
```

Great, let's just copy it with a command like `aws s3 sync` right?

Well - not so fast! We probably want to upload the hashed assets first and then
the html files. It wouldn't be nice for our users to load the new `index.html`
and then end up requesting a bundle that wasn't uploaded yet.

We also probably want to set the right `ContentType` for files like `*.woff2`.

**s3-xfer** is a wrapper around the AWS SDK's S3 `ManagedUpload`. Pass it
a config and it will do the rest.

## Usage

Code examples available in [example](./example).

```js
var xfer = require('s3-xfer');
var xferConfigs = require('./xferConfigs');

var workerConfig = {
  s3ClientPath: '/local/myS3Client.js'
};

xfer(xferConfigs, workerConfig);

// Output:
//  [General Assets]: /example/s3-xfer/test/sample/build/main.abc123.js to s3/test/main.abc123.js
//  [General Assets]: /example/s3-xfer/test/sample/build/static/images/img.zyx.gif to s3/test/static/images/img.zyx.gif
//  [General Assets]: /example/s3-xfer/test/sample/build/static/fonts/font.abc.woff2 to s3/test/static/fonts/font.abc.woff2
//  [General Assets]: /example/s3-xfer/test/sample/build/static/media/song.xyz1.mp3 to s3/test/static/media/song.xyz1.mp3
//  [General Assets]: /example/s3-xfer/test/sample/build/static/fonts/font.123.ttf to s3/test/static/fonts/font.123.ttf
//  [General Assets]: /example/s3-xfer/test/sample/build/static/js/js.101010.js to s3/test/static/js/js.101010.js
//  [General Assets]: /example/s3-xfer/test/sample/build/static/images/img.z9000.jpeg to s3/test/static/images/img.z9000.jpeg
//  [General Assets]: /example/s3-xfer/test/sample/build/static/media/video.abc101.mp4 to s3/test/static/media/video.abc101.mp4
//  [Fixed Assets]: /example/s3-xfer/test/sample/build/asset-manifest.json to s3/test/asset-manifest.json
//  [Fixed Assets]: /example/s3-xfer/test/sample/build/favicon.ico to s3/test/favicon.ico
//  [Fixed Assets]: /example/s3-xfer/test/sample/build/manifest.json to s3/test/manifest.json
//  [Fixed Assets]: /example/s3-xfer/test/sample/build/service-worker.js to s3/test/service-worker.js
//  [HTML]: /example/s3-xfer/test/sample/build/index.html to s3/test/index.html
//  [HTML]: /example/s3-xfer/test/sample/build/subdir/index.html to s3/test/subdir/index.html
```

- `xferConfigs`: `Array`, an array that describes a list of **s3-xfer** configs. See [Configuration](#Configuration) for more details.
- `workerConfig`: `Object` - *optional*, a object with the following attributes:
    - `aws`: `Object` - *conditional*, a object for configuring the
      initialization of the S3 client. Must be defined or `s3ClientPath`.
    - `s3ClientPath`: `String` - *conditional*, the absolute path to a
      node module that exports a s3 client. Must be defined or `aws`.
- `cb`: `function` - *optional*, a callback function that will get called when all uploads are completed.

## Configuration

A typical configuration might look like the following:

```javascript
// s3.xfer.config.js

var path = require('path');

module.exports = [
  {
    name: 'General Assets',
    glob: {
      nodir: true,
      allowEmpty: true,
      ignore: [
        '**/*.html',
        '**/asset-manifest.json',
        '**/favicon.ico',
        '**/manifest.json',
        '**/service-worker.js'
      ]
    },
    path: path.join(__dirname, '..', 'test', 'sample', 'build'),
    matcher: '**/*',
    s3: {
      bucket: 'test'
    }
  },
  {
    name: 'Fixed Assets',
    glob: {
      nodir: true,
      allowEmpty: true
    },
    path: path.join(__dirname, '..', 'test', 'sample', 'build'),
    matcher:
      '{asset-manifest.json,favicon.ico,manifest.json,service-worker.js}',
    s3: {
      bucket: 'test'
    }
  },
  {
    name: 'HTML',
    glob: {
      nodir: true,
      allowEmpty: true
    },
    path: path.join(__dirname, '..', 'test', 'sample', 'build'),
    matcher: '**/*.html',
    s3: {
      bucket: 'test'
    }
  }
];
```

The filepaths for *General Assets* will be retrieved, then uploaded. After it is completed, it will proceed to the next configuration for *Fixed Assets*. Finally *HTML* is uploaded last.

A configuration is composed of:

- `name`: `String`, user readable identifier for the configuration.
- `glob`: `Object`, a configuration object that is passed to [glob](https://github.com/isaacs/node-glob).
- `path`: `String`, path to the target folder to upload files from.
- `matcher`: `String`, the glob to append to the path that is passed to [glob](https://github.com/isaacs/node-glob).
- `s3`: `Object`, a object that is merged with other params to the [s3 upload function](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property).
