var findMimeType = require('../../lib/findMimeType');

describe('findMimeType', () => {
  it('returns image/jpeg', () => {
    expect(findMimeType('/tmp/1.2.3.jpeg')).toEqual('image/jpeg');
  });

  it('returns image/jpg', () => {
    expect(findMimeType('/tmp/1.2.3.jpg')).toEqual('image/jpeg');
  });

  it('returns image/png', () => {
    expect(findMimeType('/tmp/1.2.3.png')).toEqual('image/png');
  });

  it('returns application/font-woff', () => {
    expect(findMimeType('/tmp/1.2.3.woff')).toEqual('application/font-woff');
  });

  it('returns application/font-woff2', () => {
    expect(findMimeType('/tmp/1.2.3.woff2')).toEqual('application/font-woff2');
  });

  it('returns application/x-font-ttf', () => {
    expect(findMimeType('/tmp/1.2.3.ttf')).toEqual('application/x-font-ttf');
  });

  it('returns image/gif', () => {
    expect(findMimeType('/tmp/1.2.3.gif')).toEqual('image/gif');
  });

  it('returns image/svg+xml', () => {
    expect(findMimeType('/tmp/1.2.3.svg')).toEqual('image/svg+xml');
  });

  it('returns text/css', () => {
    expect(findMimeType('/tmp/1.2.3.css')).toEqual('text/css');
  });

  it('returns text/html', () => {
    expect(findMimeType('/tmp/1.2.3.html')).toEqual('text/html');
  });

  it('returns application/javascript', () => {
    expect(findMimeType('/tmp/1.2.3.js')).toEqual('application/javascript');
  });

  it('returns audio/mpeg', () => {
    expect(findMimeType('/tmp/1.2.3.mp3')).toEqual('audio/mpeg');
  });

  it('returns video/mpeg', () => {
    expect(findMimeType('/tmp/1.2.3.mp4')).toEqual('video/mp4');
  });
});
