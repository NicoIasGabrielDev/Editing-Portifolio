import test from 'node:test';
import assert from 'node:assert/strict';
const {resolveMedia} = await import('../media.js').catch(() => ({}));

test('unfilled slots do not attempt playback', () => {
  assert.equal(typeof resolveMedia, 'function', 'media resolver not implemented');
  for (const value of ['', null, undefined, '  ']) assert.equal(resolveMedia(value), null);
});
test('supports HTTPS files and normal YouTube and Vimeo sharing URLs', () => {
  assert.equal(typeof resolveMedia, 'function', 'media resolver not implemented');
  assert.deepEqual(resolveMedia('https://example.com/edit.mp4?token=abc'), {type:'video',src:'https://example.com/edit.mp4?token=abc'});
  assert.deepEqual(resolveMedia('https://youtu.be/dQw4w9WgXcQ?t=2'), {type:'iframe',src:'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0'});
  assert.equal(resolveMedia('https://www.youtube.com/shorts/dQw4w9WgXcQ').type,'iframe');
  assert.equal(resolveMedia('https://vimeo.com/123456789').src,'https://player.vimeo.com/video/123456789?autoplay=1');
  assert.equal(resolveMedia('https://vimeo.com/123456789/abc123').src,'https://player.vimeo.com/video/123456789?autoplay=1&h=abc123');
});
test('rejects unsafe URLs, lookalike domains and unsupported media', () => {
  assert.equal(typeof resolveMedia, 'function', 'media resolver not implemented');
  for(const value of ['javascript:alert(1)','data:text/html,test','http://example.com/edit.mp4','https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ','https://example.com','https://youtube.com/watch?v=bad','not a url',{},'https://user:secret@example.com/edit.mp4']) assert.equal(resolveMedia(value),null);
});
